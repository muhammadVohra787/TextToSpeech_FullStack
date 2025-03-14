from rest_framework import serializers
from .models import ProcessedText

class ProcessedTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessedText
        fields = ['sentence', 'mp3_path']
