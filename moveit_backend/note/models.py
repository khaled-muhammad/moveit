import uuid
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

NOTE_TYPES = (
    ("text", "Text"),
    ("lexi_note", "Lexi Note"),
    ("image", "Image"),
    ("audio", "Audio"),
    ("video", "Video"),
)

class Note(models.Model):
    id              = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user            = models.ForeignKey(User, on_delete=models.CASCADE)
    title           = models.CharField(max_length=255, null=True, blank=True)
    content         = models.TextField(max_length=5000, null=True, blank=True)
    json_content    = models.JSONField(blank=True, null=True)
    note_type       = models.CharField(choices=NOTE_TYPES, max_length=30)

    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title or 'Untitled'} - {self.note_type}"