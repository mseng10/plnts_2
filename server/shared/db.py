"""
This is the main source for anything db related.
"""

import os
from enum import Enum
from typing import Dict, Any, Optional, List, Type

from models import FlexibleModel
from models.alert import Alert
from models.mix import Mix, Soil
from models.plant import Plant, PlantGenus, PlantGenusType, PlantSpecies, CarePlan, PlantCareEvent
from models.system import System, Light
from models.todo import Todo, Goal
from models.expense import Expense, Budget
from models.chat import Chat
from models.app import Brain

from bson import ObjectId
from pymongo import MongoClient
from pymongo.database import Database

# Create the MongoDB client
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://admin:password123@localhost:27017")
CLIENT: MongoClient = MongoClient(MONGODB_URL)

MONGODB_URL_HIST = os.getenv(
    "MONGODB_URL_HIST", "mongodb://admin:password123@localhost:27017"
)
CLIENT_HIST: MongoClient = MongoClient(MONGODB_URL_HIST)

DB: Database = CLIENT["plnts"]
HIST: Database = CLIENT["plnts_hist"]


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
    EXPENSE = ("expense", Expense)
    BUDGET = ("budget", Budget)
    CHAT = ("chat", Chat)
    CARE_PLAN = ("care_plan", CarePlan)
    GOAL = ("goal", Goal)
    CARE_EVENT = ("plant_care_event", PlantCareEvent)
    BRAIN = ("brain", Brain)

    def __init__(self, table_name: str, model_class: Type[FlexibleModel]) -> None:
        self.table_name = table_name
        self.model_class = model_class

    def count(self, filter: Dict = {}) -> int:
        return DB[self.table_name].count_documents(filter)

    def create(self, data: FlexibleModel) -> ObjectId:
        result = DB[self.table_name].insert_one(data.to_dict())
        return result.inserted_id

    def get_one(self, id: str) -> Optional[FlexibleModel]:
        doc = DB[self.table_name].find_one({"_id": ObjectId(id)})
        if doc is None:
            return None
        return self.model_class.model_validate(doc)

    def get_many(
        self, query: Dict[str, Any] = {}, limit: int = 100
    ) -> List[FlexibleModel]:
        ret = []
        for item in DB[self.table_name].find(query).limit(limit):
            ret.append(self.model_class.model_validate(item))
        return ret

    def update(self, id: str, data: FlexibleModel) -> bool:
        set_data = data.to_dict()
        del set_data["_id"]
        result = DB[self.table_name].update_one(
            {"_id": ObjectId(id)}, {"$set": set_data}
        )
        return result.modified_count > 0

    def upsert(self, id: str, data: FlexibleModel) -> bool:
        set_data = data.to_dict()
        del set_data["_id"]
        result = DB[self.table_name].update_one(
            {"_id": ObjectId(id)}, {"$set": set_data}, upsert=True
        )
        return result.modified_count > 0

    def deprecate(self, id: str) -> bool:
        item = self.get_one(id)
        if not item:
            return False

        # Check if model has deprecation fields
        if not hasattr(item, "deprecated"):
            return False

        # Use FlexibleModel's built-in deprecation if available, or set manually
        if hasattr(item, "deprecate") and callable(getattr(item, "deprecate")):
            item.deprecate()
        else:
            from datetime import datetime

            item.deprecated = True
            item.deprecated_on = datetime.now()

        return self.update(id, item)

    def delete(self, id: str) -> bool:
        result = DB[self.table_name].delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    def banish(self, id: str) -> bool:
        banishable = self.get_one(id)
        if not banishable:
            return False

        # All FlexibleModel instances now have banishing capability
        banishable.banish()

        if not self.delete(id):
            return False

        result = HIST[self.table_name].insert_one(banishable.to_dict())
        return result.inserted_id is not None


class Query:
    """A fluent builder for creating MongoDB query dictionaries."""

    def __init__(self):
        self._query = {}

    def _add_condition(self, field, operator, value):
        if field not in self._query or not isinstance(self._query.get(field), dict):
            self._query[field] = {}
        self._query[field][f"${operator}"] = value
        return self

    def filter_by(self, **kwargs):
        for key, value in kwargs.items():
            self._query[key] = value
        return self

    def gt(self, field, value):
        return self._add_condition(field, "gt", value)

    def gte(self, field, value):
        return self._add_condition(field, "gte", value)

    def lt(self, field, value):
        return self._add_condition(field, "lt", value)

    def lte(self, field, value):
        return self._add_condition(field, "lte", value)

    def in_(self, field, values):
        return self._add_condition(field, "in", values)

    def not_in(self, field, values):
        return self._add_condition(field, "nin", values)

    def not_equal(self, field, value):
        return self._add_condition(field, "ne", value)

    def exists(self, field, exists=True):
        return self._add_condition(field, "exists", exists)

    def logical_and(self, queries):
        self._query = {"$and": queries}
        return self

    def logical_or(self, queries):
        self._query = {"$or": queries}
        return self

    def build(self):
        return self._query
