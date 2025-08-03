from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterModelSerializer(serializers.ModelSerializer):
    password      = serializers.CharField(write_only=True, required=True)
    first_name    = serializers.CharField(required=False)
    last_name     = serializers.CharField(required=False)
    phone_number  = serializers.CharField(write_only=True, required=False)
    profile_picture = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone_number', 'profile_picture']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        phone_number    = validated_data.pop('phone_number', None)
        profile_picture = validated_data.pop('profile_picture', None)

        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data.get('email'),
            password = validated_data['password'],
            first_name = validated_data.get('first_name', ''),
            last_name = validated_data.get('last_name', ''),
        )

        profile = user.profile
        profile.phone_number = phone_number
        if profile_picture:
            profile.profile_picture = profile_picture
        profile.save()

        return user