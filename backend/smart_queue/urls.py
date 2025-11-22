"""
URL configuration for smart_queue project.
"""
from django.contrib import admin
from django.urls import path, include
from queue_app import views  # ← ДОБАВЬТЕ ЭТО

urlpatterns = [
    path('admin/', admin.site.urls),
    path('queue/', include('queue_app.urls')),
    path('', views.test_page),  # ← ДОБАВЬТЕ ЭТУ СТРОЧКУ
]