from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

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