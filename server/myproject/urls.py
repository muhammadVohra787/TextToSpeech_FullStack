from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/users/", include("users.user_urls")),
    path("api/storage/", include("storage.storage_urls")),
    # path('api/tts/', include('tts.tts_urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
