from django.urls import path
from .user_controller import create_user, login_user, get_users

urlpatterns = [
    path("create_user", create_user, name="create_user"),
    path("sign_in", login_user, name="sign_in"),
    path("get_users", get_users, name="get_users"),
]
