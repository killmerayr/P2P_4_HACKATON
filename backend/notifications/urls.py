#Маршруты API
#  Определяет URL endpoints:
# /api/events/ - список мероприятий
# /api/events/1/join_queue/ - присоединиться к очереди
# /api/notifications/ - уведомления пользователя
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'events', views.EventViewSet)
router.register(r'notifications', views.NotificationViewSet, basename='notification')

urlpatterns = [
    path('api/', include(router.urls)),
]