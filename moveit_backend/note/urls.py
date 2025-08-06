from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, NoteDetailView

router = DefaultRouter()
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'note-detail', NoteDetailView, basename='note-detail')

urlpatterns = [
    path('', include(router.urls)),
]