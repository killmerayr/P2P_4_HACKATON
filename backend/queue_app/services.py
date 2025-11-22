from datetime import datetime
import threading
import uuid
import time
from django.utils import timezone

class AdvancedQueue:
    def __init__(self):
        self.queue = []
        self.currently_serving = None
        self.lock = threading.Lock()
        self.avg_processing_time = 3  # минуты (начальное значение)
        self.history = []
        self.queue_start_time = None  # Время начала работы очереди
        self.served_count = 0  # Количество обслуженных участников
        
    def _calculate_wait_time(self, position):
        """Умный расчет времени ожидания с защитой от 0 и гарантированным ростом"""
        # Базовое время (защита от 0)
        base_time = max(1, self.avg_processing_time)
        
        # Минимальный интервал между участниками
        min_interval = 1.5
        
        # Если мало данных, используем консервативную оценку
        if self.served_count < 3:
            return max(1, position * min_interval)
        
        # Если есть реальная статистика, комбинируем подходы
        conservative_estimate = position * min_interval
        historical_estimate = position * base_time
        
        # Берем максимальное из двух (консервативный подход)
        return max(conservative_estimate, historical_estimate)
    
    def join(self, name, email=None, user_id=None):
        with self.lock:
            # Если очередь только запущена, устанавливаем время начала
            if self.queue_start_time is None:
                self.queue_start_time = timezone.now()
            
            participant = {
                'id': str(uuid.uuid4())[:8],
                'name': name,
                'email': email,
                'user_id': user_id,
                'joined_at': timezone.now(),
                'position': len(self.queue) + 1,
                'estimated_wait': 0,
                'status': 'waiting'
            }
            
            self.queue.append(participant)
            self.history.append(f"{timezone.now().strftime('%H:%M')} - {name} встал в очередь (позиция {participant['position']})")
            
            # 🔥 ОБНОВЛЯЕМ ожидание для всех в очереди
            self._update_positions()
            
            return participant
    
    def get_next(self):
        with self.lock:
            # Автоматически завершаем текущего обслуживаемого
            if self.currently_serving:
                completed_participant = self.currently_serving
                completed_participant['status'] = 'completed'
                completed_participant['completed_at'] = timezone.now()
                self.history.append(f"{timezone.now().strftime('%H:%M')} - Автоматически завершено: {completed_participant['name']}")
                
                # 🔥 ОБНОВЛЯЕМ среднее время обработки после завершения обслуживания
                self._update_avg_processing_time()
            
            # Берем следующего из очереди
            if self.queue:
                participant = self.queue.pop(0)
                participant['status'] = 'serving'
                participant['serving_start'] = timezone.now()
                self.currently_serving = participant
                
                # 🔥 ОБНОВЛЯЕМ позиции и время ожидания
                self._update_positions()
                
                self.history.append(f"{timezone.now().strftime('%H:%M')} - Начато обслуживание: {participant['name']}")
                return participant
            else:
                self.currently_serving = None
                return None
    
    def _update_avg_processing_time(self):
        """Обновляет среднее время обработки на основе реальных данных"""
        if self.queue_start_time is None:
            return
            
        current_time = timezone.now()
        time_diff = (current_time - self.queue_start_time).total_seconds() / 60  # в минутах
        
        self.served_count += 1
        
        if self.served_count > 0:
            # 🔥 НОВАЯ ЛОГИКА: среднее время = (общее время работы) / (количество обслуженных)
            self.avg_processing_time = time_diff / self.served_count
            
            # 🔥 ДОБАВЛЕНО: если AVG = 0, то устанавливаем равным 1
            if self.avg_processing_time <= 0:
                self.avg_processing_time = 1
    
    def _update_positions(self):
        """Обновляет позиции и время ожидания всех участников"""
        for i, participant in enumerate(self.queue):
            participant['position'] = i + 1
            # 🔥 ИСПРАВЛЕНИЕ: используем умный расчет времени
            wait_time = self._calculate_wait_time(i + 1)
            
            # 🔥 ГАРАНТИЯ: минимальное время ожидания = 1 минута
            if wait_time < 1:
                wait_time = 1
                
            participant['estimated_wait'] = wait_time
    
    def get_status(self, participant_id):
        for participant in self.queue:
            if participant['id'] == participant_id:
                return participant
        
        if self.currently_serving and self.currently_serving['id'] == participant_id:
            return self.currently_serving
        
        return None
    
    def leave(self, participant_id):
        with self.lock:
            for i, participant in enumerate(self.queue):
                if participant['id'] == participant_id:
                    left_participant = self.queue.pop(i)
                    self._update_positions()  # 🔥 ОБНОВЛЯЕМ после удаления
                    self.history.append(f"{timezone.now().strftime('%H:%M')} - {left_participant['name']} покинул очередь")
                    return True
            
            if self.currently_serving and self.currently_serving['id'] == participant_id:
                self.history.append(f"{timezone.now().strftime('%H:%M')} - {self.currently_serving['name']} покинул очередь во время обслуживания")
                self.currently_serving = None
                return True
            
            return False
    
    def get_queue_info(self):
        # Сортируем очередь по позиции
        sorted_queue = sorted(self.queue, key=lambda x: x['position'])
        
        # 🔥 ОБНОВЛЯЕМ расчет времени для общей информации
        first_wait = 0 if not self.queue else sorted_queue[0]['estimated_wait']
        last_wait = 0 if not self.queue else sorted_queue[-1]['estimated_wait']
        
        # 🔥 ИСПРАВЛЕНИЕ: если время одинаковое, показываем одно число
        wait_display = f"{first_wait} мин"
        if first_wait != last_wait:
            wait_display = f"{first_wait}-{last_wait} мин"
        
        return {
            'total_waiting': len(self.queue),
            'currently_serving': self.currently_serving,
            'estimated_wait_times': {
                'first': first_wait,
                'last': last_wait,
                'display': wait_display  # 🔥 Добавляем отформатированное отображение
            },
            'queue_list': sorted_queue,
            'history': self.history[-10:],
            'avg_processing_time': self.avg_processing_time,
            'served_count': self.served_count
        }
    
    def add_test_data(self):
        """Добавить тестовые данные с email"""
        test_users = [
            ("Алексей Петров", "aleksey@example.com"),
            ("Мария Сидорова", "maria@example.com"), 
            ("Иван Козлов", "ivan@example.com"),
            ("Елена Новикова", "elena@example.com"),
            ("Дмитрий Волков", "dmitry@example.com")
        ]
        
        for name, email in test_users:
            self.join(name, email)
            time.sleep(0.1)

# Глобальный экземпляр очереди
queue_system = AdvancedQueue()