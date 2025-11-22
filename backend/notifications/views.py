# Принимают HTTP запросы от фронтенда
# Обрабатывают логику (присоединение к очереди и т.д.)
# Возвращают ответы фронтенду
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Event, EventQueue, Notification
from .serializers import EventSerializer, EventQueueSerializer, NotificationSerializer
from .services import QueueService, NotificationService

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def join_queue(self, request, pk=None):
        event = self.get_object()
        user = request.user
        
        queue_entry, created = QueueService.join_queue(event.id, user.id)
        
        if created:
            return Response({
                'message': f'Вы присоединились к очереди мероприятия "{event.title}"',
                'position': queue_entry.position
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'message': 'Вы уже в очереди этого мероприятия',
                'position': queue_entry.position
            }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def leave_queue(self, request, pk=None):
        event = self.get_object()
        user = request.user
        
        success = QueueService.leave_queue(event.id, user.id)
        
        if success:
            return Response({'message': 'Вы покинули очередь'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Вы не были в очереди'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def queue_status(self, request, pk=None):
        event = self.get_object()
        user_queue = EventQueue.objects.filter(
            event=event, 
            user=request.user, 
            is_active=True
        ).first()
        
        queue_data = {
            'event': EventSerializer(event).data,
            'user_in_queue': user_queue is not None,
            'user_position': user_queue.position if user_queue else None,
            'total_participants': event.participants,
            'max_participants': event.max_participants
        }
        
        return Response(queue_data)

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return NotificationService.get_user_notifications(self.request.user)

    @action(detail=False, methods=['get'])
    def unread(self, request):
        notifications = NotificationService.get_user_notifications(request.user, unread_only=True)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        NotificationService.mark_as_read(pk, request.user.id)
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all marked as read'})