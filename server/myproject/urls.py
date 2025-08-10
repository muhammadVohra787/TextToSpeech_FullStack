from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
def home(request):
    return HttpResponse("Backend is running ✅")


urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path("api/users/", include("users.user_urls")),
    path('api/tts/', include('tts.tts_urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
