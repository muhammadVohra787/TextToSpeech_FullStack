import json
import jwt
from bson import ObjectId
import datetime
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .user_model import User
from django.conf import settings
import uuid
from .user_middlewares import isAuthenticated, isAdmin
SECRET_KEY = "your_secret_key"  # Change this to a strong key

@csrf_exempt
def create_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Check if user already exists
            if User.objects.filter(email=data["email"]).exists():
                print("user already exists")
                return JsonResponse({"message": "User with this email already exists"}, status=400)
            
            user = User.objects.create(
                email=data["email"],
                fullName= data["fullName"],
                password=make_password(data["password"]),  # Hash password
                sq1=data["sq1"],
                sa1=data["sa1"],
                sq2=data["sq2"],
                sa2=data["sa2"], 
                admin=data.get("admin", False)
            )
            return JsonResponse({"message": "User registered", "success": True}, status=201)
        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data["email"]
            password = data["password"]

            user = User.objects.filter(email=email).first()
            if not user or not check_password(password, user.password):
                return JsonResponse({"message": "Invalid credentials, Check your email password"}, status=401)
      
            payload = {
                "user_id": str(user._id),
                "email": user.email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=2),
                "iat": datetime.datetime.utcnow(),
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
 
            return JsonResponse({"token": token, "user_id": str(user._id), "admin" : user.admin, "success": True}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
        


@csrf_exempt
def forgot_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data["email"]
            sq1=data["sq1"]
            sa1=data["sa1"]
            sq2=data["sq2"]
            sa2=data["sa2"]
            password = data["password"]
            
            user = User.objects.filter(email= email).first()
            if user is None:
                return JsonResponse({"message": "Invalid credentials, Check your email password"}, status=401)
            
            if user.sa1 == sa1 and user.sa2 ==sa2:
                user.password = make_password(password)
                user.save()
                
            return JsonResponse({"message": "Password changed", "success": True}, status=201)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)        
 
@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data["email"]
            old_password = data["oldPassword"]
            new_password = data["newPassword"]
            user = User.objects.filter(email= email).first()
            
            if not user or not check_password(old_password, user.password):
                return JsonResponse({"message": "Invalid credentials, Check your email password"}, status=401)
            user.password = make_password(new_password)
            user.save()
                
            return JsonResponse({"message": "Password changed", "success": True}, status=201)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)        
    
     
     
@csrf_exempt
def get_user(request, user_id):
    if request.method != "GET":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        user = User.objects.filter(_id=user_id).values(
            "id", "fullName", "email", "sq1", "sa1", "sq2", "sa2", "admin"
        ).first()  # Excludes password
            
        if not user:
            return JsonResponse({"message": "User not found"}, status=404)

        return JsonResponse({"user": user}, status=200)

    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)
      
             
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)  # Convert ObjectId to string
        return super().default(obj)

@isAuthenticated
def get_users(request):
    users = list(User.objects.values())  # Fetch all user data

    return JsonResponse(users, safe=False, encoder=MongoJSONEncoder)




