from mongoengine import Document, StringField, DateTimeField
from users.user_model import User  # Import the User model
from django.db import models

class TTSUsage(models.Model):
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    sentence = models.CharField(max_length=10000)
    mp3_path = models.CharField(max_length=50000)
