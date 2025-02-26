from django.conf import settings
from pymongo import MongoClient

def get_db():
    client = MongoClient(settings.DATABASES["default"]["CLIENT"]["host"])
    db = client.get_database()
    return db

print("✅ Connected to MongoDB:", get_db().name)
