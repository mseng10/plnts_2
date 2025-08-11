"""
This is the main source for anything db related.
"""

import os
from enum import Enum
from typing import Dict, Any, Optional, List, Type

from models import FlexibleModel, DeprecatableMixin, BanishableMixin
from models.alert import Alert
from models.mix import Mix, Soil
from models.plant import Plant, PlantGenus, PlantGenusType, PlantSpecies, CarePlan
from models.system import System, Light
from models.todo import Todo, Goal
from models.expense import Expense, Budget
from models.chat import Chat

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


    def __init__(self, table_name: str, model_class: Type[FlexibleModel]) -> None:
        self.table_name = table_name
        self.model_class = model_class

    def count(self, filter: Dict = {}) -> int:
        return DB[self.table_name].count_documents(filter)

    def create(self, data: FlexibleModel) -> ObjectId:
        result = DB[self.table_name].insert_one(data.to_dict())
        return result.inserted_id

    def get_one(self, id: str) -> Optional[Type[FlexibleModel]]:
        return self.model_class(**DB[self.table_name].find_one({"_id": ObjectId(id)}))

    def get_many(
        self, query: Dict[str, Any] = {}, limit: int = 100
    ) -> List[Dict[str, Any]]:
        ret = []
        for item in DB[self.table_name].find(query).limit(limit):
            ret.append(self.model_class(**item))
        return ret

    def update(self, id: str, data: FlexibleModel) -> bool:
        set = data.to_dict()
        del set["_id"]
        result = DB[self.table_name].update_one({"_id": ObjectId(id)}, {"$set": set})
        return result.modified_count > 0

    def deprecate(self, data: FlexibleModel) -> bool:
        if not isinstance(data, DeprecatableMixin):
            return False

        data.deprecate()
        return self.update(data.id, data)

    def delete(self, id: str) -> bool:
        result = DB[self.table_name].delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    def banish(self, id: str) -> bool:
        banishable: FlexibleModel = self.get_one(id)
        if not isinstance(banishable, BanishableMixin):
            return False

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
