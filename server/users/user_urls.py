from django.urls import path
from .user_controller import create_user, login_user, get_users,get_user,reset_password,forgot_password,get_user,reset_password,forgot_password

urlpatterns = [
    path("create_user", create_user, name="create_user"),
    path("sign_in", login_user, name="sign_in"),
    path("get_users", get_users, name="get_users"),
    path("get_user/{user_id}", get_user, name="get_user"),
    path("reset_password", reset_password, name="reset_password"),
    path("forgot_password", forgot_password, name="forgot_password"),
]
