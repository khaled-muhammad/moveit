from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Note
from .serializers import NoteSerializer, NoteListSerializer, NoteCreateSerializer
from django.db import models

class NoteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NoteSerializer
    
    def get_queryset(self):
        return Note.objects.filter(user=self.request.user).order_by('-updated_at')
    
    def get_serializer_class(self):
        if self.action == 'list':
            return NoteListSerializer
        elif self.action == 'create':
            return NoteCreateSerializer
        return NoteSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_notes(self, request):
        queryset = self.get_queryset()
        
        note_type = request.query_params.get('note_type', None)
        if note_type:
            queryset = queryset.filter(note_type=note_type)
        
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) | 
                models.Q(content__icontains=search)
            )
        
        serializer = NoteListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        note = self.get_object()
        new_note = Note.objects.create(
            user=request.user,
            title=f"{note.title} (Copy)" if note.title else "Untitled (Copy)",
            content=note.content,
            json_content=note.json_content,
            note_type=note.note_type
        )
        serializer = self.get_serializer(new_note)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def note_types(self, request):
        note_types = [
            {'value': 'text', 'label': 'Text'},
            {'value': 'lexi_note', 'label': 'Lexi Note'},
            {'value': 'image', 'label': 'Image'},
            {'value': 'audio', 'label': 'Audio'},
            {'value': 'video', 'label': 'Video'},
        ]
        return Response(note_types)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        
        stats = {
            'total_notes': queryset.count(),
            'notes_by_type': {},
            'recent_notes': queryset[:5].count(),
        }
        
        for note_type in ['text', 'lexi_note', 'image', 'audio', 'video']:
            stats['notes_by_type'][note_type] = queryset.filter(note_type=note_type).count()
        
        return Response(stats)

class NoteDetailView(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NoteSerializer
    
    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        note = self.get_object()
        # XXX 'archived' field in model
        return Response({'message': 'Note archived successfully'})
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        note = self.get_object()
        #XXX
        return Response({'message': 'Note shared successfully'})