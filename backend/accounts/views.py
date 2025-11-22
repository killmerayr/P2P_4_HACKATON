from rest_framework import generics
from .serializers import RegisterSerializer
from .models import Creator


class RegisterView(generics.CreateAPIView):
    queryset = Creator.objects.all()
    serializer_class = RegisterSerializer
