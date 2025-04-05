from django.urls import path
from .user_controller import create_user, get_questions_by_email, login_user, get_users,get_user,reset_password,update_user,forgot_password,get_user_recordings,delete_recording,get_all_users,delete_user,get_usage
from uuid import UUID
urlpatterns = [
    path("create_user", create_user, name="create_user"),
    path("sign_in", login_user, name="sign_in"),
    path("get_users", get_users, name="get_users"),
    path("get_user", get_user, name="get_user"),
    path("reset_password", reset_password, name="reset_password"),
    path("forgot_password", forgot_password, name="forgot_password"),
    path("update_user", update_user, name="update_user"),
    path("get_questions_by_email",get_questions_by_email, name="get_questions_by_email"),
    path("get_user_recordings", get_user_recordings, name="get_user_recordings"),
    path("delete_recording", delete_recording, name="delete_recording"),
    path("get_all_users", get_all_users, name="get_all_users"),
    path("delete_user", delete_user, name="delete_user"),
    path("get_usage", get_usage, name="get_usage"),    
]
