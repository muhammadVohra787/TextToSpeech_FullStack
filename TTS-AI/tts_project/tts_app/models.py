from django.db import models

class ProcessedText(models.Model):
    sentence = models.TextField(unique=True)
    mp3_path = models.FileField(upload_to='generated_audio/')

    def __str__(self):
        return self.sentence
