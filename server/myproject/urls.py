from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/users/", include("users.user_urls")),
    path("api/storage/", include("storage.storage_urls")),

]
