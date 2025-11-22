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
        self.avg_processing_time = 3  # минуты
        self.history = []
        
    def join(self, name, email=None, user_id=None):
        with self.lock:
            # 🔥 ИСПРАВЛЕНИЕ: правильный расчет ожидания
            estimated_wait = (len(self.queue) + 1) * self.avg_processing_time
            
            participant = {
                'id': str(uuid.uuid4())[:8],
                'name': name,
                'email': email,
                'user_id': user_id,
                'joined_at': timezone.now(),
                'position': len(self.queue) + 1,
                'estimated_wait': estimated_wait,  # 🔥 Теперь у первого 3 мин, у второго 6 и т.д.
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
    
    def _update_positions(self):
        """Обновляет позиции и время ожидания всех участников"""
        for i, participant in enumerate(self.queue):
            participant['position'] = i + 1
            # 🔥 ИСПРАВЛЕНИЕ: у первого 3 мин, у второго 6 мин и т.д.
            participant['estimated_wait'] = (i + 1) * self.avg_processing_time
    
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
        
        return {
            'total_waiting': len(self.queue),
            'currently_serving': self.currently_serving,
            'estimated_wait_times': {
                'first': 3 if self.queue else 0,  # 🔥 Первый всегда 3 мин
                'last': len(self.queue) * 3 if self.queue else 0  # 🔥 Последний = количество * 3
            },
            'queue_list': sorted_queue,
            'history': self.history[-10:]
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