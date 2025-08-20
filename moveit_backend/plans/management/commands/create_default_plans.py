from django.core.management.base import BaseCommand
from plans.models import Plan


class Command(BaseCommand):
    help = 'Create default Airsynca subscription plans'

    def handle(self, *args, **options):
        self.stdout.write('Creating default plans...')

        # Free Plan
        free_plan, created = Plan.objects.get_or_create(
            name='free',
            defaults={
                'display_name': 'Free',
                'description': 'Perfect for personal use and trying out Airsynca',
                'price_monthly': 0.00,
                'price_yearly': 0.00,
                'max_beam_sessions': 3,
                'max_connected_devices': 2,
                'max_file_size_mb': 0,  # No file uploads
                'session_history_days': 7,
                'has_rich_editor': False,
                'has_file_uploads': False,
                'has_advanced_permissions': False,
                'has_api_access': False,
                'has_sso_integration': False,
                'has_priority_support': False,
                'has_custom_branding': False,
                'has_analytics': False,
                'has_team_collaboration': False,
                'support_level': 'community',
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Free plan'))
        else:
            self.stdout.write('• Free plan already exists')

        # Pro Plan
        pro_plan, created = Plan.objects.get_or_create(
            name='pro',
            defaults={
                'display_name': 'Pro',
                'description': 'Ideal for professionals and power users',
                'price_monthly': 9.99,
                'price_yearly': 99.99,
                'max_beam_sessions': 0,  # Unlimited
                'max_connected_devices': 10,
                'max_file_size_mb': 100,
                'session_history_days': 30,
                'has_rich_editor': True,
                'has_file_uploads': True,
                'has_advanced_permissions': False,
                'has_api_access': False,
                'has_sso_integration': False,
                'has_priority_support': True,
                'has_custom_branding': False,
                'has_analytics': False,
                'has_team_collaboration': False,
                'support_level': 'email',
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Pro plan'))
        else:
            self.stdout.write('• Pro plan already exists')

        # Premium Plan
        premium_plan, created = Plan.objects.get_or_create(
            name='premium',
            defaults={
                'display_name': 'Premium',
                'description': 'Advanced features for teams and heavy users',
                'price_monthly': 19.99,
                'price_yearly': 199.99,
                'max_beam_sessions': 0,  # Unlimited
                'max_connected_devices': 0,  # Unlimited
                'max_file_size_mb': 500,
                'session_history_days': 0,  # Unlimited
                'has_rich_editor': True,
                'has_file_uploads': True,
                'has_advanced_permissions': True,
                'has_api_access': False,
                'has_sso_integration': False,
                'has_priority_support': True,
                'has_custom_branding': True,
                'has_analytics': True,
                'has_team_collaboration': False,
                'support_level': 'live_chat',
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Premium plan'))
        else:
            self.stdout.write('• Premium plan already exists')

        # Enterprise Plan
        enterprise_plan, created = Plan.objects.get_or_create(
            name='enterprise',
            defaults={
                'display_name': 'Enterprise',
                'description': 'Full-scale solution for organizations',
                'price_monthly': 49.99,
                'price_yearly': 499.99,
                'max_beam_sessions': 0,  # Unlimited
                'max_connected_devices': 0,  # Unlimited
                'max_file_size_mb': 0,  # Custom/Unlimited
                'session_history_days': 0,  # Unlimited
                'has_rich_editor': True,
                'has_file_uploads': True,
                'has_advanced_permissions': True,
                'has_api_access': True,
                'has_sso_integration': True,
                'has_priority_support': True,
                'has_custom_branding': True,
                'has_analytics': True,
                'has_team_collaboration': True,
                'support_level': 'sla',
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Enterprise plan'))
        else:
            self.stdout.write('• Enterprise plan already exists')

        self.stdout.write(
            self.style.SUCCESS('\nSuccessfully created/verified all default plans!')
        )
