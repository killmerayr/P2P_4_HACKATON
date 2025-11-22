# Преобразуют Django-модели в JSON для фронтенда
# и наоборот - JSON в Django-модели
# Мост между бэкендом и фронтендом
from rest_framework import serializers
from .models import Event, EventQueue, Notification

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class EventQueueSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = EventQueue
        fields = ['id', 'event', 'event_title', 'user', 'user_name', 'position', 'joined_at', 'is_active']

class NotificationSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True, allow_null=True)

    class Meta:
        model = Notification
        fields = ['id', 'event', 'event_title', 'notification_type', 'message', 'is_read', 'created_at', 'data']