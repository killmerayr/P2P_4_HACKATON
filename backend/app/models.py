from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from django.utils import timezone
import time

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    date = models.DateTimeField()
    
    def __str__(self):
        return self.title


class User(AbstractUser):
    username = models.CharField(unique=True, max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)


class Owner(models.Model):
    token = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    password = models.CharField(max_length=128, blank=True)
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.token})" if self.name else f"Owner {self.token}"


class Queue(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]

    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='paused')
    served_count = models.IntegerField(default=0)
    start_at = models.IntegerField(null=True, blank=True)
    fullness = models.IntegerField(default=0)
    capacity = models.IntegerField(default=100)
    owner = models.OneToOneField(Owner, on_delete=models.CASCADE, related_name='queue')

    avg_processing_time = models.FloatField(default=3.0)
    queue_start_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.status == 'active' and self.start_at is None:
            self.start_at = int(time.time())
            self.queue_start_time = timezone.now()
        elif self.status != 'active' and self.start_at is not None:
            self.start_at = None
            self.queue_start_time = None
        super().save(*args, **kwargs)


class Participant(models.Model):
    STATUS_CHOICES = [
        ('waiting', 'Waiting'),
        ('serving', 'Serving'),
        ('served', 'Served'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.AutoField(primary_key=True)
    queue = models.ForeignKey(Queue, on_delete=models.CASCADE, related_name='participants')
    name = models.CharField(max_length=100)
    email = models.EmailField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting')
    position = models.IntegerField()

    joined_at = models.DateTimeField(default=timezone.now())
    estimated_wait = models.IntegerField(default=0)
    serving_start = models.DateTimeField(null=True, blank=True)
    participant_id = models.CharField(max_length=8, unique=True, blank=True)

    class Meta:
        unique_together = ['queue', 'email']
        ordering = ['position']

    def save(self, *args, **kwargs):
        if not self.participant_id:
            import uuid
            self.participant_id = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} (pos: {self.position})"