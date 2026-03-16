from django.db import models
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from django.utils import timezone


class Plan(models.Model):
    PLAN_TYPES = (
        ('free', 'Free'),
        ('pro', 'Pro'),
        ('premium', 'Premium'),
        ('enterprise', 'Enterprise'),
    )
    
    BILLING_PERIODS = (
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    )
    
    name = models.CharField(max_length=50, choices=PLAN_TYPES)
    display_name = models.CharField(max_length=100)
    description = models.TextField()
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    price_yearly = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Plan Limits
    max_beam_sessions = models.IntegerField(default=0)  # 0 means unlimited
    max_connected_devices = models.IntegerField(default=0)  # 0 means unlimited
    max_file_size_mb = models.IntegerField(default=0)  # 0 means unlimited
    session_history_days = models.IntegerField(default=0)  # 0 means unlimited
    
    # Features
    has_rich_editor = models.BooleanField(default=False)
    has_file_uploads = models.BooleanField(default=False)
    has_advanced_permissions = models.BooleanField(default=False)
    has_api_access = models.BooleanField(default=False)
    has_sso_integration = models.BooleanField(default=False)
    has_priority_support = models.BooleanField(default=False)
    has_custom_branding = models.BooleanField(default=False)
    has_analytics = models.BooleanField(default=False)
    has_team_collaboration = models.BooleanField(default=False)
    # New recurring value features
    has_templates = models.BooleanField(default=False)
    has_version_history = models.BooleanField(default=False)
    has_cloud_backup = models.BooleanField(default=False)
    has_cross_device_sync = models.BooleanField(default=False)
    has_ocr = models.BooleanField(default=False)
    has_audio_transcription = models.BooleanField(default=False)
    has_presentation_mode = models.BooleanField(default=False)
    has_share_analytics = models.BooleanField(default=False)
    
    # Support Level
    SUPPORT_LEVELS = (
        ('community', 'Community'),
        ('email', 'Email'),
        ('live_chat', 'Live Chat'),
        ('sla', 'SLA'),
    )
    support_level = models.CharField(max_length=20, choices=SUPPORT_LEVELS, default='community')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price_monthly']
        unique_together = ['name']
    
    def __str__(self):
        return f"{self.display_name} - ${self.price_monthly}/month"
    
    def get_yearly_savings(self):
        """Calculate yearly savings compared to monthly billing"""
        yearly_equivalent = self.price_monthly * 12
        return yearly_equivalent - self.price_yearly


class UserPlan(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('trial', 'Trial'),
    )
    
    BILLING_PERIODS = (
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_plans')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    billing_period = models.CharField(max_length=10, choices=BILLING_PERIODS, default='monthly')
    
    # Subscription Details
    started_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    # Trial Information
    is_trial = models.BooleanField(default=False)
    trial_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Payment Information
    stripe_subscription_id = models.CharField(max_length=255, null=True, blank=True)
    stripe_customer_id = models.CharField(max_length=255, null=True, blank=True)
    
    # Usage Tracking
    current_beam_sessions = models.IntegerField(default=0)
    total_file_uploads = models.IntegerField(default=0)
    total_data_transferred_mb = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['user', 'status']
        constraints = [
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(status='active'),
                name='one_active_plan_per_user'
            )
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.plan.display_name} ({self.status})"
    
    def save(self, *args, **kwargs):
        # Set expiration date based on billing period
        if not self.expires_at:
            if self.billing_period == 'monthly':
                self.expires_at = self.started_at + timedelta(days=30)
            else:  # yearly
                self.expires_at = self.started_at + timedelta(days=365)
        
        # Set trial expiration (14 days from start)
        if self.is_trial and not self.trial_expires_at:
            self.trial_expires_at = self.started_at + timedelta(days=14)
        
        super().save(*args, **kwargs)
    
    @property
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    @property
    def is_trial_expired(self):
        return self.is_trial and self.trial_expires_at and timezone.now() > self.trial_expires_at
    
    @property
    def days_remaining(self):
        if self.is_expired:
            return 0
        return (self.expires_at - timezone.now()).days
    
    @property
    def can_create_beam(self):
        """Check if user can create new beam sessions"""
        if self.plan.max_beam_sessions == 0:  # unlimited
            return True
        return self.current_beam_sessions < self.plan.max_beam_sessions
    
    @property
    def can_upload_file(self, file_size_mb):
        """Check if user can upload file of given size"""
        if not self.plan.has_file_uploads:
            return False
        if self.plan.max_file_size_mb == 0:  # unlimited
            return True
        return file_size_mb <= self.plan.max_file_size_mb


class PlanUsage(models.Model):
    """Track detailed usage statistics for each user plan"""
    user_plan = models.OneToOneField(UserPlan, on_delete=models.CASCADE, related_name='usage')
    
    # Current Month Usage
    beam_sessions_created = models.IntegerField(default=0)
    files_uploaded = models.IntegerField(default=0)
    total_file_size_mb = models.IntegerField(default=0)
    notes_created = models.IntegerField(default=0)
    api_calls_made = models.IntegerField(default=0)
    
    # Historical Usage
    total_beam_sessions = models.IntegerField(default=0)
    total_files_uploaded = models.IntegerField(default=0)
    total_notes_created = models.IntegerField(default=0)
    total_api_calls = models.IntegerField(default=0)
    
    # Last Reset (for monthly limits)
    last_reset_date = models.DateField(default=timezone.now)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Usage for {self.user_plan.user.username}"
    
    def reset_monthly_usage(self):
        """Reset monthly usage counters"""
        self.beam_sessions_created = 0
        self.files_uploaded = 0
        self.total_file_size_mb = 0
        self.notes_created = 0
        self.api_calls_made = 0
        self.last_reset_date = timezone.now().date()
        self.save()
    
    def should_reset_usage(self):
        """Check if monthly usage should be reset"""
        today = timezone.now().date()
        return today.replace(day=1) > self.last_reset_date.replace(day=1)


class PlanFeature(models.Model):
    """Additional features that can be added to plans"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    feature_key = models.CharField(max_length=50, unique=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name


class PlanPriceHistory(models.Model):
    """Track price changes for plans"""
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='price_history')
    old_price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    new_price_monthly = models.DecimalField(max_digits=10, decimal_places=2)
    old_price_yearly = models.DecimalField(max_digits=10, decimal_places=2)
    new_price_yearly = models.DecimalField(max_digits=10, decimal_places=2)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    reason = models.TextField(blank=True)
    effective_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.plan.name} price change on {self.effective_date}"
