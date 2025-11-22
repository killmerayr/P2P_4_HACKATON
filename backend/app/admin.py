from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Owner, Queue, Participant

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email')

@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ('token', 'name', 'email', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('token', 'name', 'email')
    readonly_fields = ('token', 'created_at')
    fieldsets = (
        (None, {
            'fields': ('token', 'created_at')
        }),
        ('Информация для регистрации', {
            'fields': ('name', 'email', 'password', 'is_active'),
            'description': 'Эти поля заполнятся когда владелец завершит регистрацию'
        }),
    )

    def get_fieldsets(self, request, obj=None):
        if obj and obj.is_active:
            # Если владелец уже зарегистрирован, показываем все поля
            return (
                (None, {
                    'fields': ('token', 'created_at')
                }),
                ('Информация владельца', {
                    'fields': ('name', 'email', 'password', 'is_active')
                }),
            )
        return super().get_fieldsets(request, obj)

    def has_change_permission(self, request, obj=None):
        if obj and obj.is_active:
            # Запрещаем редактирование после регистрации
            return False
        return True

    # Автоматическое создание токена при сохранении
    def save_model(self, request, obj, form, change):
        if not change:  # Только при создании
            obj.name = ""  # Очищаем имя
            obj.email = None  # Очищаем email
            obj.password = ""  # Очищаем пароль
        super().save_model(request, obj, form, change)

@admin.register(Queue)
class QueueAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status', 'served_count', 'start_at', 'fullness', 'capacity', 'owner')
    list_filter = ('status', 'owner')
    search_fields = ('name',)
    readonly_fields = ('served_count',)

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'queue', 'status', 'position')
    list_filter = ('status', 'queue')
    search_fields = ('name', 'email')
    readonly_fields = ('position',)