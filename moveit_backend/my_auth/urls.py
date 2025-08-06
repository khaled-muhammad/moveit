"""
URL configuration for moveit project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, fetch_me, login_view, logout_view, CookieTokenRefreshView, delete_account_view, edit_profile_view, update_profile_picture_view

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('me/', fetch_me, name='fetch_me'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('delete-account/', delete_account_view, name='delete_account'),
    path('profile/', edit_profile_view, name='edit_profile'),
    path('profile-picture/', update_profile_picture_view, name='update_profile_picture'),
]