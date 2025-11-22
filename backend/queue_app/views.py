from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .services import queue_system  # ← Импортируем нашу очередь!

def test_page(request):
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>🚀 Система очереди </title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            button { padding: 10px 15px; margin: 5px; cursor: pointer; }
            .result { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px; }
            .serving { background: #d4edda; border: 1px solid #c3e6cb; }
            .waiting { background: #fff3cd; border: 1px solid #ffeaa7; }
            input { padding: 8px; margin: 5px; border: 1px solid #ddd; border-radius: 4px; }
        </style>
    </head>
    <body>
        <h1>🚀 Система очереди</h1>
        
        <div class="section">
            <h2>🧪 Тестовые данные</h2>
            <button onclick="addTestData()">➕ Добавить тестовых участников</button>
        </div>
        
        <div class="section">
            <h2>👤 Участник</h2>
            <input type="text" id="userName" placeholder="Ваше имя" value="Тестовый Пользователь">
            <input type="email" id="userEmail" placeholder="Ваш email" value="test@example.com">
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
                apiCall('/queue/api/admin/add_test_data', 'POST')
                    .then(result => {
                        document.getElementById('adminResult').innerHTML = 
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                        viewQueue(); // Автоматически показываем очередь после добавления тестовых данных
                    });
            }
            
            function joinQueue() {
                const name = document.getElementById('userName').value;
                const email = document.getElementById('userEmail').value;
                
                apiCall('/queue/api/join', 'POST', {name, email: email})
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
                apiCall('/queue/api/status/' + currentQueueId)
                    .then(result => {
                        document.getElementById('statusResult').innerHTML = 
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                    });
            }
            function viewQueue() {
                console.log("Запрос к /queue/api/admin/queue");
                
                apiCall('/queue/api/admin/queue')
                    .then(result => {
                        console.log("Ответ от сервера:", result);
                        
                        let html = '<h3>📊 Текущее состояние очереди:</h3>';
                        
                        // Показываем текущего обслуживаемого (БЕЗ СЕКУНД)
                        if (result.currently_serving) {
                            const servingTime = result.currently_serving.serving_start ? 
                                new Date(result.currently_serving.serving_start).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : 
                                'только что';
                                
                            html += `<div class="serving result">
                                <strong>🎯 СЕЙЧАС ОБСЛУЖИВАЕТСЯ:</strong><br>
                                👤 <strong>${result.currently_serving.name}</strong><br>
                                📧 ${result.currently_serving.email || 'почта не указана'}<br>
                                🕐 Начало: ${servingTime}
                            </div>`;
                        } else {
                            html += '<div class="result">❌ Сейчас никто не обслуживается</div>';
                        }
                        
                        // Показываем общую информацию об очереди
                        html += `<div class="result">
                            <strong>📈 Общая информация:</strong><br>
                            👥 Всего в очереди: ${result.total_waiting} человек<br>
                            ⏱️ Ожидание: ${Math.round(result.estimated_wait_times?.first || 0)}-${Math.round(result.estimated_wait_times?.last || 0)} мин<br>
                            📊 Среднее время: ${Math.round(result.avg_processing_time || 3)} мин/чел
                        </div>`;
                        
                        // Детальный список очереди
                        html += '<div class="result">';
                        html += '<strong>👥 ДЕТАЛЬНЫЙ СПИСОК ОЧЕРЕДИ:</strong><br>';
                        
                        if (result.queue_list && result.queue_list.length > 0) {
                            result.queue_list.forEach((participant) => {
                                html += `<div style="margin: 8px 0; padding: 10px; border-left: 4px solid #28a745; background: #f8f9fa; border-radius: 4px;">
                                    <strong>#${participant.position}</strong> 👤 ${participant.name}<br>
                                    ${participant.email ? '📧 ' + participant.email : '<span style="color: #666;">📧 почта не указана</span>'}<br>
                                    <small style="color: #666;">⏰ ожидание: ${Math.round(participant.estimated_wait)} мин</small>
                                </div>`;
                            });
                        } else {
                            html += '<div style="color: #666; font-style: italic;">Очередь пуста</div>';
                        }
                        html += '</div>';
                        
                        // Показываем историю (без секунд)
                        if (result.history && result.history.length > 0) {
                            html += '<div class="result"><strong>📋 Последние действия:</strong><br>';
                            result.history.forEach(item => {
                                html += `<div style="margin: 3px 0; padding: 2px;">• ${item}</div>`;
                            });
                            html += '</div>';
                        }
                        
                        document.getElementById('adminResult').innerHTML = html;
                    })
                    .catch(error => {
                        console.error("Ошибка:", error);
                        document.getElementById('adminResult').innerHTML = 
                            '<div class="result" style="background: #f8d7da; color: #721c24;">Ошибка при загрузке очереди: ' + error + '</div>';
                    });
            }
            
            function nextParticipant() {
                apiCall('/queue/api/admin/next', 'POST')
                    .then(result => {
                        let message = result.message;
                        if (result.previous_completed) {
                            message += ` (автоматически завершен: ${result.previous_completed.name})`;
                        }
                        
                        document.getElementById('adminResult').innerHTML = 
                            '<div class="serving result"><strong>' + message + '</strong></div>' +
                            '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
                            
                        viewQueue(); // Обновляем вид очереди
                    });
            }
            
            function getHistory() {
                apiCall('/queue/api/admin/queue')
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
    return HttpResponse(html_content)

@csrf_exempt
@require_http_methods(["POST"])
def api_join(request):
    try:
        data = json.loads(request.body)
        
        if not data or not data.get('name'):
            return JsonResponse({'error': 'Имя обязательно'}, status=400)
        
        user_id = request.user.id if request.user.is_authenticated else None
        
        participant = queue_system.join(
            name=data['name'],
            email=data.get('email'),  # 🔥 Меняем phone на email
            user_id=user_id
        )
        
        return JsonResponse({
            'success': True,
            'queue_id': participant['id'],
            'position': participant['position'],
            'estimated_wait_minutes': participant['estimated_wait'],
            'message': f'Вы в очереди! Позиция: {participant["position"]}'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@require_http_methods(["GET"])
def api_status(request, queue_id):
    status = queue_system.get_status(queue_id)
    
    if status:
        return JsonResponse({
            'queue_id': status['id'],
            'name': status['name'],
            'position': status.get('position', 0),
            'status': status.get('status', 'unknown'),
            'estimated_wait_minutes': status.get('estimated_wait', 0),
            'people_ahead': status.get('position', 1) - 1,
            'joined_at': status['joined_at'].strftime('%H:%M')
        })
    else:
        return JsonResponse({'error': 'Участник не найден'}, status=404)

@csrf_exempt
@require_http_methods(["POST"])
def api_leave(request, queue_id):
    if queue_system.leave(queue_id):
        return JsonResponse({'success': True, 'message': 'Вы вышли из очереди'})
    else:
        return JsonResponse({'error': 'Участник не найден'}, status=404)

@require_http_methods(["GET"])
def admin_queue(request):
    info = queue_system.get_queue_info()
    return JsonResponse(info)

@csrf_exempt
@require_http_methods(["POST"])
def admin_next(request):
    next_participant = queue_system.get_next()
    
    if next_participant:
        return JsonResponse({
            'success': True,
            'participant': next_participant,
            'message': f'Начато обслуживание: {next_participant["name"]}'
        })
    else:
        return JsonResponse({
            'success': True, 
            'message': 'Очередь пуста',
            'participant': None
        })

@csrf_exempt
@require_http_methods(["POST"])
def add_test_data(request):
    queue_system.add_test_data()
    return JsonResponse({'success': True, 'message': 'Тестовые данные с email добавлены'})