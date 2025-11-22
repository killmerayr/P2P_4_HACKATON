from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings

#модели бд опеределяет
# Определяет структуру данных:
# - Event: мероприятия
# - EventQueue: очередь на мероприятия  
# - Notification: уведомления
# Это "скелет" вашего приложения

class Event(models.Model):
    title = models.CharField(max_length=255)
    date = models.CharField(max_length=100)
    time = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    organizer = models.CharField(max_length=255)
    participants = models.IntegerField(default=0)
    max_participants = models.IntegerField(default=30)
    category = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class EventQueue(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='queue')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 
    position = models.IntegerField()
    joined_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['position']

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('queue_update', 'Обновление очереди'),
        ('user_removed', 'Пользователь удален'),
        ('event_full', 'Мероприятие заполнено'),
        ('turn_soon', 'Скоро ваша очередь'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True, blank=True)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    data = models.JSONField(default=dict)  # Дополнительные данные

    class Meta:
        ordering = ['-created_at']