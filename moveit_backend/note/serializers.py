from rest_framework import serializers
from .models import Note
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class NoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Note
        fields = [
            'id', 'user', 'user_id', 'title', 'content', 
            'json_content', 'note_type', 'created_at', 'updated_at'
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
        return super().create(validated_data)

class NoteListSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Note
        fields = ['id', 'user', 'title', 'note_type', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class NoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['title', 'content', 'json_content', 'note_type', 'user_id']
    
    def validate(self, data):
        if not data.get('content') and not data.get('json_content'):
            raise serializers.ValidationError("Either content or json_content must be provided.")
        return data