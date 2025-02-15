"""
This is the main source for anything db related.
"""
import os
from enum import Enum
from typing import Dict, Any, Optional, List
from bson import ObjectId
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from contextlib import contextmanager

# Create the MongoDB client
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
CLIENT: MongoClient = MongoClient(MONGODB_URL)

# Get the default database
DB_NAME = os.getenv("DB_NAME", "plnts")
DB: Database = CLIENT[DB_NAME]

class Table(str, Enum):
    PLANT = "plant"
    SYSTEM = "system"
    GENUS_TYPE = "genus_type"
    GENUS = "genus"
    SPECIES = "species"
    SOIL = "soil"
    TODO = "todo"
    PLANT_ALERT = "plant_alert"

    def count(self, filter: Dict={})-> int:
        return DB[self.value].count_documents(filter)

    def create(self, data: Dict[str, Any]) -> ObjectId:
        result = DB[self.value].insert_one(data)
        return result.inserted_id

    def get_one(self, id: str) -> Optional[Dict[str, Any]]:
        return DB[self.value].find_one({"_id": ObjectId(id)})

    def get_many(self, query: Dict[str, Any]={}, limit: int = 100) -> List[Dict[str, Any]]:
        return list(DB[self.value].find(query).limit(limit))

    def update(self, id: str, data: Dict[str, Any]) -> bool:
        result = DB[self.value].update_one(
            {"_id": ObjectId(id)}, 
            {"$set": data}
        )
        return result.modified_count > 0

    def delete(self, id: str) -> bool:
        result = DB[self.value].delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
