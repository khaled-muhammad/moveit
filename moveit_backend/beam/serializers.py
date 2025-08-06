from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Beam, BeamShare

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class BeamSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Beam
        fields = ['beam_id', 'beam_key', 'beam_name', 'user', 'created_at']

class BeamShareSerializer(serializers.ModelSerializer):
    beam = BeamSerializer(read_only=True)
    shared_by = UserSerializer(read_only=True)
    shared_with = UserSerializer(read_only=True)
    
    class Meta:
        model = BeamShare
        fields = ['id', 'beam', 'shared_by', 'shared_with', 'share_type', 'created_at']
        read_only_fields = ['id', 'created_at']

class CreateBeamShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = BeamShare
        fields = ['beam', 'shared_with', 'share_type']
    
    def validate(self, data):
        beam = data.get('beam')
        shared_with = data.get('shared_with')
        
        if BeamShare.objects.filter(beam=beam, shared_with=shared_with).exists():
            raise serializers.ValidationError("Beam is already shared with this user.")
        
        if beam.user == shared_with:
            raise serializers.ValidationError("Cannot share beam with yourself.")
        
        return data