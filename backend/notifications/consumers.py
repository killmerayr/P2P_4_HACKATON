# WebSocket обработчики
# Реальное время! Когда пользователь присоединяется к очереди:
# - Создаётся WebSocket соединение
# - При смене позиции в очереди отправляется уведомление
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if self.user == AnonymousUser():
            await self.close()
            return

        self.user_group_name = f'user_{self.user.id}'

        # Присоединяемся к группе пользователя
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Покидаем группу пользователя
        await self.channel_layer.group_discard(
            self.user_group_name,
            self.channel_name
        )

    # Получаем сообщение от группы
    async def send_notification(self, event):
        notification = event['notification']

        # Отправляем сообщение WebSocket
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': notification
        }))