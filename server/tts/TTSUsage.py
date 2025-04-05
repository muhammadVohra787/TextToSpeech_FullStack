from users.user_model import User  # Import the User model
from django.db import models
from django.utils import timezone
import uuid
class TTSUsage(models.Model):
    _id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tts_usages')
    sentence = models.CharField(max_length=10000)
    mp3_path = models.CharField(max_length=50000)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    def __str__(self):
        # Return a string representation of all fields, including related user fields
        return (f"TTSUsage(User: {self.userId.fullName}, Sentence: {self.sentence[:50]}..., "
                f"MP3 Path: {self.mp3_path[:50]}...)")