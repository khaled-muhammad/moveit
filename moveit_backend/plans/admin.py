from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Plan, UserPlan, PlanUsage, PlanFeature, PlanPriceHistory


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = [
        'display_name', 'name', 'price_monthly', 'price_yearly',
        'yearly_savings_display', 'max_beam_sessions', 'max_connected_devices',
        'support_level', 'is_active', 'created_at'
    ]
    list_filter = [
        'name', 'is_active', 'support_level',
        'has_file_uploads', 'has_rich_editor', 'has_api_access'
    ]
    search_fields = ['display_name', 'description']
    readonly_fields = ['created_at', 'updated_at', 'yearly_savings_display']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'display_name', 'description', 'is_active')
        }),
        ('Pricing', {
            'fields': ('price_monthly', 'price_yearly', 'yearly_savings_display')
        }),
        ('Limits', {
            'fields': (
                'max_beam_sessions', 'max_connected_devices',
                'max_file_size_mb', 'session_history_days'
            )
        }),
        ('Features', {
            'fields': (
                'has_rich_editor', 'has_file_uploads', 'has_advanced_permissions',
                'has_api_access', 'has_sso_integration', 'has_priority_support',
                'has_custom_branding', 'has_analytics', 'has_team_collaboration'
            )
        }),
        ('Support', {
            'fields': ('support_level',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def yearly_savings_display(self, obj):
        savings = obj.get_yearly_savings()
        if savings > 0:
            return format_html(
                '<span style="color: green; font-weight: bold;">${:.2f}</span>',
                savings
            )
        return '$0.00'
    yearly_savings_display.short_description = 'Yearly Savings'
    
    def save_model(self, request, obj, form, change):
        if change:  # If updating existing plan
            # Get the original object
            original = Plan.objects.get(pk=obj.pk)
            
            # Check if prices changed
            if (original.price_monthly != obj.price_monthly or 
                original.price_yearly != obj.price_yearly):
                
                # Create price history record
                PlanPriceHistory.objects.create(
                    plan=obj,
                    old_price_monthly=original.price_monthly,
                    new_price_monthly=obj.price_monthly,
                    old_price_yearly=original.price_yearly,
                    new_price_yearly=obj.price_yearly,
                    changed_by=request.user,
                    reason=f"Updated via admin by {request.user.username}",
                    effective_date=timezone.now()
                )
        
        super().save_model(request, obj, form, change)


@admin.register(UserPlan)
class UserPlanAdmin(admin.ModelAdmin):
    list_display = [
        'user_link', 'plan_name', 'status', 'billing_period',
        'started_at', 'expires_at', 'days_remaining_display',
        'is_trial', 'current_beam_sessions'
    ]
    list_filter = [
        'status', 'billing_period', 'is_trial',
        'plan__name', 'started_at', 'expires_at'
    ]
    search_fields = ['user__username', 'user__email', 'plan__display_name']
    readonly_fields = [
        'created_at', 'updated_at', 'days_remaining_display',
        'is_expired_display', 'can_create_beam_display'
    ]
    raw_id_fields = ['user']
    
    fieldsets = (
        ('User & Plan', {
            'fields': ('user', 'plan', 'status')
        }),
        ('Subscription Details', {
            'fields': (
                'billing_period', 'started_at', 'expires_at', 'cancelled_at',
                'days_remaining_display', 'is_expired_display'
            )
        }),
        ('Trial Information', {
            'fields': ('is_trial', 'trial_expires_at'),
            'classes': ('collapse',)
        }),
        ('Payment Details', {
            'fields': ('stripe_subscription_id', 'stripe_customer_id'),
            'classes': ('collapse',)
        }),
        ('Usage Tracking', {
            'fields': (
                'current_beam_sessions', 'total_file_uploads',
                'total_data_transferred_mb', 'can_create_beam_display'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def user_link(self, obj):
        url = reverse('admin:auth_user_change', args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.username)
    user_link.short_description = 'User'
    
    def plan_name(self, obj):
        return obj.plan.display_name
    plan_name.short_description = 'Plan'
    
    def days_remaining_display(self, obj):
        days = obj.days_remaining
        if days <= 0:
            return format_html('<span style="color: red;">Expired</span>')
        elif days <= 7:
            return format_html('<span style="color: orange;">{} days</span>', days)
        else:
            return format_html('<span style="color: green;">{} days</span>', days)
    days_remaining_display.short_description = 'Days Remaining'
    
    def is_expired_display(self, obj):
        if obj.is_expired:
            return format_html('<span style="color: red;">Yes</span>')
        return format_html('<span style="color: green;">No</span>')
    is_expired_display.short_description = 'Is Expired'
    
    def can_create_beam_display(self, obj):
        if obj.can_create_beam:
            return format_html('<span style="color: green;">Yes</span>')
        return format_html('<span style="color: red;">No</span>')
    can_create_beam_display.short_description = 'Can Create Beam'


@admin.register(PlanUsage)
class PlanUsageAdmin(admin.ModelAdmin):
    list_display = [
        'user_plan_info', 'beam_sessions_created', 'files_uploaded',
        'total_file_size_mb', 'notes_created', 'api_calls_made',
        'last_reset_date'
    ]
    list_filter = ['last_reset_date', 'user_plan__plan__name']
    search_fields = [
        'user_plan__user__username', 'user_plan__plan__display_name'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    def user_plan_info(self, obj):
        return f"{obj.user_plan.user.username} - {obj.user_plan.plan.display_name}"
    user_plan_info.short_description = 'User Plan'
    
    def has_add_permission(self, request):
        return False  # Usage is auto-created with UserPlan


@admin.register(PlanFeature)
class PlanFeatureAdmin(admin.ModelAdmin):
    list_display = ['name', 'feature_key', 'created_at']
    search_fields = ['name', 'feature_key', 'description']
    readonly_fields = ['created_at']


@admin.register(PlanPriceHistory)
class PlanPriceHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'plan_name', 'price_change_display', 'changed_by',
        'effective_date', 'created_at'
    ]
    list_filter = ['plan__name', 'effective_date', 'changed_by']
    search_fields = ['plan__display_name', 'reason']
    readonly_fields = ['created_at']
    raw_id_fields = ['changed_by']
    
    def plan_name(self, obj):
        return obj.plan.display_name
    plan_name.short_description = 'Plan'
    
    def price_change_display(self, obj):
        monthly_change = obj.new_price_monthly - obj.old_price_monthly
        yearly_change = obj.new_price_yearly - obj.old_price_yearly
        
        monthly_color = 'green' if monthly_change > 0 else 'red'
        yearly_color = 'green' if yearly_change > 0 else 'red'
        
        return format_html(
            'Monthly: <span style="color: {};">${:.2f} → ${:.2f}</span><br>'
            'Yearly: <span style="color: {};">${:.2f} → ${:.2f}</span>',
            monthly_color, obj.old_price_monthly, obj.new_price_monthly,
            yearly_color, obj.old_price_yearly, obj.new_price_yearly
        )
    price_change_display.short_description = 'Price Changes'
    
    def has_add_permission(self, request):
        return False  # Price history is auto-created


# Custom admin actions
@admin.action(description='Reset monthly usage for selected plans')
def reset_monthly_usage(modeladmin, request, queryset):
    for usage in queryset:
        usage.reset_monthly_usage()
    modeladmin.message_user(
        request,
        f"Successfully reset monthly usage for {queryset.count()} plan(s)."
    )

PlanUsageAdmin.actions = [reset_monthly_usage]
