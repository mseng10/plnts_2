"""
This is the main source for anything db related.
"""

import os
import logging
from enum import Enum
from typing import Dict, Any, Optional, List, Type, Union

from models import FlexibleModel
from models.alert import Alert
from models.mix import Mix, Soil
from models.plant import (
    Plant,
    PlantGenus,
    PlantGenusType,
    PlantSpecies,
    CarePlan,
    PlantCareEvent,
)
from models.system import System, Light
from models.todo import Todo, Goal
from models.expense import Expense, Budget
from models.chat import Chat
from models.app import Brain

from bson import ObjectId
from bson.errors import InvalidId
from pymongo import MongoClient
from pymongo.database import Database

# Logger for debugging
logger = logging.getLogger(__name__)


class DatabaseConfig:
    """Manages database configuration with fallback to environment variables."""

    def __init__(
        self,
        mongodb_url: Optional[str] = None,
        mongodb_url_hist: Optional[str] = None,
        db_name: Optional[str] = None,
        hist_db_name: Optional[str] = None,
    ):
        """
        Initialize database configuration.

        Args:
            mongodb_url: Primary MongoDB connection URL
            mongodb_url_hist: History MongoDB connection URL
            db_name: Primary database name
            hist_db_name: History database name
        """
        # Use provided values or fall back to environment variables or defaults
        self.mongodb_url = mongodb_url or os.getenv(
            "MONGODB_URL", "mongodb://admin:password123@localhost:27017"
        )
        self.mongodb_url_hist = mongodb_url_hist or os.getenv(
            "MONGODB_URL_HIST", "mongodb://admin:password123@localhost:27017"
        )
        self.db_name = db_name or os.getenv("MONGODB_DB_NAME", "plnts")
        self.hist_db_name = hist_db_name or os.getenv(
            "MONGODB_HIST_DB_NAME", "plnts_hist"
        )

        # Initialize clients and databases
        self._client: Optional[MongoClient] = None
        self._client_hist: Optional[MongoClient] = None
        self._db: Optional[Database] = None
        self._hist: Optional[Database] = None

    @property
    def client(self) -> MongoClient:
        """Get or create the primary MongoDB client."""
        if self._client is None:
            logger.info(f"Connecting to MongoDB at {self.mongodb_url}")
            self._client = MongoClient(self.mongodb_url)
        return self._client

    @property
    def client_hist(self) -> MongoClient:
        """Get or create the history MongoDB client."""
        if self._client_hist is None:
            logger.info(f"Connecting to MongoDB history at {self.mongodb_url_hist}")
            self._client_hist = MongoClient(self.mongodb_url_hist)
        return self._client_hist

    @property
    def db(self) -> Database:
        """Get the primary database."""
        if self._db is None:
            self._db = self.client[self.db_name]
        return self._db

    @property
    def hist(self) -> Database:
        """Get the history database."""
        if self._hist is None:
            self._hist = self.client_hist[self.hist_db_name]
        return self._hist

    def close_connections(self):
        """Close all database connections."""
        if self._client:
            self._client.close()
            self._client = None
        if self._client_hist:
            self._client_hist.close()
            self._client_hist = None
        self._db = None
        self._hist = None


# Global database configuration instance
_db_config: Optional[DatabaseConfig] = None


def initialize_database(
    mongodb_url: Optional[str] = None,
    mongodb_url_hist: Optional[str] = None,
    db_name: Optional[str] = None,
    hist_db_name: Optional[str] = None,
) -> DatabaseConfig:
    """
    Initialize the global database configuration.

    Args:
        mongodb_url: Primary MongoDB connection URL
        mongodb_url_hist: History MongoDB connection URL
        db_name: Primary database name
        hist_db_name: History database name

    Returns:
        DatabaseConfig: The initialized database configuration
    """
    global _db_config
    _db_config = DatabaseConfig(mongodb_url, mongodb_url_hist, db_name, hist_db_name)
    return _db_config


def get_db_config() -> DatabaseConfig:
    """
    Get the current database configuration, initializing with defaults if needed.

    Returns:
        DatabaseConfig: The current database configuration
    """
    global _db_config
    if _db_config is None:
        _db_config = DatabaseConfig()
    return _db_config


# Convenience properties that use the global configuration
@property
def CLIENT() -> MongoClient:
    """Get the primary MongoDB client."""
    return get_db_config().client


@property
def CLIENT_HIST() -> MongoClient:
    """Get the history MongoDB client."""
    return get_db_config().client_hist


@property
def DB() -> Database:
    """Get the primary database."""
    return get_db_config().db


@property
def HIST() -> Database:
    """Get the history database."""
    return get_db_config().hist


# For backward compatibility, create module-level properties
def __getattr__(name: str):
    """Module-level attribute access for backward compatibility."""
    if name == "CLIENT":
        return get_db_config().client
    elif name == "CLIENT_HIST":
        return get_db_config().client_hist
    elif name == "DB":
        return get_db_config().db
    elif name == "HIST":
        return get_db_config().hist
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")


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
    PLANT_CARE_EVENT = ("plant_care_event", PlantCareEvent)
    BRAIN = ("brain", Brain)

    def __init__(self, table_name: str, model_class: Type[FlexibleModel]) -> None:
        self.table_name = table_name
        self.model_class = model_class

    def _get_db(self) -> Database:
        """Get the current primary database."""
        return get_db_config().db

    def _get_hist_db(self) -> Database:
        """Get the current history database."""
        return get_db_config().hist

    def count(self, filter: Dict = {}) -> int:
        return self._get_db()[self.table_name].count_documents(filter)

    def create(self, data: FlexibleModel) -> ObjectId:
        result = self._get_db()[self.table_name].insert_one(data.to_dict())
        return result.inserted_id

    def get_one(self, id: str) -> Optional[FlexibleModel]:
        try:
            doc = self._get_db()[self.table_name].find_one({"_id": ObjectId(id)})
            if doc is None:
                return None
            return self.model_class.model_validate(doc)
        except (ValueError, TypeError, InvalidId) as e:
            # Invalid ObjectId format
            logger.debug(f"Invalid ObjectId format '{id}': {e}")
            return None

    def get_many(
        self, query: Dict[str, Any] = {}, limit: int = 300
    ) -> List[FlexibleModel]:
        ret = []
        for item in self._get_db()[self.table_name].find(query).limit(limit):
            ret.append(self.model_class.model_validate(item))
        return ret

    def update(self, id: str, data: FlexibleModel) -> bool:
        set_data = data.to_dict()
        del set_data["_id"]
        result = self._get_db()[self.table_name].update_one(
            {"_id": ObjectId(id)}, {"$set": set_data}
        )
        return result.modified_count > 0

    def upsert(self, id: str, data: FlexibleModel) -> bool:
        set_data = data.to_dict()
        del set_data["_id"]
        result = self._get_db()[self.table_name].update_one(
            {"_id": ObjectId(id)}, {"$set": set_data}, upsert=True
        )
        return result.modified_count > 0 or result.upserted_id is not None

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
        result = self._get_db()[self.table_name].delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0

    def banish(self, id: str) -> bool:
        banishable = self.get_one(id)
        if not banishable:
            return False

        # All FlexibleModel instances now have banishing capability
        banishable.banish()

        if not self.delete(id):
            return False

        result = self._get_hist_db()[self.table_name].insert_one(banishable.to_dict())
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
