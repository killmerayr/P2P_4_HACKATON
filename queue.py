
from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import threading
import uuid

app = Flask(__name__)

class AdvancedQueue:
    def __init__(self):
        self.queue = []
        self.serving = None
        self.lock = threading.Lock()  # Защита от одновременного доступа
        self.avg_processing_time = 3  # минуты
        
    def join(self, name, phone=None):
        with self.lock:
            participant = {
                'id': str(uuid.uuid4())[:8],  # Короткий ID
                'name': name,
                'phone': phone,
                'joined_at': datetime.now(),
                'position': len(self.queue) + 1,
                'estimated_wait': (len(self.queue)) * self.avg_processing_time
            }
            
            self.queue.append(participant)
            return participant
    
    def get_next(self):
        with self.lock:
            if self.queue:
                participant = self.queue.pop(0)
                self.serving = participant
                self._update_positions()
                return participant
            return None
    
    def _update_positions(self):
        """Обновить позиции после изменений"""
        for i, participant in enumerate(self.queue):
            participant['position'] = i + 1
            participant['estimated_wait'] = i * self.avg_processing_time
    
    def get_status(self, participant_id):
        """Получить статус участника"""
        for participant in self.queue:
            if participant['id'] == participant_id:
                return participant
        
        if self.serving and self.serving['id'] == participant_id:
            return {**self.serving, 'status': 'serving'}
        
        return None
    
    def leave(self, participant_id):
        """Участник покидает очередь"""
        with self.lock:
            for i, participant in enumerate(self.queue):
                if participant['id'] == participant_id:
                    self.queue.pop(i)
                    self._update_positions()
                    return True
            return False
    
    def get_queue_info(self):
        """Информация об очереди для организатора"""
        return {
            'total_waiting': len(self.queue),
            'currently_serving': self.serving,
            'estimated_wait_times': {
                'first': 0 if not self.queue else self.queue[0]['estimated_wait'],
                'last': 0 if not self.queue else self.queue[-1]['estimated_wait']
            }
        }

# Создаем экземпляр очереди
queue_system = AdvancedQueue()

# 🎯 API для участников
@app.route('/api/join', methods=['POST'])
def api_join():
    data = request.json
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Имя обязательно'}), 400
    
    participant = queue_system.join(
        name=data['name'],
        phone=data.get('phone')
    )
    
    return jsonify({
        'success': True,
        'queue_id': participant['id'],
        'position': participant['position'],
        'estimated_wait_minutes': participant['estimated_wait'],
        'message': f'Вы в очереди! Позиция: {participant["position"]}'
    })

@app.route('/api/status/<queue_id>')
def api_status(queue_id):
    status = queue_system.get_status(queue_id)
    
    if status:
        return jsonify({
            'queue_id': status['id'],
            'position': status.get('position', 0),
            'status': 'serving' if status.get('status') else 'waiting',
            'estimated_wait_minutes': status.get('estimated_wait', 0),
            'people_ahead': status.get('position', 1) - 1
        })
    else:
        return jsonify({'error': 'Участник не найден'}), 404

@app.route('/api/leave/<queue_id>', methods=['POST'])
def api_leave(queue_id):
    if queue_system.leave(queue_id):
        return jsonify({'success': True, 'message': 'Вы вышли из очереди'})
    else:
        return jsonify({'error': 'Участник не найден'}), 404

# 🎯 API для организаторов
@app.route('/api/admin/queue')
def admin_queue():
    info = queue_system.get_queue_info()
    return jsonify(info)

@app.route('/api/admin/next', methods=['POST'])
def admin_next():
    next_participant = queue_system.get_next()
    
    if next_participant:
        return jsonify({
            'success': True,
            'participant': next_participant,
            'message': f'Следующий: {next_participant["name"]}'
        })
    else:
        return jsonify({'error': 'Очередь пуста'}), 404

# 🏠 Главная страница (просто для теста)
@app.route('/')
def home():
    return """
    <h1>🚀 Система очереди Т-Банка</h1>
    <p>Используйте API endpoints:</p>
    <ul>
        <li>POST /api/join - встать в очередь</li>
        <li>GET /api/status/[id] - проверить статус</li>
        <li>POST /api/leave/[id] - покинуть очередь</li>
        <li>GET /api/admin/queue - информация об очереди</li>
        <li>POST /api/admin/next - следующий участник</li>
    </ul>
    """

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
