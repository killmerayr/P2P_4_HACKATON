from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Ищем пользователя по email
        try:
            user_obj = User.objects.get(email=data['email'])
            username = user_obj.username
        except User.DoesNotExist:
            raise serializers.ValidationError('Неверные учетные данные')

        user = authenticate(username=username, password=data['password'])
        if not user:
            raise serializers.ValidationError('Неверные учетные данные')
        data['user'] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password', 'username')
        extra_kwargs = {
            'username': {'read_only': True}
        }

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Этот email уже используется')
        return value

    def create(self, validated_data):
        name = validated_data.pop('name')
        email = validated_data['email']

        # Используем email как username (часть до @)
        username = email.split('@')[0]

        # Если username существует, добавляем номер
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
        )
        return user


class OwnerSerializer(serializers.ModelSerializer):
    token_id = serializers.CharField(source='token', read_only=True)

    class Meta:
        model = Owner
        fields = ['token', 'name', 'email', 'password', 'is_active', 'created_at', 'token_id']
        read_only_fields = ['token', 'is_active', 'created_at']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class OwnerRegisterSerializer(serializers.ModelSerializer):
    token = serializers.UUIDField(required=True)  # Токен обязателен

    class Meta:
        model = Owner
        fields = ['token', 'name', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'name': {'required': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        # Проверяем уникальность email
        if Owner.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError('Этот email уже используется')
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Этот email уже используется')
        return value

    def validate_token(self, value):
        try:
            owner = Owner.objects.get(token=value, is_active=False)
        except Owner.DoesNotExist:
            raise serializers.ValidationError('Неверный токен или токен уже использован')
        return value

    def create(self, validated_data):
        token = validated_data['token']

        try:
            owner = Owner.objects.get(token=token, is_active=False)
            owner.name = validated_data['name']
            owner.email = validated_data['email']
            owner.password = make_password(validated_data['password'])
            owner.is_active = True
            owner.save()
            return owner
        except Owner.DoesNotExist:
            raise serializers.ValidationError({'token': 'Неверный токен или токен уже использован'})


class QueueSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)

    class Meta:
        model = Queue
        fields = '__all__'


class ParticipantSerializer(serializers.ModelSerializer):
    queue_name = serializers.CharField(source='queue.name', read_only=True)

    class Meta:
        model = Participant
        fields = '__all__'
