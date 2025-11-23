from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from .serializers import *
from .services.unified_queue import UnifiedQueueSystem

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def register_owner(self, request):
        print("=== OWNER REGISTRATION ===")
        print("Request data:", request.data)

        serializer = OwnerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            owner = serializer.save()
            print(f"Owner saved: {owner.email}, {owner.name}")

            # создание пользователя для аутентификации
            try:
                # Используем email как username 
                username = owner.email

                # Проверяем, не существует ли уже пользователь
                if User.objects.filter(username=username).exists():
                    user = User.objects.get(username=username)
                    print(f"User already exists: {user.username}")
                else:
                    # Создаем нового пользователя
                    user = User.objects.create_user(
                        username=username,
                        email=owner.email,
                        password=owner.password
                    )
                    print(f"User created: {user.username}")

                # выдаём JWT токен
                refresh = RefreshToken.for_user(user)
                print("JWT token generated")

                return Response({
                    'message': 'Регистрация успешна',
                    'token': str(refresh.access_token),
                    'refresh': str(refresh),
                    'owner': OwnerSerializer(owner).data,
                    'user': UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                print(f"Error creating user: {str(e)}")
                return Response(
                    {'error': f'Ошибка создания пользователя: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QueueViewSet(viewsets.ModelViewSet):
    queryset = Queue.objects.all().order_by('-start_at')
    serializer_class = QueueSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'join', 'status', 'participant_status', 'leave']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """Присоединиться к очереди"""
        queue = self.get_object()

        if queue.status != 'active':
            return Response(
                {'error': 'Очередь неактивна. Присоединение невозможно.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        name = request.user.username if request.user.is_authenticated else request.data.get('name', 'Гость')
        email = request.user.email if request.user.is_authenticated else request.data.get('email')

        if not email:
            return Response(
                {'error': 'Email обязателен для участия в очереди'},
                status=status.HTTP_400_BAD_REQUEST
            )

        queue_system = UnifiedQueueSystem(pk)
        result, created = queue_system.join_queue(name, email,
                                                  request.user.id if request.user.is_authenticated else None)

        if created:
            return Response({
                'success': True,
                'queue_id': result['id'],
                'position': result['position'],
                'estimated_wait_minutes': result['estimated_wait'],
                'message': f'Вы в очереди! Позиция: {result["position"]}'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'error': 'Вы уже в этой очереди',
                'current_position': result['position']
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def serve_next(self, request, pk=None):
        """Обслужить следующего участника"""
        queue_system = UnifiedQueueSystem(pk)
        next_participant = queue_system.serve_next()

        if next_participant:
            return Response({
                'success': True,
                'participant': next_participant,
                'message': f'Начато обслуживание: {next_participant["name"]}'
            })
        else:
            return Response({
                'success': True,
                'message': 'Очередь пуста',
                'participant': None
            })

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Получить полный статус очереди"""
        queue_system = UnifiedQueueSystem(pk)
        queue_info = queue_system.get_queue_info()
        return Response(queue_info)

    @action(detail=True, methods=['get'])
    def participant_status(self, request, pk=None):
        """Статус конкретного участника"""
        participant_id = request.query_params.get('participant_id')
        if not participant_id:
            return Response({'error': 'participant_id обязателен'}, status=400)

        queue_system = UnifiedQueueSystem(pk)
        status_info = queue_system.get_participant_status(participant_id)

        if status_info:
            return Response(status_info)
        else:
            return Response({'error': 'Участник не найден'}, status=404)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """Покинуть очередь"""
        participant_id = request.data.get('participant_id')
        if not participant_id:
            return Response({'error': 'participant_id обязателен'}, status=400)

        queue_system = UnifiedQueueSystem(pk)
        if queue_system.leave_queue(participant_id):
            return Response({'success': True, 'message': 'Вы вышли из очереди'})
        else:
            return Response({'error': 'Участник не найден'}, status=404)


class ParticipantViewSet(viewsets.ModelViewSet):
    serializer_class = ParticipantSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Participant.objects.filter(email=self.request.user.email)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        participant = self.get_object()
        if participant.email != request.user.email:
            return Response(
                {'error': 'Вы можете отменять только свои участия'},
                status=status.HTTP_403_FORBIDDEN
            )

        queue_system = UnifiedQueueSystem(participant.queue.id)
        if queue_system.leave_queue(participant.participant_id):
            return Response({'status': 'cancelled'})
        else:
            return Response({'error': 'Ошибка при отмене'}, status=400)

class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer
    permission_classes = [IsAuthenticated]
