from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Beam(models.Model):
    beam_id    = models.CharField(max_length=255, unique=True)
    beam_key   = models.TextField()
    user       = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    beam_name  = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.beam_name or self.beam_id} - {self.user.username if self.user else 'Anonymous'}"

class BeamShare(models.Model):
    SHARE_TYPES = (
        ('read', 'Read Only'),
        ('write', 'Read & Write'),
        ('admin', 'Admin'),
    )
    
    beam        = models.ForeignKey(Beam, on_delete=models.CASCADE, related_name='shares')
    shared_by   = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_beams')
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_beams')
    share_type  = models.CharField(max_length=10, choices=SHARE_TYPES, default='read')
    created_at  = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['beam', 'shared_with']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.beam.beam_id} shared with {self.shared_with.username} ({self.share_type})"