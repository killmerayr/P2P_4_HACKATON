from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, QueueViewSet, ParticipantViewSet, OwnerViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'queues', QueueViewSet, basename='queues')
router.register(r'participants', ParticipantViewSet, basename='participants')
router.register(r'owners', OwnerViewSet, basename='owners')

urlpatterns = [
    path('', include(router.urls)),
]
