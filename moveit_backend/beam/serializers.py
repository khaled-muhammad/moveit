from rest_framework import serializers
from .models import Beam

class BeamSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Beam
        fields = ['beam_id', 'beam_key']