import os


PRODUCTION_KEY = True

USERNAME = "admin"
PASSWORD = "123Qwerty*"

PRODUCTION_MONGO_URI = os.getenv(
    f"mongodb+srv://{USERNAME}:{PASSWORD}@fooddb.3ymhrhj.mongodb.net/"
)

LOCAL_MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017"  # default fallback
)