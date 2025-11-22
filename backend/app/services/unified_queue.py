# app/services/unified_queue.py - ЧИСТАЯ ВЕРСИЯ БЕЗ PRINT
from django.utils import timezone
from django.db import transaction, models
import threading
import requests
from ..models import Queue, Participant


class UnifiedQueueSystem:
    def __init__(self, queue_id):
        self.queue_id = queue_id
        self.queue = Queue.objects.get(id=queue_id)
        self.lock = threading.Lock()
        self.history = []

    def join_queue(self, name, email, user_id=None):
        with transaction.atomic():
            # Проверяем не полная ли очередь
            if self._is_queue_full():
                self._send_queue_full_notification(email)
                return None, False

            # Проверяем существующего участника
            existing = Participant.objects.filter(
                queue=self.queue,
                email=email,
                status__in=['waiting', 'serving']
            ).first()

            if existing:
                return self._format_participant(existing), False

            # Определяем позицию
            last_position = Participant.objects.filter(
                queue=self.queue,
                status='waiting'
            ).order_by('-position').first()

            new_position = last_position.position + 1 if last_position else 1

            # Расчет времени ожидания
            estimated_wait = self._calculate_wait_time(new_position)

            participant = Participant.objects.create(
                queue=self.queue,
                name=name,
                email=email,
                position=new_position,
                estimated_wait=estimated_wait,
                status='waiting'
            )

            # Обновляем статистику очереди
            self._update_queue_stats()

            # Добавляем в историю
            self.history.append(f"{timezone.now().strftime('%H:%M')} - {name} встал в очередь (позиция {new_position})")

            # Отправляем уведомление об успешном присоединении
            self._send_queue_join_notification(participant)

            # Проверяем уведомление о скорой очереди
            if new_position <= 3:
                self._send_turn_soon_notification(participant)

            return self._format_participant(participant), True

    def _is_queue_full(self):
        current_count = Participant.objects.filter(
            queue=self.queue,
            status='waiting'
        ).count()
        return current_count >= self.queue.capacity

    def _send_turn_soon_notification(self, participant):
        notification_data = {
            'type': 'turn_soon',
            'user_email': participant.email,
            'queue_id': self.queue_id,
            'queue_name': self.queue.name,
            'position': participant.position
        }
        self._send_notification_to_frontend(notification_data)

    def _send_queue_join_notification(self, participant):
        notification_data = {
            'type': 'queue_join',
            'user_email': participant.email,
            'queue_id': self.queue_id,
            'queue_name': self.queue.name,
            'position': participant.position
        }
        self._send_notification_to_frontend(notification_data)

    def _send_queue_full_notification(self, user_email):
        notification_data = {
            'type': 'queue_full',
            'user_email': user_email,
            'queue_id': self.queue_id,
            'queue_name': self.queue.name
        }
        self._send_notification_to_frontend(notification_data)

    def _send_serving_start_notification(self, participant):
        notification_data = {
            'type': 'serving_start',
            'user_email': participant.email,
            'queue_id': self.queue_id,
            'queue_name': self.queue.name
        }
        self._send_notification_to_frontend(notification_data)

    def _send_user_left_notification(self, participant):
        notification_data = {
            'type': 'user_left',
            'user_email': participant.email,
            'queue_id': self.queue_id,
            'queue_name': self.queue.name
        }
        self._send_notification_to_frontend(notification_data)

    def _send_queue_update_notification(self, participant):
        notification_data = {
            'type': 'queue_update',
            'user_email': participant.email,
            'queue_id': self.queue_id,
            'queue_name': self.queue.name,
            'position': participant.position
        }
        self._send_notification_to_frontend(notification_data)

    def _send_notification_to_frontend(self, notification_data):
        try:
            # URL фронтенда для получения уведомлений
            frontend_url = "http://localhost:3000/api/notifications"

            # Добавляем timestamp
            notification_data['timestamp'] = timezone.now().isoformat()

            # Отправляем POST запрос
            requests.post(
                frontend_url,
                json=notification_data,
                headers={'Content-Type': 'application/json'},
                timeout=3
            )

        except requests.exceptions.RequestException:
            pass
        except Exception:
            pass

    def serve_next(self):
        with transaction.atomic():
            # Автоматически завершаем текущего обслуживаемого
            current_serving = Participant.objects.filter(
                queue=self.queue,
                status='serving'
            ).first()

            if current_serving:
                current_serving.status = 'served'
                current_serving.save()
                self.history.append(
                    f"{timezone.now().strftime('%H:%M')} - Автоматически завершено: {current_serving.name}")

                self._update_processing_time()

            # Берем следующего участника
            next_participant = Participant.objects.filter(
                queue=self.queue,
                status='waiting'
            ).order_by('position').first()

            if next_participant:
                next_participant.status = 'serving'
                next_participant.serving_start = timezone.now()  # ✅ Фиксируем время начала
                next_participant.save()

                # Обновляем счетчики
                self.queue.served_count += 1
                self.queue.save()

                self.history.append(
                    f"{timezone.now().strftime('%H:%M')} - Начато обслуживание: {next_participant.name}")

                # Отправляем уведомление о начале обслуживания
                self._send_serving_start_notification(next_participant)

                # Обновляем позиции всех ожидающих
                self._update_all_positions()

                # Отправляем уведомления об обновлении позиций
                self._send_position_update_notifications()

                return self._format_participant(next_participant)

            return None

    def leave_queue(self, participant_id):
        with transaction.atomic():
            try:
                participant = Participant.objects.get(
                    participant_id=participant_id,
                    status__in=['waiting', 'serving']
                )

                old_position = participant.position
                participant.status = 'cancelled'
                participant.save()

                self.history.append(f"{timezone.now().strftime('%H:%M')} - {participant.name} покинул очередь")

                # Отправляем уведомление о выходе
                self._send_user_left_notification(participant)

                # Сдвигаем позиции остальных участников
                Participant.objects.filter(
                    queue=self.queue,
                    position__gt=old_position,
                    status='waiting'
                ).update(position=models.F('position') - 1)

                # Отправляем уведомления об обновлении позиций
                self._send_position_update_notifications()

                self._update_all_positions()
                return True

            except Participant.DoesNotExist:
                return False

    def _send_position_update_notifications(self):
        try:
            waiting_participants = Participant.objects.filter(
                queue=self.queue,
                status='waiting'
            )

            for participant in waiting_participants:
                self._send_queue_update_notification(participant)

        except Exception:
            pass

    def _calculate_wait_time(self, position):
        base_time = max(1, self.queue.avg_processing_time)

        if self.queue.served_count < 3:
            return max(1, position * 1.5)

        conservative_estimate = position * 1.5
        historical_estimate = position * base_time

        return max(conservative_estimate, historical_estimate)

    def _update_processing_time(self):
        if self.queue.queue_start_time:
            current_time = timezone.now()
            time_diff = (current_time - self.queue.queue_start_time).total_seconds() / 60

            if self.queue.served_count > 0:
                new_avg = time_diff / self.queue.served_count
                self.queue.avg_processing_time = max(0.5, new_avg)
                self.queue.save()

    def _update_all_positions(self):
        waiting_participants = Participant.objects.filter(
            queue=self.queue,
            status='waiting'
        ).order_by('position')

        for i, participant in enumerate(waiting_participants):
            participant.position = i + 1
            participant.estimated_wait = self._calculate_wait_time(i + 1)
            participant.save()

    def _update_queue_stats(self):
        waiting_count = Participant.objects.filter(
            queue=self.queue,
            status='waiting'
        ).count()

        self.queue.fullness = waiting_count
        self.queue.save()

    def get_queue_info(self):
        waiting_participants = Participant.objects.filter(
            queue=self.queue,
            status='waiting'
        ).order_by('position')

        serving_participant = Participant.objects.filter(
            queue=self.queue,
            status='serving'
        ).first()

        first_wait = waiting_participants[0].estimated_wait if waiting_participants else 0
        last_wait = waiting_participants[len(waiting_participants) - 1].estimated_wait if waiting_participants else 0

        wait_display = f"{first_wait} мин"
        if first_wait != last_wait and waiting_participants.count() > 1:
            wait_display = f"{first_wait}-{last_wait} мин"

        return {
            'queue_id': self.queue.id,
            'queue_name': self.queue.name,
            'status': self.queue.status,
            'total_waiting': waiting_participants.count(),
            'currently_serving': self._format_participant(serving_participant) if serving_participant else None,
            'estimated_wait_times': {
                'first': first_wait,
                'last': last_wait,
                'display': wait_display
            },
            'queue_list': [self._format_participant(p) for p in waiting_participants],
            'served_count': self.queue.served_count,
            'avg_processing_time': self.queue.avg_processing_time,
            'capacity': self.queue.capacity,
            'fullness': self.queue.fullness,
            'history': self.history[-10:]
        }

    def get_participant_status(self, participant_id):
        try:
            participant = Participant.objects.get(participant_id=participant_id)
            return self._format_participant(participant)
        except Participant.DoesNotExist:
            return None

    def _format_participant(self, participant):
        if not participant:
            return None

        return {
            'id': participant.participant_id,
            'name': participant.name,
            'email': participant.email,
            'position': participant.position,
            'status': participant.status,
            'estimated_wait': participant.estimated_wait,
            'joined_at': participant.joined_at.strftime('%H:%M') if participant.joined_at else None,
            'serving_start': participant.serving_start.strftime('%H:%M') if participant.serving_start else None
        }