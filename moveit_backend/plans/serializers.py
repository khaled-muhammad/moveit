from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Plan, UserPlan, PlanUsage, PlanFeature, PlanPriceHistory


class PlanSerializer(serializers.ModelSerializer):
    yearly_savings = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    
    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'display_name', 'description',
            'price_monthly', 'price_yearly', 'yearly_savings',
            'max_beam_sessions', 'max_connected_devices', 'max_file_size_mb',
            'session_history_days', 'has_rich_editor', 'has_file_uploads',
            'has_advanced_permissions', 'has_api_access', 'has_sso_integration',
            'has_priority_support', 'has_custom_branding', 'has_analytics',
            'has_team_collaboration', 'has_templates', 'has_version_history',
            'has_cloud_backup', 'has_cross_device_sync', 'has_ocr',
            'has_audio_transcription', 'has_presentation_mode', 'has_share_analytics',
            'support_level', 'features', 'is_active'
        ]
    
    def get_yearly_savings(self, obj):
        return obj.get_yearly_savings()
    
    def get_features(self, obj):
        """Return a list of feature descriptions for the plan"""
        features = []
        
        # Basic features
        if obj.max_beam_sessions == 0:
            features.append("Unlimited beam sessions")
        else:
            features.append(f"Up to {obj.max_beam_sessions} beam sessions")
        
        if obj.max_connected_devices == 0:
            features.append("Unlimited connected devices")
        else:
            features.append(f"Up to {obj.max_connected_devices} connected devices per beam")
        
        if obj.session_history_days == 0:
            features.append("Unlimited session history")
        else:
            features.append(f"{obj.session_history_days}-day session history")
        
        # File upload features
        if obj.has_file_uploads:
            if obj.max_file_size_mb == 0:
                features.append("Unlimited file uploads")
            else:
                features.append(f"File uploads (up to {obj.max_file_size_mb}MB per file)")
        
        # Advanced features
        if obj.has_rich_editor:
            features.append("Rich Lexi note editor")
        
        if obj.has_advanced_permissions:
            features.append("Advanced beam sharing permissions")
        
        if obj.has_api_access:
            features.append("API access for integrations")
        
        if obj.has_sso_integration:
            features.append("SSO integration")
        
        if obj.has_custom_branding:
            features.append("Custom beam branding")
        
        if obj.has_analytics:
            features.append("Advanced analytics")
        
        if obj.has_team_collaboration:
            features.append("Team collaboration dashboard")

        # New recurring value features
        if obj.has_templates:
            features.append("Session templates & presets")
        if obj.has_version_history:
            features.append("Version history")
        if obj.has_cloud_backup:
            features.append("Cloud backup & restore")
        if obj.has_cross_device_sync:
            features.append("Cross-device sync")
        if obj.has_ocr:
            features.append("Image OCR")
        if obj.has_audio_transcription:
            features.append("Audio transcription")
        if obj.has_presentation_mode:
            features.append("Fullscreen presentation mode")
        if obj.has_share_analytics:
            features.append("Share analytics")
        
        # Support level
        support_mapping = {
            'community': 'Community support',
            'email': 'Priority email support',
            'live_chat': 'Live chat support',
            'sla': 'Priority support with SLA'
        }
        features.append(support_mapping.get(obj.support_level, 'Community support'))
        
        return features


class PlanUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanUsage
        fields = [
            'beam_sessions_created', 'files_uploaded', 'total_file_size_mb',
            'notes_created', 'api_calls_made', 'total_beam_sessions',
            'total_files_uploaded', 'total_notes_created', 'total_api_calls',
            'last_reset_date'
        ]


class UserPlanSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    usage = PlanUsageSerializer(read_only=True)
    days_remaining = serializers.ReadOnlyField()
    is_expired = serializers.ReadOnlyField()
    is_trial_expired = serializers.ReadOnlyField()
    can_create_beam = serializers.ReadOnlyField()
    
    class Meta:
        model = UserPlan
        fields = [
            'id', 'plan', 'status', 'billing_period', 'started_at',
            'expires_at', 'cancelled_at', 'is_trial', 'trial_expires_at',
            'current_beam_sessions', 'usage', 'days_remaining',
            'is_expired', 'is_trial_expired', 'can_create_beam'
        ]


class UserPlanCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPlan
        fields = ['plan', 'billing_period', 'is_trial']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PlanFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanFeature
        fields = ['id', 'name', 'description', 'feature_key']


class PlanPriceHistorySerializer(serializers.ModelSerializer):
    changed_by_username = serializers.CharField(source='changed_by.username', read_only=True)
    
    class Meta:
        model = PlanPriceHistory
        fields = [
            'id', 'old_price_monthly', 'new_price_monthly',
            'old_price_yearly', 'new_price_yearly', 'changed_by_username',
            'reason', 'effective_date', 'created_at'
        ]


class PlanComparisonSerializer(serializers.Serializer):
    """Serializer for comparing multiple plans"""
    plans = PlanSerializer(many=True)
    comparison_features = serializers.ListField(child=serializers.CharField())
    
    def to_representation(self, instance):
        plans = instance.get('plans', [])
        
        # Generate comparison matrix
        comparison_data = {
            'plans': PlanSerializer(plans, many=True).data,
            'features': {}
        }
        
        # Define feature comparison categories
        feature_categories = {
            'Basic Features': [
                ('max_beam_sessions', 'Beam Sessions'),
                ('max_connected_devices', 'Connected Devices'),
                ('session_history_days', 'Session History'),
            ],
            'Content Features': [
                ('has_file_uploads', 'File Uploads'),
                ('max_file_size_mb', 'Max File Size'),
                ('has_rich_editor', 'Rich Editor'),
            ],
            'Advanced Features': [
                ('has_advanced_permissions', 'Advanced Permissions'),
                ('has_api_access', 'API Access'),
                ('has_sso_integration', 'SSO Integration'),
                ('has_custom_branding', 'Custom Branding'),
                ('has_analytics', 'Analytics'),
                ('has_team_collaboration', 'Team Collaboration'),
            ],
            'Support': [
                ('support_level', 'Support Level'),
            ]
        }
        
        for category, features in feature_categories.items():
            comparison_data['features'][category] = []
            for field_name, display_name in features:
                feature_comparison = {
                    'name': display_name,
                    'values': []
                }
                
                for plan in plans:
                    value = getattr(plan, field_name)
                    
                    # Format the value for display
                    if field_name == 'max_beam_sessions' and value == 0:
                        formatted_value = 'Unlimited'
                    elif field_name == 'max_connected_devices' and value == 0:
                        formatted_value = 'Unlimited'
                    elif field_name == 'session_history_days' and value == 0:
                        formatted_value = 'Unlimited'
                    elif field_name == 'max_file_size_mb' and value == 0:
                        formatted_value = 'Unlimited'
                    elif field_name == 'max_file_size_mb' and value > 0:
                        formatted_value = f'{value}MB'
                    elif field_name in ['session_history_days'] and value > 0:
                        formatted_value = f'{value} days'
                    elif isinstance(value, bool):
                        formatted_value = '✅' if value else '❌'
                    elif field_name == 'support_level':
                        support_mapping = {
                            'community': 'Community',
                            'email': 'Email',
                            'live_chat': 'Live Chat',
                            'sla': 'SLA'
                        }
                        formatted_value = support_mapping.get(value, value)
                    else:
                        formatted_value = str(value) if value else 'None'
                    
                    feature_comparison['values'].append(formatted_value)
                
                comparison_data['features'][category].append(feature_comparison)
        
        return comparison_data
