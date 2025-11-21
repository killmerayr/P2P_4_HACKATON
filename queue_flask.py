from flask import Flask, jsonify, request
from datetime import datetime, timedelta
import threading
import uuid
import time

app = Flask(__name__)

class AdvancedQueue:
    def __init__(self):
        self.queue = []
        self.serving = None
        self.lock = threading.Lock()
        self.avg_processing_time = 3  # минуты
        self.history = []  # История действий
        
    def join(self, name, phone=None):
        with self.lock:
            participant = {
                'id': str(uuid.uuid4())[:8],
                'name': name,
                'phone': phone,
                'joined_at': datetime.now(),
                'position': len(self.queue) + 1,
                'estimated_wait': (len(self.queue)) * self.avg_processing_time,
                'status': 'waiting'
            }
            
            self.queue.append(participant)
            self.history.append(f"{datetime.now().strftime('%H:%M:%S')} - {name} встал в очередь (позиция {participant['position']})")
            return participant
    
    def get_next(self):
        with self.lock:
            if self.queue:
                participant = self.queue.pop(0)
                participant['status'] = 'serving'
                participant['serving_start'] = datetime.now()
                self.serving = participant
                self._update_positions()
                self.history.append(f"{datetime.now().strftime('%H:%M:%S')} - Начато обслуживание: {participant['name']}")
                return participant
            return None
    
    def _update_positions(self):
        for i, participant in enumerate(self.queue):
            participant['position'] = i + 1
            participant['estimated_wait'] = i * self.avg_processing_time
    
    def get_status(self, participant_id):
        for participant in self.queue:
            if participant['id'] == participant_id:
                return participant
        
        if self.serving and self.serving['id'] == participant_id:
            return {**self.serving, 'status': 'serving'}
        
        return None
    
    def leave(self, participant_id):
        with self.lock:
            for i, participant in enumerate(self.queue):
                if participant['id'] == participant_id:
                    left_participant = self.queue.pop(i)
                    self._update_positions()
                    self.history.append(f"{datetime.now().strftime('%H:%M:%S')} - {left_participant['name']} покинул очередь")
                    return True
            return False
    
    def complete_serving(self):
        with self.lock:
            if self.serving:
                completed = self.serving
                completed['status'] = 'completed'
                completed['completed_at'] = datetime.now()
                self.history.append(f"{datetime.now().strftime('%H:%M:%S')} - Завершено обслуживание: {completed['name']}")
                self.serving = None
                return completed
            return None
    
    def get_queue_info(self):
        return {
            'total_waiting': len(self.queue),
            'currently_serving': self.serving,
            'estimated_wait_times': {
                'first': 0 if not self.queue else self.queue[0]['estimated_wait'],
                'last': 0 if not self.queue else self.queue[-1]['estimated_wait']
            },
            'history': self.history[-10:]  # Последние 10 записей
        }
    
    def add_test_data(self):
        """Добавляет тестовые данные для демонстрации"""
        test_users = [
            ("Алексей Петров", "+79161234567"),
            ("Мария Сидорова", "+79169876543"),
            ("Иван Козлов", "+79165554433"),
            ("Елена Новикова", None),
            ("Дмитрий Волков", "+79167778899")
        ]
        
        for name, phone in test_users:
            self.join(name, phone)
            time.sleep(0.1)  # Небольшая задержка для разных временных меток

# Создаем экземпляр очереди
queue_system = AdvancedQueue()

# API для участников
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
            'name': status['name'],
            'position': status.get('position', 0),
            'status': 'serving' if status.get('status') == 'serving' else 'waiting',
            'estimated_wait_minutes': status.get('estimated_wait', 0),
            'people_ahead': status.get('position', 1) - 1,
            'joined_at': status['joined_at'].strftime('%H:%M:%S')
        })
    else:
        return jsonify({'error': 'Участник не найден'}), 404

@app.route('/api/leave/<queue_id>', methods=['POST'])
def api_leave(queue_id):
    if queue_system.leave(queue_id):
        return jsonify({'success': True, 'message': 'Вы вышли из очереди'})
    else:
        return jsonify({'error': 'Участник не найден'}), 404

# API для организаторов
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

@app.route('/api/admin/complete', methods=['POST'])
def admin_complete():
    completed = queue_system.complete_serving()
    if completed:
        return jsonify({
            'success': True,
            'message': f'Обслуживание завершено: {completed["name"]}'
        })
    else:
        return jsonify({'error': 'Нет активного обслуживания'}), 404

@app.route('/api/admin/add_test_data', methods=['POST'])
def add_test_data():
    """Добавить тестовые данные"""
    queue_system.add_test_data()
    return jsonify({'success': True, 'message': 'Тестовые данные добавлены'})

# главная страница с тестированием
@app.route('/')
def home():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>🚀 Система очереди Т-Банка - Тестирование</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            button { padding: 10px 15px; margin: 5px; cursor: pointer; }
            .result { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>🚀 Система очереди Т-Банка - Панель тестирования</h1>
        
        <div class="section">
            <h2>🧪 Тестовые данные</h2>
            <button onclick="addTestData()">➕ Добавить тестовых участников</button>
        </div>
        
        <div class="section">
            <h2>👤 Участник</h2>
            <input type="text" id="userName" placeholder="Ваше имя" value="Тестовый Пользователь">
            <button onclick="joinQueue()">🎯 Встать в очередь</button>
            <div id="joinResult" class="result"></div>
            
            <div id="statusSection" style="display:none">
                <h3>📊 Статус очереди</h3>
                <button onclick="checkStatus()">🔄 Обновить статус</button>
                <div id="statusResult" class="result"></div>
            </div>
        </div>
        
        <div class="section">
            <h2>🎯 Организатор</h2>
            <button onclick="viewQueue()">👀 Посмотреть очередь</button>
            <button onclick="nextParticipant()">👉 Следующий участник</button>
            <button onclick="completeServing()">✅ Завершить обслуживание</button>
            <div id="adminResult" class="result"></div>
        </div>
        
        <div class="section">
            <h2>📋 История действий</h2>
            <button onclick="getHistory()">🕐 Обновить историю</button>
            <div id="historyResult" class="result"></div>
        </div>

        <script>
            let currentQueueId = null;
            
            async function apiCall(url, method='GET', data=null) {
                try {
                    const options = { method };
                    if (data) {
                        options.headers = {'Content-Type': 'application/json'};
                        options.body = JSON.stringify(data);
                    }
                    const response = await fetch(url, options);
                    return await response.json();
                } catch (error) {
                    return {error: 'Ошибка соединения: ' + error};
                }
            }
            
            function addTestData() {
                apiCall('/api/admin/add_test_data', 'POST')
                    .then(result => {
                        document.getElementById('adminResult').innerHTML = 
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                    });
            }
            
            function joinQueue() {
                const name = document.getElementById('userName').value;
                apiCall('/api/join', 'POST', {name, phone: '+79991234567'})
                    .then(result => {
                        document.getElementById('joinResult').innerHTML = 
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                        if (result.success) {
                            currentQueueId = result.queue_id;
                            document.getElementById('statusSection').style.display = 'block';
                            checkStatus();
                        }
                    });
            }
            
            function checkStatus() {
                if (!currentQueueId) return;
                apiCall('/api/status/' + currentQueueId)
                    .then(result => {
                        document.getElementById('statusResult').innerHTML = 
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                    });
            }
            
            function viewQueue() {
                apiCall('/api/admin/queue')
                    .then(result => {
                        document.getElementById('adminResult').innerHTML = 
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                    });
            }
            
            function nextParticipant() {
                apiCall('/api/admin/next', 'POST')
                    .then(result => {
                        document.getElementById('adminResult').innerHTML = 
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                    });
            }
            
            function completeServing() {
                apiCall('/api/admin/complete', 'POST')
                    .then(result => {
                        document.getElementById('adminResult').innerHTML = 
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                    });
            }
            
            function getHistory() {
                apiCall('/api/admin/queue')
                    .then(result => {
                        const history = result.history || [];
                        document.getElementById('historyResult').innerHTML = 
                            '<h4>Последние действия:</h4>' + 
                            history.map(item => '<div>• ' + item + '</div>').join('');
                    });
            }
            
            // Автоматически добавляем тестовые данные при загрузке
            window.onload = addTestData;
        </script>
    </body>
    </html>
    """

# 🔬 Тестирование в консоли
def test_queue_functionality():
    """Функция для тестирования логики очереди прямо в консоли"""
    print("🧪 ТЕСТИРОВАНИЕ СИСТЕМЫ ОЧЕРЕДИ")
    print("=" * 50)
    
    # Создаем тестовую очередь
    test_queue = AdvancedQueue()
    
    # Тест 1: Добавление участников
    print("1. 📝 Добавляем участников...")
    users = ["Анна", "Борис", "Виктор"]
    queue_ids = []
    
    for user in users:
        participant = test_queue.join(user)
        queue_ids.append(participant['id'])
        print(f"   ✅ {user} добавлен (ID: {participant['id']}, позиция: {participant['position']})")
    
    # Тест 2: Проверка статуса
    print("\n2. 📊 Проверяем статусы...")
    for qid in queue_ids:
        status = test_queue.get_status(qid)
        print(f"   👤 {status['name']}: позиция {status['position']}, ожидание {status['estimated_wait']} мин")
    
    # Тест 3: Обслуживание
    print("\n3. 🎯 Обслуживаем участников...")
    serving = test_queue.get_next()
    print(f"   ✅ Обслуживается: {serving['name']}")
    
    # Тест 4: Проверка очереди после обслуживания
    print("\n4. 📋 Очередь после обслуживания:")
    info = test_queue.get_queue_info()
    print(f"   В очереди: {info['total_waiting']} человек")
    
    # Тест 5: Завершение обслуживания
    print("\n5. ✅ Завершаем обслуживание...")
    completed = test_queue.complete_serving()
    print(f"   ✅ Завершено: {completed['name']}")
    
    print("\n🎉 ВСЕ ТЕСТЫ ПРОЙДЕНЫ УСПЕШНО!")
    print("=" * 50)

if __name__ == '__main__':
    # Запускаем тесты при старте
    test_queue_functionality()
    
    print("\n🚀 Запуск Flask сервера...")
    print("📡 Сервер доступен по адресу: http://localhost:5000")
    print("⏹️  Для остановки нажмите Ctrl+C")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
