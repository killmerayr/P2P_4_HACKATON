from django.urls import path
from . import views

urlpatterns = [
    path('', views.test_page, name='queue_test'),  
    path('test/', views.test_page, name='test_page'),
    path('api/join', views.api_join, name='api_join'),
    path('api/status/<str:queue_id>', views.api_status, name='api_status'),
    path('api/leave/<str:queue_id>', views.api_leave, name='api_leave'),
    path('api/admin/queue', views.admin_queue, name='admin_queue'),
    path('api/admin/next', views.admin_next, name='admin_next'),
    path('api/admin/add_test_data', views.add_test_data, name='add_test_data'),
]
