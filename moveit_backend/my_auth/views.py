from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate

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

@api_view(['get'])
@permission_classes([IsAuthenticated])
def fetch_me(request):
    user    = request.user
    profile = user.profile

    response = Response({
        'user': {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'profile_picture': profile.profile_picture,
        }
    })

    return response

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'detail': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=email, password=password)

    if user is None:
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.is_active:
        return Response({'detail': 'Account is inactive.'}, status=status.HTTP_403_FORBIDDEN)

    # Generate tokens
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token

    # Set cookies
    profile = user.profile
    response = Response({
        'user': {
            'id': user.id,
            'name': user.get_full_name(),
            'email': user.email,
            'image': profile.profile_picture,
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