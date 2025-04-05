import jwt
from django.http import JsonResponse
from .user_model import User

SECRET_KEY = "your_secret_key"  # Make sure this matches the one in views

def isAuthenticated(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Unauthorized - No token provided"}, status=401)

        try:
            token = auth_header.split(" ")[1]
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user = User.objects.filter(_id=payload["user_id"]).first()  # Use _id instead of id
            print("Is user admin", user.admin)
            if not user:
                return JsonResponse({"error": "Unauthorized - Invalid token"}, status=401)

            request.user = user  # Attach user to request
            return view_func(request, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return JsonResponse({"error": "Token has expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"error": "Invalid token"}, status=401)

    return wrapper


def isAdmin(view_func):
    def wrapper(request, *args, **kwargs):
        if not hasattr(request, "user"):
            return JsonResponse({"error": "Unauthorized - No user found"}, status=401)

        if not request.user.admin:
            return JsonResponse({"error": "Forbidden - Admins only"}, status=403)

        return view_func(request, *args, **kwargs)

    return wrapper
