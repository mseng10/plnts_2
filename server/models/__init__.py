# models/__init__.py
from typing import List, Any, Dict
import numpy as np
import csv
from shared.db import Table
from bson import ObjectId

class FlexibleModel:
    """Base model with MongoDB support"""
    table: Table = None  # Override in subclasses
    
    def __init__(self, **kwargs):
        self._id = kwargs.get('_id', ObjectId())  # MongoDB ID
        for key, value in kwargs.items():
            setattr(self, key, value)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'FlexibleModel':
        return cls(**data)

    @classmethod
    def from_numpy(cls, data: np.ndarray) -> List['FlexibleModel']:
        if len(data.shape) != 2:
            raise ValueError("Array must be 2-dimensional")
        columns = data.dtype.names
        if columns is None:
            raise ValueError("Array must have named fields")
        return [cls(**dict(zip(columns, row))) for row in data]

    @classmethod
    def from_request(cls, req: Any) -> 'FlexibleModel':
        data = req.json if req.is_json else req.form.to_dict()
        return cls.from_dict(data)

    @classmethod
    def from_csv(cls, file_path: str) -> List['FlexibleModel']:
        with open(file_path, 'r', newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            return [cls.from_dict(row) for row in reader]

    def to_dict(self) -> Dict[str, Any]:
        """Convert model to dictionary for MongoDB storage"""
        return {k: v for k, v in self.__dict__.items() if not k.startswith('_')}