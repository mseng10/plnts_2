# models/__init__.py
from typing import List, Any, Dict, Optional
import numpy as np
import csv
from bson import ObjectId
from datetime import datetime, timedelta


class Fields:
    @staticmethod
    def object_id(value):
        if isinstance(value, str):
            return ObjectId(value)
        return value


class FlexibleModel:
    """Base model with MongoDB support"""

    def __init__(self, **kwargs):
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        for key, value in kwargs.items():
            setattr(self, key, value)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "FlexibleModel":
        return cls(**data)

    @classmethod
    def from_numpy(cls, data: np.ndarray) -> List["FlexibleModel"]:
        if len(data.shape) != 2:
            raise ValueError("Array must be 2-dimensional")
        columns = data.dtype.names
        if columns is None:
            raise ValueError("Array must have named fields")
        return [cls(**dict(zip(columns, row))) for row in data]

    @classmethod
    def from_request(cls, req: Any) -> "FlexibleModel":
        data = req.json if req.is_json else req.form.to_dict()
        return cls.from_dict(data)

    @classmethod
    def from_csv(cls, file_path: str) -> List["FlexibleModel"]:
        with open(file_path, "r", newline="") as csvfile:
            reader = csv.DictReader(csvfile)
            return [cls.from_dict(row) for row in reader]

    # Overridable method
    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary for MongoDB storage"""
        return {("_id" if k == "id" else k): v for k, v in self.__dict__.items()}


class DeprecatableMixin:
    """In case the model is deprecated."""

    def __init__(self, **kwargs):
        self.deprecated = kwargs.get("deprecated", False)
        self.deprecated_on = kwargs.get("deprecated_on")
        self.deprecated_cause = kwargs.get("deprecated_cause")

    def deprecate(self, cause):
        self.deprecate = True
        self.deprecated_on = datetime.now()
        self.deprecated_cause = cause


class BanishableMixin:
    """In case the model is deprecated."""

    def __init__(self, **kwargs):
        self.banished = kwargs.get("banished", False)
        self.banished_on = kwargs.get("banished_on")
        self.banished_cause = kwargs.get("banished_cause")

    def banish(self, cause: Optional[str] = None):
        self.banished = True
        self.banished_on = datetime.now()
        self.banished_cause = cause
