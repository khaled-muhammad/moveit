from django.db import models

# Create your models here.
class Beam(models.Model):
    beam_id    = models.CharField(max_length=255, unique=True)
    beam_key   = models.TextField()
    beam_name  = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)