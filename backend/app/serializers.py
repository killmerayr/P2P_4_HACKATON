from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (User, Owner, Queue, Participant)
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                else:
                    raise serializers.ValidationError('Аккаунт отключен')
            else:
                raise serializers.ValidationError('Неверные учетные данные')
        else:
            raise serializers.ValidationError('Необходимо указать username и password')

        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],

        )
        return user


class OwnerSerializer(serializers.ModelSerializer):
    token_id = serializers.CharField(source='token', read_only=True)

    class Meta:
        model = Owner
        fields = ['token', 'name', 'email', 'password', 'is_active', 'created_at', 'token_id']
        read_only_fields = ['token', 'is_active', 'created_at']


class OwnerRegisterSerializer(serializers.ModelSerializer):
    token = serializers.UUIDField()

    class Meta:
        model = Owner
        fields = ['token', 'name', 'email', 'password']

    def validate_token(self, value):
        try:
            owner = Owner.objects.get(token=value, is_active=False)
        except Owner.DoesNotExist:
            raise serializers.ValidationError('Неверный токен или токен уже использован')
        return value

    def validate(self, data):
        # Проверяем email только если он не пустой в существующих записях
        if Owner.objects.filter(email=data['email']).exclude(email__isnull=True).exclude(email='').exists():
            raise serializers.ValidationError({'email': 'Этот email уже используется'})
        return data

    def create(self, validated_data):
        token = validated_data['token']
        owner = Owner.objects.get(token=token)

        owner.name = validated_data['name']
        owner.email = validated_data['email']
        owner.password = make_password(validated_data['password'])
        owner.is_active = True
        owner.save()

        return owner

class ParticipantSerializer(serializers.ModelSerializer):
    queue_name = serializers.CharField(source='queue.name', read_only=True)
    estimated_wait_minutes = serializers.IntegerField(source='estimated_wait', read_only=True)

    class Meta:
        model = Participant
        fields = '__all__'
        read_only_fields = ['position', 'joined_at', 'participant_id', 'estimated_wait']

class QueueSerializer(serializers.ModelSerializer):
    participants = ParticipantSerializer(many=True, read_only=True)
    owner = OwnerSerializer(read_only=True)
    current_waiting = serializers.SerializerMethodField()
    start_at = serializers.IntegerField(read_only=True)

    # Новые поля
    estimated_wait_display = serializers.SerializerMethodField()
    is_active = serializers.BooleanField(source='status', read_only=True)

    class Meta:
        model = Queue
        fields = '__all__'
        read_only_fields = ['start_at', 'served_count', 'fullness']

    def get_current_waiting(self, obj):
        return obj.participants.filter(status='waiting').count()

    def get_estimated_wait_display(self, obj):
        waiting = obj.participants.filter(status='waiting').order_by('position')
        if not waiting:
            return "0 мин"

        first_wait = waiting[0].estimated_wait
        last_wait = waiting[len(waiting) - 1].estimated_wait

        if first_wait == last_wait or len(waiting) == 1:
            return f"{first_wait} мин"
        return f"{first_wait}-{last_wait} мин"
