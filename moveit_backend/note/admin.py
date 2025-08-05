from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'note_type', 'beam', 'archived_at',
                    'created_at', 'updated_at')
    list_filter = ('note_type', 'archived_at', 'created_at', 'updated_at', 'user', 'beam')
    search_fields = ('title', 'content', 'user__username', 'user__email', 'beam__beam_id')
    readonly_fields = ('id', 'created_at', 'updated_at')
    ordering = ('-updated_at',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'beam', 'title', 'note_type')
        }),
        ('Content', {
            'fields': ('content', 'json_content'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('archived_at',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'beam')
