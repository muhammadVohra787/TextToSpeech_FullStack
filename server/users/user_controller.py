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
            return JsonResponse({"message": str(e)}, status=400)

@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data["email"]
            password = data["password"]

            user = User.objects.filter(email=email).first()
            if not user or not check_password(password, user.password):
                return JsonResponse({"message": "Invalid credentials"}, status=401)
            
            request.session['user_email'] = user.email
            print(f"Session Data after login: {request.session.items()}")  # Log session data here
            
            payload = {
                "user_id": str(user._id),
                "email": user.email,
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=2),
                "iat": datetime.datetime.utcnow(),
            }
            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

            return JsonResponse({"token": token, "user_id": str(user._id), "email": str(user.email), "admin": user.admin, "success": True}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

        


@csrf_exempt
def forgot_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")
            sq1=data.get("sq1")
            sa1=data.get("sa1")
            sq2=data.get("sq2")
            sa2=data.get("sa2")
            password = data.get("password")
            user = User.objects.filter(email= email).first()
            if user is None:
                return JsonResponse({"message": "Invalid credentials, Check your email password"}, status=401)

            if user.sa1 == sa1 and user.sa2 ==sa2:
                user.password = make_password(password)
                user.save()
                return JsonResponse({"message": "Password changed", "success": True}, status=201)
            else:
                return JsonResponse({"message": "Questions do not match", "success": False}, status=404)
            
        except Exception as e:
            print(e)
            return JsonResponse({"message": str(e)}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)        
 
 
@csrf_exempt
def get_questions_by_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            user = User.objects.filter(email=email).values("sq1", "sq2").first()

            if user is None:
                print("no user found")
                return JsonResponse({"message": "Email does not exist"}, status=404)  # Changed status code to 404

            # Return the questions in a proper dictionary format
            return JsonResponse({"sq1": user.get("sq1"), "sq2": user.get("sq2")}, status=200)

        except Exception as e:
            print(str(e))
            return JsonResponse({"message": str(e)}, status=400)
    
    return JsonResponse({"message": "Invalid request method"}, status=405)


@csrf_exempt
@isAuthenticated
def reset_password(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            userId = data.get("userId")
            email = data.get("email")
            old_password = data.get("old_password")
            new_password = data.get("new_password")
            user = User.objects.filter(_id= userId).first()
            print(data)
            if not user or not check_password(old_password, user.password):
                return JsonResponse({"message": "Invalid credentials, passwords do not match"}, status=401)
            user.password = make_password(new_password)
            user.save()
                
            return JsonResponse({"message": "Password changed", "success": True}, status=201)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)        
    
     
     
@csrf_exempt
def get_user(request):
    if request.method != "POST":
        return JsonResponse({"message": "Invalid request method"}, status=405)

    try:
        
        data = json.loads(request.body)
        print(data)
        user_id = data["userId" ]
        print("user id recived", user_id)
        user = User.objects.filter(_id=user_id).values(
            "_id", "fullName", "email", "sq1", "sa1", "sq2", "sa2", "admin"
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

@csrf_exempt
@isAuthenticated 
def update_user(request):
    if request.method == "POST":
        try:
            # Parse the incoming data
            data = json.loads(request.body)
            print(data)
            # Extract the user ID and ensure it is provided
            user_id = data.get("userId")
            if not user_id:
                return JsonResponse({"message": "User ID is required"}, status=400)
            
            # Retrieve the user by _id (since you're using MongoDB)
            user = User.objects.filter(_id=user_id).first()
           
            if not user:
                return JsonResponse({"message": "User not found"}, status=404)

            user.fullName = data.get("fullName")
            user.email = data.get("email")
            user.save()
            return JsonResponse({"message": "User updated successfully", "success": True}, status=200)

        except Exception as e:
            print(e)
            return JsonResponse({"message": str(e)}, status=400)

    else:
        return JsonResponse({"message": "Invalid request method"}, status=405)


@isAuthenticated
def get_users(request):
    users = list(User.objects.values())  # Fetch all user data

    return JsonResponse(users, safe=False, encoder=MongoJSONEncoder)




