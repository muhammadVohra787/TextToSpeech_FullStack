from django.urls import path
from .tts_controller import process_text, process_image, list_processed
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    path('process_text/', process_text, name='process_text'),
    path('process_image/', process_image, name='process_image'),
    path('list_processed/', list_processed, name='list_processed'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
