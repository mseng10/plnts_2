"""
This is the main source for anything db related.
"""
import os
from enum import Enum
from typing import Dict, Any, Optional, List, Type

from models import FlexibleModel
from models.alert import Alert
from models.mix import Mix, Soil
from models.plant import Plant, PlantGenus, PlantGenusType, PlantSpecies
from models.system import System, Light
from models.todo import Todo

from bson import ObjectId
from pymongo import MongoClient
from pymongo.database import Database

# Create the MongoDB client
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
CLIENT: MongoClient = MongoClient(MONGODB_URL)

# Get the default database
DB_NAME = os.getenv("DB_NAME", "plnts")
DB: Database = CLIENT[DB_NAME]

class Table(Enum):
    PLANT = ("plant", Plant)
    SYSTEM = ("system", System)
    GENUS_TYPE = ("genus_type", PlantGenusType)
    GENUS = ("genus", PlantGenus)
    SPECIES = ("species", PlantSpecies)
    SOIL = ("soil", Soil)
    TODO = ("todo", Todo)
    ALERT = ("alert", Alert)
    MIX = ("mix", Mix)
    LIGHT = ("light", Light)

    def __init__(self, table_name: str, model_class: Type[FlexibleModel]) -> None:
        self.table_name = table_name
        self.model_class = model_class

    def count(self, filter: Dict={})-> int:
        return DB[self.table_name].count_documents(filter)

    def create(self, data: FlexibleModel) -> ObjectId:
        result = DB[self.table_name].insert_one(data.to_dict())
        return result.inserted_id

    def get_one(self, id: str) -> Optional[Type[FlexibleModel]]:
        return self.model_class(**DB[self.table_name].find_one({"_id": ObjectId(id)}))

    def get_many(self, query: Dict[str, Any]={}, limit: int = 100) -> List[Dict[str, Any]]:
        return [self.model_class(**item) for item in list(DB[self.table_name].find(query).limit(limit))]

    def update(self, id: str, data: FlexibleModel) -> bool:
        result = DB[self.table_name].update_one(
            {"_id": ObjectId(id)}, 
            {"$set": data.to_dict()}
        )
        return result.modified_count > 0

    def delete(self, id: str) -> bool:
        result = DB[self.table_name].delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
