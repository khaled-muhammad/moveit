from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Q
from .models import Plan, UserPlan, PlanUsage, PlanFeature
from .serializers import (
    PlanSerializer, UserPlanSerializer, UserPlanCreateSerializer,
    PlanUsageSerializer, PlanFeatureSerializer, PlanComparisonSerializer
)


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing available plans
    """
    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'])
    def comparison(self, request):
        """Get plan comparison data"""
        plans = self.get_queryset().order_by('price_monthly')
        serializer = PlanComparisonSerializer({'plans': plans})
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def features(self, request, pk=None):
        """Get detailed features for a specific plan"""
        plan = self.get_object()
        return Response({
            'plan': PlanSerializer(plan).data,
            'detailed_features': PlanSerializer(plan).get_features(plan)
        })


class UserPlanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user plans and subscriptions
    """
    serializer_class = UserPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserPlan.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserPlanCreateSerializer
        return UserPlanSerializer
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current active plan for the user"""
        try:
            user_plan = UserPlan.objects.get(
                user=request.user,
                status='active'
            )
            serializer = self.get_serializer(user_plan)
            return Response(serializer.data)
        except UserPlan.DoesNotExist:
            # Return free plan if no active subscription
            try:
                free_plan = Plan.objects.get(name='free')
                return Response({
                    'plan': PlanSerializer(free_plan).data,
                    'status': 'free',
                    'message': 'No active subscription found'
                })
            except Plan.DoesNotExist:
                return Response(
                    {'error': 'No plans configured'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
    
    @action(detail=False, methods=['post'])
    def start_trial(self, request):
        """Start a free trial for a plan"""
        plan_id = request.data.get('plan_id')
        
        if not plan_id:
            return Response(
                {'error': 'Plan ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user already has an active plan
        if UserPlan.objects.filter(user=request.user, status='active').exists():
            return Response(
                {'error': 'You already have an active plan'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user has already used trial for this plan
        if UserPlan.objects.filter(
            user=request.user,
            plan_id=plan_id,
            is_trial=True
        ).exists():
            return Response(
                {'error': 'Trial already used for this plan'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            plan = Plan.objects.get(id=plan_id)
            
            # Create trial subscription
            user_plan = UserPlan.objects.create(
                user=request.user,
                plan=plan,
                status='trial',
                billing_period='monthly',
                is_trial=True
            )
            
            # Create usage tracking
            PlanUsage.objects.create(user_plan=user_plan)
            
            serializer = self.get_serializer(user_plan)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Plan.DoesNotExist:
            return Response(
                {'error': 'Plan not found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a subscription"""
        user_plan = self.get_object()
        
        if user_plan.status in ['cancelled', 'expired']:
            return Response(
                {'error': 'Plan is already cancelled or expired'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_plan.status = 'cancelled'
        user_plan.cancelled_at = timezone.now()
        user_plan.save()
        
        serializer = self.get_serializer(user_plan)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def reactivate(self, request, pk=None):
        """Reactivate a cancelled subscription"""
        user_plan = self.get_object()
        
        if user_plan.status != 'cancelled':
            return Response(
                {'error': 'Only cancelled plans can be reactivated'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if user_plan.is_expired:
            return Response(
                {'error': 'Plan has expired and cannot be reactivated'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_plan.status = 'active'
        user_plan.cancelled_at = None
        user_plan.save()
        
        serializer = self.get_serializer(user_plan)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def usage(self, request):
        """Get usage statistics for current plan"""
        try:
            user_plan = UserPlan.objects.get(
                user=request.user,
                status__in=['active', 'trial']
            )
            
            usage, created = PlanUsage.objects.get_or_create(
                user_plan=user_plan
            )
            
            # Check if usage needs to be reset
            if usage.should_reset_usage():
                usage.reset_monthly_usage()
            
            return Response({
                'plan': PlanSerializer(user_plan.plan).data,
                'usage': PlanUsageSerializer(usage).data,
                'limits': {
                    'max_beam_sessions': user_plan.plan.max_beam_sessions,
                    'max_file_size_mb': user_plan.plan.max_file_size_mb,
                    'session_history_days': user_plan.plan.session_history_days,
                },
                'status': {
                    'can_create_beam': user_plan.can_create_beam,
                    'days_remaining': user_plan.days_remaining,
                    'is_trial': user_plan.is_trial,
                }
            })
        
        except UserPlan.DoesNotExist:
            return Response(
                {'error': 'No active plan found'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['post'])
    def check_limits(self, request):
        """Check if user can perform specific actions"""
        action_type = request.data.get('action')
        
        try:
            user_plan = UserPlan.objects.get(
                user=request.user,
                status__in=['active', 'trial']
            )
        except UserPlan.DoesNotExist:
            # Default to free plan limits
            try:
                free_plan = Plan.objects.get(name='free')
                return Response({
                    'allowed': False,
                    'reason': 'Free plan limitations',
                    'plan': PlanSerializer(free_plan).data
                })
            except Plan.DoesNotExist:
                return Response(
                    {'error': 'No plans configured'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        if action_type == 'create_beam':
            allowed = user_plan.can_create_beam
            reason = None if allowed else f"Maximum beam sessions reached ({user_plan.plan.max_beam_sessions})"
        
        elif action_type == 'upload_file':
            file_size_mb = float(request.data.get('file_size_mb', 0))
            allowed = user_plan.can_upload_file(file_size_mb)
            
            if not user_plan.plan.has_file_uploads:
                reason = "File uploads not available in your plan"
            elif not allowed:
                reason = f"File size exceeds limit ({user_plan.plan.max_file_size_mb}MB)"
            else:
                reason = None
        
        elif action_type == 'use_rich_editor':
            allowed = user_plan.plan.has_rich_editor
            reason = None if allowed else "Rich editor not available in your plan"
        
        elif action_type == 'api_access':
            allowed = user_plan.plan.has_api_access
            reason = None if allowed else "API access not available in your plan"
        
        else:
            return Response(
                {'error': 'Invalid action type'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'allowed': allowed,
            'reason': reason,
            'plan': PlanSerializer(user_plan.plan).data,
            'upgrade_required': not allowed
        })


class PlanFeatureViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing plan features
    """
    queryset = PlanFeature.objects.all()
    serializer_class = PlanFeatureSerializer
    permission_classes = [permissions.AllowAny]
