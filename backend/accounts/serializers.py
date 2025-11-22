from rest_framework import serializers
from .models import Creator

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Creator
        fields = ("email", "name", "password")

    def create(self, validated_data):
        return Creator.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
        )
