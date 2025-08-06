from django.contrib import admin
from .models import Beam, BeamShare

# Register your models here.
@admin.register(Beam)
class BeamAdmin(admin.ModelAdmin):
    list_display = ('beam_id', 'beam_name', 'user', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('beam_id', 'beam_name', 'user__username')
    readonly_fields = ('beam_id', 'beam_key', 'created_at')
    ordering = ('-created_at',)

@admin.register(BeamShare)
class BeamShareAdmin(admin.ModelAdmin):
    list_display = ('beam', 'shared_by', 'shared_with', 'share_type', 'created_at')
    list_filter = ('share_type', 'created_at', 'shared_by', 'shared_with')
    search_fields = ('beam__beam_id', 'shared_by__username', 'shared_with__username')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)