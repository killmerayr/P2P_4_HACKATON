from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        USER = "user"
        ORGANIZER = "organizer"
        ADMIN = "admin"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",   # уникальное имя реверса
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",   # уникальное имя реверса
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )
