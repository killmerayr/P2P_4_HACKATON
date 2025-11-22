"""
ASGI config for smart_queue project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter #n
from channels.auth import AuthMiddlewareStack #n
import notifications.routing #n


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_queue.settings')

#application = get_asgi_application()

application = ProtocolTypeRouter({ #n
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            notifications.routing.websocket_urlpatterns
        )
    ),
})