"""
mongodb_connector.py
--------------------
Reusable MongoDB connection utility.

Usage:
from mongodb_connector import get_database, get_collection
"""

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
import os

from config import LOCAL_MONGO_URI, PRODUCTION_KEY, PRODUCTION_MONGO_URI


# -----------------------------
# Configuration (Env-based)
# -----------------------------
if PRODUCTION_KEY:
    MONGO_URI = PRODUCTION_MONGO_URI
else:
    MONGO_URI = LOCAL_MONGO_URI

DEFAULT_DB_NAME = os.getenv(
    "MONGO_DB_NAME",
    "test_db"
)


# -----------------------------
# Internal Singleton Client
# -----------------------------
_client = None


def get_mongo_client() -> MongoClient:
    """
    Returns a singleton MongoClient instance.
    Ensures only one connection pool is created.
    """
    global _client

    if _client is None:
        try:
            _client = MongoClient(
                MONGO_URI,
                serverSelectionTimeoutMS=5000,  # 5s timeout
                connect=True
            )
            # Force connection test
            _client.admin.command("ping")

        except (ConnectionFailure, ConfigurationError) as exc:
            raise RuntimeError(
                f"MongoDB connection failed: {exc}"
            ) from exc

    return _client


# -----------------------------
# Public Helper Functions
# -----------------------------
def get_database(db_name: str = DEFAULT_DB_NAME):
    """
    Returns a MongoDB database object.

    Parameters:
        db_name (str): Name of the database

    Returns:
        pymongo.database.Database
    """
    if not db_name:
        raise ValueError("Database name must be provided")

    client = get_mongo_client()
    return client[db_name]


def get_collection(
    collection_name: str,
    db_name: str = DEFAULT_DB_NAME
):
    """
    Returns a MongoDB collection object.

    Parameters:
        collection_name (str): Name of the collection
        db_name (str): Database name

    Returns:
        pymongo.collection.Collection
    """
    if not collection_name:
        raise ValueError("Collection name must be provided")

    db = get_database(db_name)
    return db[collection_name]


# -----------------------------
# Optional: Graceful Close
# -----------------------------
def close_connection():
    """
    Closes MongoDB connection safely.
    """
    global _client

    if _client is not None:
        _client.close()
        _client = None
