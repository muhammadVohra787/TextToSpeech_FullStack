from django.urls import path
from .user_controller import create_user, get_questions_by_email, login_user, get_users,get_user,reset_password,update_user,forgot_password

urlpatterns = [
    path("create_user", create_user, name="create_user"),
    path("sign_in", login_user, name="sign_in"),
    path("get_users", get_users, name="get_users"),
    path("get_user", get_user, name="get_user"),
    path("reset_password", reset_password, name="reset_password"),
    path("forgot_password", forgot_password, name="forgot_password"),
    path("update_user", update_user, name="update_user"),
    path("get_questions_by_email",get_questions_by_email, name="get_questions_by_email"),
    
]
