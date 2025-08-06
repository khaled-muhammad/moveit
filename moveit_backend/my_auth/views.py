from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from datetime import timedelta
import base64
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import RegisterModelSerializer

# Create your views here.

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterModelSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            res = Response({
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone_number': user.profile.phone_number,
                    'profile_picture': request.build_absolute_uri(user.profile.profile_picture.url) if user.profile.profile_picture else None,
                },
            }, status=status.HTTP_201_CREATED)

            res.set_cookie(
                key='access_token',
                value=str(refresh.access_token),
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=86400 * 15
            )

            res.set_cookie(
                key='refresh_token',
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=86400 * 30  # 30 day
            )

            return res

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            res = Response({'detail': 'Refresh token not provided in cookies.'}, status=status.HTTP_400_BAD_REQUEST)
            res.delete_cookie('access_token', '/')
            res.delete_cookie('refresh_token', '/')
            return res

        serializer = self.get_serializer(data={'refresh': refresh_token})

        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            response = Response({'detail': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
            response.delete_cookie(
                key='refresh_token',
                path='/',
                samesite='None',
            )
            return response

        access_token = serializer.validated_data.get('access')

        response = Response({'success': True}, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=access_token,
            max_age=int(timedelta(days=15).total_seconds()),
            httponly=True,
            secure=True,
            samesite='None',
        )

        return response

@api_view(['get'])
@permission_classes([IsAuthenticated])
def fetch_me(request):
    user    = request.user

    response = Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'profile_picture': request.build_absolute_uri(user.profile.profile_picture.url) if user.profile.profile_picture else None,
        }
    })

    return response

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({'detail': 'Account is inactive.'}, status=status.HTTP_403_FORBIDDEN)

    # Generate tokens
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    # Set cookies
    response = Response({
        'user': {
            'id': user.id,
            'name': user.get_full_name(),
            'email': user.email,
            'profile_picture': request.build_absolute_uri(user.profile.profile_picture.url) if user.profile.profile_picture else None,
        }
    })

    response.set_cookie(
        key='access_token',
        value=str(access),
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=86400 * 15  # 15 days
    )

    response.set_cookie(
        key='refresh_token',
        value=str(refresh),
        httponly=True,
        secure=True,
        samesite='Strict',
        max_age=86400 * 30  # 30 day
    )

    return response

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account_view(request):
    user     = request.user
    password = request.data.get('password')
    
    if not password:
        return Response({
            'detail': 'Password confirmation is required to delete your account.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(password):
        return Response({
            'detail': 'Invalid password. Please provide your current password to confirm account deletion.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        username = user.username
        user.delete()
        
        response = Response({
            'detail': f'Account "{username}" has been permanently deleted.'
        }, status=status.HTTP_200_OK)
        
        response.delete_cookie(
            key='access_token',
            path='/',
            samesite='None',
        )
        
        response.delete_cookie(
            key='refresh_token',
            path='/',
            samesite='None',
        )
        
        return response
        
    except Exception as e:
        return Response({
            'detail': 'An error occurred while deleting your account. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def edit_profile_view(request):
    user = request.user
    
    try:
        name     = request.data.get('name', '')
        username = request.data.get('username', '')
        email    = request.data.get('email', '')
        
        if not username:
            return Response({
                'detail': 'Username is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not email:
            return Response({
                'detail': 'Email is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exclude(id=user.id).exists():
            return Response({
                'detail': 'Username is already taken.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exclude(id=user.id).exists():
            return Response({
                'detail': 'Email is already taken.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if name != '':
            splitted_name = name.split(" ")
            first_name = splitted_name[0]
            last_name  = name.removeprefix(f"{first_name} ")

            user.first_name = first_name
            user.last_name  = last_name

        user.username = username
        user.email = email
        user.save()
        
        response = Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'profile_picture': request.build_absolute_uri(user.profile.profile_picture.url) if user.profile.profile_picture else None,
            },
            'detail': 'Profile updated successfully.'
        })
        
        return response
        
    except Exception as e:
        return Response({
            'detail': 'An error occurred while updating your profile. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile_picture_view(request):
    user = request.user
    
    try:
        if 'profile_picture' not in request.FILES:
            return Response({
                'detail': 'Profile picture file is required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        profile_picture_file = request.FILES['profile_picture']
        
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if profile_picture_file.content_type not in allowed_types:
            return Response({
                'detail': 'Invalid file type. Please upload a valid image (JPEG, PNG, GIF, WebP).'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        max_size = 5 * 1024 * 1024  # 5MB
        if profile_picture_file.size > max_size:
            return Response({
                'detail': 'File size too large. Please upload an image smaller than 5MB.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        file_extension = profile_picture_file.name.split('.')[-1]
        filename = f"profile_{user.id}_{int(timedelta().total_seconds())}.{file_extension}"
        
        user.profile.profile_picture.save(filename, profile_picture_file, save=True)
        
        response = Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'profile_picture': request.build_absolute_uri(user.profile.profile_picture.url),
            },
            'detail': 'Profile picture updated successfully.'
        })
        
        return response
        
    except Exception as e:
        return Response({
            'detail': 'An error occurred while updating your profile picture. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    response = Response({'detail': 'Logged out successfully.'})

    response.delete_cookie(
        key='access_token',
        path='/',
        samesite='None',
    )

    response.delete_cookie(
        key='refresh_token',
        path='/',
        samesite='None',
    )

    return response