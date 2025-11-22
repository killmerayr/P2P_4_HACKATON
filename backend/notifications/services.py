# Самая важная часть! Здесь:
# - QueueService.join_queue() - логика присоединения к очереди
# - QueueService.check_and_send_notifications() - ПРОВЕРКА УВЕДОМЛЕНИЙ!
# - NotificationService.send_websocket_notification() - отправка уведомлений
from django.db import models
from django.db import transaction
from django.db.models import F
from .models import Event, EventQueue, Notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import json
from django.utils import timezone

class QueueService:
    @staticmethod
    def join_queue(event_id, user_id):
        with transaction.atomic():
            event = Event.objects.select_for_update().get(id=event_id)
            
            # Проверяем, не в очереди ли уже пользователь
            existing_queue = EventQueue.objects.filter(
                event_id=event_id, 
                user_id=user_id, 
                is_active=True
            ).first()
            
            if existing_queue:
                return existing_queue, False  # Уже в очереди
            
            # Получаем последнюю позицию в очереди
            last_position = EventQueue.objects.filter(
                event_id=event_id, 
                is_active=True
            ).aggregate(models.Max('position'))['position__max'] or 0
            
            new_position = last_position + 1
            
            queue_entry = EventQueue.objects.create(
                event=event,
                user_id=user_id,
                position=new_position
            )
            
            # Обновляем счетчик участников
            event.participants = EventQueue.objects.filter(
                event_id=event_id, 
                is_active=True
            ).count()
            event.save()
            
            # Проверяем и отправляем уведомления
            QueueService.check_and_send_notifications(event_id, user_id, new_position)
            
            return queue_entry, True

    @staticmethod
    def leave_queue(event_id, user_id):
        with transaction.atomic():
            queue_entry = EventQueue.objects.filter(
                event_id=event_id, 
                user_id=user_id, 
                is_active=True
            ).first()
            
            if queue_entry:
                position = queue_entry.position
                queue_entry.is_active = False
                queue_entry.save()
                
                # Обновляем позиции остальных участников
                EventQueue.objects.filter(
                    event_id=event_id,
                    position__gt=position,
                    is_active=True
                ).update(position=F('position') - 1)
                
                # Обновляем счетчик участников
                event = Event.objects.get(id=event_id)
                event.participants = EventQueue.objects.filter(
                    event_id=event_id, 
                    is_active=True
                ).count()
                event.save()
                
                # Отправляем уведомление об удалении
                NotificationService.create_notification(
                    user_id=user_id,
                    event_id=event_id,
                    notification_type='user_removed',
                    message=f'Вы были удалены из очереди мероприятия "{event.title}"'
                )
                
                return True
            return False

    @staticmethod
    def check_and_send_notifications(event_id, user_id, position):
        """Проверяем нужно ли отправить уведомление о скорой очереди"""
        if position <= 2:  # Если пользователь в первых двух позициях
            event = Event.objects.get(id=event_id)
            
            if position == 1:
                message = "Ваша очередь скоро подойдёт! Вы следующий."
            else:
                message = "Ваша очередь скоро подойдёт! Осталось немного."
            
            # Создаем уведомление
            NotificationService.create_notification(
                user_id=user_id,
                event_id=event_id,
                notification_type='turn_soon',
                message=message,
                data={'position': position}
            )
            
            # Отправляем через WebSocket
            NotificationService.send_websocket_notification(
                user_id=user_id,
                notification_type='turn_soon',
                message=message,
                event_title=event.title,
                position=position
            )

class NotificationService:
    @staticmethod
    def create_notification(user_id, event_id=None, notification_type='info', message='', data=None):
        notification = Notification.objects.create(
            user_id=user_id,
            event_id=event_id,
            notification_type=notification_type,
            message=message,
            data=data or {}
        )
        return notification

    @staticmethod
    def send_websocket_notification(user_id, notification_type, message, event_title=None, position=None):
        channel_layer = get_channel_layer()
        
        notification_data = {
            'type': 'send_notification',
            'notification': {
                'type': notification_type,
                'message': message,
                'eventTitle': event_title,
                'position': position,
                'timestamp': str(timezone.now())
            }
        }
        
        # Отправляем уведомление конкретному пользователю
        async_to_sync(channel_layer.group_send)(
            f'user_{user_id}',
            notification_data
        )

    @staticmethod
    def get_user_notifications(user_id, unread_only=False):
        queryset = Notification.objects.filter(user_id=user_id)
        if unread_only:
            queryset = queryset.filter(is_read=False)
        return queryset

    @staticmethod
    def mark_as_read(notification_id, user_id):
        Notification.objects.filter(id=notification_id, user_id=user_id).update(is_read=True)