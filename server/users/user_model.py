from django.db import models
import uuid
class User(models.Model):
    _id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    fullName=models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    sq1 = models.CharField(max_length=255)
    sa1 = models.CharField(max_length=255)
    sq2 = models.CharField(max_length=255)
    sa2 = models.CharField(max_length=255)
    admin = models.BooleanField(default=False)
    def __str__(self):
    # Return a string representation of all fields
        return (f"User(ID: {self._id}, Name: {self.fullName}, Email: {self.email}, "
                f"Password: {self.password}, SQ1: {self.sq1}, SA1: {self.sa1}, "
                f"SQ2: {self.sq2}, SA2: {self.sa2}, Admin: {self.admin})")