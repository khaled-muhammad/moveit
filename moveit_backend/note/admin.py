from django.contrib import admin
from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'note_type',
                    'created_at', 'updated_at')
    list_filter = ('note_type', 'created_at', 'updated_at', 'user')
    search_fields = ('title', 'content', 'user__username', 'user__email')
    readonly_fields = ('id', 'created_at', 'updated_at')
    ordering = ('-updated_at',)

    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'user', 'title', 'note_type')
        }),
        ('Content', {
            'fields': ('content', 'json_content'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')
