from flask import Blueprint, request

from sqlalchemy import create_engine, Column
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload, contains_eager
from sqlalchemy.ext.declarative import declarative_base

from typing import Type, List, Callable, Any, Dict, Optional
from dataclasses import dataclass

import numpy as np
import csv

Base = declarative_base()

@dataclass
class FieldConfig:
    """ Configuration for each field stored on a model."""
    read_only: bool = False
    create_only: bool = False
    internal_only: bool = False
    # NOTE: Probably add these to NestedFieldConfig object?
    nested: Optional['ModelConfig'] = None
    nested_class:Any = None
    nested_identifier: str = None
    include_nested: bool = False
    delete_with_parent: bool = False  # New attribute

class ModelConfig:
    """ Standard plnts_2 model serializer:) Expected to grow with shared util."""
    def __init__(self, fields: Dict[str, FieldConfig], archivable=True):
        self.fields = fields
        self.archivable = archivable

    def serialize(self, obj, depth=0, include_nested=False) -> Dict[str, Any]:
        if depth > 5:  # Prevent infinite recursion
            return {}
        result = {}
        for k, v in self.fields.items():
            if hasattr(obj, k):
                value = getattr(obj, k)
                if v.nested and (include_nested or v.include_nested):
                    if isinstance(value, list):
                        result[k] = [v.nested.serialize(item, depth+1, include_nested) for item in value]
                    elif value is not None:
                        result[k] = v.nested.serialize(value, depth+1, include_nested)
                elif not v.internal_only:
                    result[k] = value
        return result

    def deserialize(self, data, is_create=False, depth=0) -> Dict[str, Any]:
        if depth > 5:  # Prevent infinite recursion
            return {}
        result = {}
        for k, v in data.items():
            if k in self.fields:
                field_config = self.fields[k]
                if not field_config.read_only and (is_create or not field_config.create_only):
                    if field_config.nested:
                        if isinstance(v, list):
                            result[k] = [field_config.nested.deserialize(item, is_create, depth+1) for item in v]
                        elif v is not None:
                            result[k] = field_config.nested.deserialize(v, is_create, depth+1)
                    elif not field_config.internal_only:
                        result[k] = v
        return result

class FlexibleModel:
    """ A model that can be created from various sources. """
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'FlexibleModel':
        ret = cls(**data)
        return ret

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