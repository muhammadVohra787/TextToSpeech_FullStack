from users.user_model import User  # Import the User model
from django.db import models
from django.utils import timezone
import uuid
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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
    
@api_view(['GET'])
def get_user_recordings(request, user_id):
    recordings = TTSUsage.objects.filter(userId__pk=user_id).order_by('-created_at')
    data = [
        {
            "_id": str(r._id),
            "audioUrl": r.mp3_path,
            "created_at": r.created_at
        } for r in recordings
    ]
    return Response(data, status=200)  # ✅ Always return 200 OK



@api_view(['DELETE'])
def delete_recording(request, recording_id):
    try:
        recording = TTSUsage.objects.get(_id=recording_id)
        recording.delete()
        return Response({"message": "Recording deleted."}, status=200)
    except TTSUsage.DoesNotExist:
        return Response({"error": "Recording not found."}, status=404)