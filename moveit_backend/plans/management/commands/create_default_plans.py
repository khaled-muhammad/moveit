from django.core.management.base import BaseCommand
from plans.models import Plan


class Command(BaseCommand):
    help = 'Create default Airsynca subscription plans'

    def handle(self, *args, **options):
        self.stdout.write('Creating default plans...')

        # Free Plan
        free_defaults = {
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
                'has_templates': False,
                'has_version_history': False,
                'has_cloud_backup': False,
                'has_cross_device_sync': True,
                'has_ocr': False,
                'has_audio_transcription': False,
                'has_presentation_mode': False,
                'has_share_analytics': False,
                'support_level': 'community',
                'is_active': True
        }
        free_plan, created = Plan.objects.get_or_create(
            name='free',
            defaults=free_defaults
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Free plan'))
        else:
            # Update existing to match defaults
            for k, v in free_defaults.items():
                setattr(free_plan, k, v)
            free_plan.save()
            self.stdout.write('• Free plan updated')

        # Pro Plan
        pro_defaults = {
                'display_name': 'Pro',
                'description': 'Ideal for professionals and power users who need more headroom',
                'price_monthly': 8.00,
                'price_yearly': 80.00,  # Save 2 months
                'max_beam_sessions': 0,  # Unlimited
                'max_connected_devices': 10,
                'max_file_size_mb': 200,
                'session_history_days': 60,
                'has_rich_editor': True,
                'has_file_uploads': True,
                'has_advanced_permissions': False,
                'has_api_access': False,
                'has_sso_integration': False,
                'has_priority_support': True,
                'has_custom_branding': False,
                'has_analytics': False,
                'has_team_collaboration': False,
                'has_templates': True,
                'has_version_history': True,
                'has_cloud_backup': True,
                'has_cross_device_sync': True,
                'has_ocr': True,
                'has_audio_transcription': True,
                'has_presentation_mode': True,
                'has_share_analytics': False,
                'support_level': 'email',
                'is_active': True
        }
        pro_plan, created = Plan.objects.get_or_create(
            name='pro',
            defaults=pro_defaults
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Pro plan'))
        else:
            for k, v in pro_defaults.items():
                setattr(pro_plan, k, v)
            pro_plan.save()
            self.stdout.write('• Pro plan updated')

        # Premium Plan
        premium_defaults = {
                'display_name': 'Premium',
                'description': 'Advanced features for teams and heavy users who collaborate',
                'price_monthly': 16.00,
                'price_yearly': 160.00,  # Save 2 months
                'max_beam_sessions': 0,  # Unlimited
                'max_connected_devices': 0,  # Unlimited
                'max_file_size_mb': 1000,
                'session_history_days': 0,  # Unlimited
                'has_rich_editor': True,
                'has_file_uploads': True,
                'has_advanced_permissions': True,
                'has_api_access': False,
                'has_sso_integration': False,
                'has_priority_support': True,
                'has_custom_branding': True,
                'has_analytics': True,
                'has_team_collaboration': True,
                'has_templates': True,
                'has_version_history': True,
                'has_cloud_backup': True,
                'has_cross_device_sync': True,
                'has_ocr': True,
                'has_audio_transcription': True,
                'has_presentation_mode': True,
                'has_share_analytics': True,
                'support_level': 'live_chat',
                'is_active': True
        }
        premium_plan, created = Plan.objects.get_or_create(
            name='premium',
            defaults=premium_defaults
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Premium plan'))
        else:
            for k, v in premium_defaults.items():
                setattr(premium_plan, k, v)
            premium_plan.save()
            self.stdout.write('• Premium plan updated')

        # Enterprise Plan
        enterprise_defaults = {
                'display_name': 'Enterprise',
                'description': 'Full-scale solution for organizations',
                'price_monthly': 79.00,
                'price_yearly': 790.00,  # Save 2 months
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
                'has_templates': True,
                'has_version_history': True,
                'has_cloud_backup': True,
                'has_cross_device_sync': True,
                'has_ocr': True,
                'has_audio_transcription': True,
                'has_presentation_mode': True,
                'has_share_analytics': True,
                'support_level': 'sla',
                'is_active': True
        }
        enterprise_plan, created = Plan.objects.get_or_create(
            name='enterprise',
            defaults=enterprise_defaults
        )
        if created:
            self.stdout.write(self.style.SUCCESS('✓ Created Enterprise plan'))
        else:
            for k, v in enterprise_defaults.items():
                setattr(enterprise_plan, k, v)
            enterprise_plan.save()
            self.stdout.write('• Enterprise plan updated')

        self.stdout.write(
            self.style.SUCCESS('\nSuccessfully created/verified all default plans!')
        )
