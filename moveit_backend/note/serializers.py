from rest_framework import serializers
from .models import Note
from django.contrib.auth.models import User
from beam.models import Beam

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class BeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beam
        fields = ['beam_id', 'beam_key', 'created_at']

class NoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    beam = BeamSerializer(read_only=True)
    beam_id = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = Note
        fields = [
            'id', 'user', 'user_id', 'beam', 'beam_id', 'title', 'content', 
            'json_content', 'note_type', 'archived_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_note_type(self, value):
        valid_types = ['text', 'lexi_note', 'image', 'audio', 'video']
        if value not in valid_types:
            raise serializers.ValidationError(f"Invalid note type. Must be one of: {valid_types}")
        return value
    
    def validate_content(self, value):
        if value and len(value) > 5000:
            raise serializers.ValidationError("Content cannot exceed 5000 characters.")
        return value
    
    def validate_title(self, value):
        if value and len(value) > 255:
            raise serializers.ValidationError("Title cannot exceed 255 characters.")
        return value
    
    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        validated_data['user_id'] = user_id
        
        beam_id = validated_data.pop('beam_id', None)
        if beam_id:
            try:
                beam = Beam.objects.get(beam_id=beam_id)
                validated_data['beam'] = beam
            except Beam.DoesNotExist:
                pass
        
        return super().create(validated_data)

class NoteListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    beam = BeamSerializer(read_only=True)
    
    class Meta:
        model = Note
        fields = ['id', 'user', 'beam', 'title', 'note_type', 'archived_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class NoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['title', 'content', 'json_content', 'note_type', 'user_id', 'beam_id']
    
    def validate(self, data):
        if not data.get('content') and not data.get('json_content'):
            raise serializers.ValidationError("Either content or json_content must be provided.")
        return data