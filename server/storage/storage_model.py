from django.db import models
from bson import ObjectId
from users.user_model import User  # Import the User model
import uuid
class UserStorage(models.Model):
    _id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to User model
    file_id = models.CharField(max_length=255)  # File identifier
    prompt = models.TextField()  # User prompt

    def to_dict(self):
        """Convert model instance to dictionary with _id as string"""
        return {
            "_id": str(self.pk),  # Convert _id to string
            "user_id": str(self.user._id),
            "file_id": self.file_id,
            "prompt": self.prompt
        }
