from django.urls import path
from .tts_controller import process_text, process_image, list_processed 
from django.conf.urls.static import static
from django.conf import settings
from .TTSUsage import get_user_recordings, delete_recording


urlpatterns = [
    path('process_text/', process_text, name='process_text'),
    path('process_image/', process_image, name='process_image'),
    path('list_processed/', list_processed, name='list_processed'),

    # ✅ Disambiguated routes
    path('recordings/user/<uuid:user_id>/', get_user_recordings, name='get_user_recordings'),
    path('recordings/<uuid:recording_id>/', delete_recording, name='delete_recording'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
