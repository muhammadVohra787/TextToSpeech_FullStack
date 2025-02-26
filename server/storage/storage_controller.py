import json
import uuid
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .storage_model import UserStorage, User  
from users.user_middlewares import isAdmin, isAuthenticated

@csrf_exempt
@isAuthenticated
def create_storage(request):
    """Create a new UserStorage entry"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)

            # Convert user_id to UUID since User model uses UUIDField
            user = User.objects.get(_id=uuid.UUID(data["user_id"]))  

            storage = UserStorage.objects.create(
                user=user,
                file_id=data["file_id"],
                prompt=data["prompt"]
            )

            return JsonResponse({"message": "Storage entry created", "_id": str(storage.pk)}, status=201)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        except ValueError:
            return JsonResponse({"error": "Invalid UUID format for user_id"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
@isAuthenticated
@csrf_exempt
def get_storage(request, storage_id):
    """Retrieve a single storage entry by ID"""
    print(storage_id)
    try:
        storage = UserStorage.objects.get(pk=uuid.UUID(storage_id))
        return JsonResponse(storage.to_dict(), safe=False)
    except UserStorage.DoesNotExist:
        return JsonResponse({"error": "Storage entry not found"}, status=404)
    except ValueError:
        return JsonResponse({"error": "Invalid UUID format for storage_id"}, status=400)

@isAuthenticated
@csrf_exempt
def update_storage(request, storage_id):
    """Update a storage entry"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            storage = UserStorage.objects.get(pk=uuid.UUID(storage_id))

            storage.file_id = data.get("file_id", storage.file_id)
            storage.prompt = data.get("prompt", storage.prompt)
            storage.save()

            return JsonResponse({"message": "Storage entry updated"}, status=200)
        except UserStorage.DoesNotExist:
            return JsonResponse({"error": "Storage entry not found"}, status=404)
        except ValueError:
            return JsonResponse({"error": "Invalid UUID format for storage_id"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@isAuthenticated
@csrf_exempt
def delete_storage(request, storage_id):
    """Delete a storage entry"""
    if request.method == "POST":
        try:
            storage = UserStorage.objects.get(pk=uuid.UUID(storage_id))
            storage.delete()
            return JsonResponse({"message": "Storage entry deleted"}, status=200)
        except UserStorage.DoesNotExist:
            return JsonResponse({"error": "Storage entry not found"}, status=404)
        except ValueError:
            return JsonResponse({"error": "Invalid UUID format for storage_id"}, status=400)
