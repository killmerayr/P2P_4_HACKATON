from django.contrib import admin
from django.urls import path, include
from django.shortcuts import render
from django.http import HttpResponse

def database_menu(request):
    return render(request, 'menu.html')

def api_info(request):
    """Информация о API"""
    info = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Information</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { display: inline-block; padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold; }
            .get { background: #28a745; }
            .post { background: #007bff; }
            .put { background: #ffc107; color: black; }
            .delete { background: #dc3545; }
        </style>
    </head>
    <body>
        <h1>📡 API Endpoints</h1>

        <div class="endpoint">
            <span class="method post">POST</span> <strong>/api/auth/register/</strong><br>
            Регистрация пользователя
        </div>

        <div class="endpoint">
            <span class="method post">POST</span> <strong>/api/auth/login/</strong><br>
            Вход пользователя
        </div>

        <div class="endpoint">
            <span class="method get">GET</span> <strong>/api/auth/profile/</strong><br>
            Профиль пользователя (требуется аутентификация)
        </div>

        <div class="endpoint">
            <span class="method get">GET</span> <strong>/api/queues/</strong><br>
            Список всех очередей
        </div>

        <div class="endpoint">
            <span class="method post">POST</span> <strong>/api/queues/</strong><br>
            Создать очередь (требуется аутентификация)
        </div>

        <div class="endpoint">
            <span class="method get">GET</span> <strong>/api/queues/1/</strong><br>
            Получить информацию об очереди
        </div>

        <div class="endpoint">
            <span class="method post">POST</span> <strong>/api/queues/1/join/</strong><br>
            Присоединиться к очереди
        </div>

        <div class="endpoint">
            <span class="method post">POST</span> <strong>/api/queues/1/serve_next/</strong><br>
            Обслужить следующего участника (требуется аутентификация)
        </div>

        <div class="endpoint">
            <span class="method get">GET</span> <strong>/api/participants/</strong><br>
            Мои участия в очередях (требуется аутентификация)
        </div>

        <div class="endpoint">
            <span class="method post">POST</span> <strong>/api/participants/1/cancel/</strong><br>
            Отменить участие в очереди
        </div>

        <div class="endpoint">
            <span class="method get">GET</span> <strong>/api/owners/</strong><br>
            Список владельцев (требуется аутентификация)
        </div>

        <a href="/">← Назад в меню</a>
    </body>
    </html>
    """
    return HttpResponse(info)


def health_check(request):
    return HttpResponse("🚀 Server is running!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.urls')),
    path('api-info/', api_info, name='api-info'),
    path('health/', health_check, name='health'),
    path('', database_menu, name='home'),
]