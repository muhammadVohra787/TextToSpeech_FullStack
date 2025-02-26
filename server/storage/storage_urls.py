from django.urls import path
from .storage_controller import create_storage, get_storage, update_storage, delete_storage

urlpatterns = [
    path("create", create_storage),
    path("<str:storage_id>/get", get_storage),
    path("<str:storage_id>/update", update_storage),
    path("<str:storage_id>/delete", delete_storage),
]
