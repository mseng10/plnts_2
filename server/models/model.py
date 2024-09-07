from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload, contains_eager
from typing import Type, List, Callable, Any, Dict, Optional
from dataclasses import dataclass
import datetime
import numpy as np


@dataclass
class FieldConfig:
    """Define how our model fields can behave."""
    read_only: bool = False
    write_only: bool = False
    create_only: bool = False
    filterable: bool = False
    sortable: bool = False
    nested: Optional['ModelConfig'] = None
    include_nested: bool = False

class ModelConfig:
    """ Standard plnts_2 model:) """
    def __init__(self, fields: Dict[str, FieldConfig]):
        self.fields = fields

    def serialize(self, obj, depth=0, include_nested=False):
        if depth > 5:  # Prevent infinite recursion
            return {}
        result = {}
        for k, v in self.fields.items():
            if not v.write_only and hasattr(obj, k):
                value = getattr(obj, k)
                if v.nested and (include_nested or v.include_nested):
                    if isinstance(value, list):
                        result[k] = [v.nested.serialize(item, depth+1, include_nested) for item in value]
                    elif value is not None:
                        result[k] = v.nested.serialize(value, depth+1, include_nested)
                else:
                    result[k] = value
        return result

    def deserialize(self, data, is_create=False, depth=0):
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
                    else:
                        result[k] = v
        return result

class FlexibleModel:
    """ A model that can be created from various sources. """
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'FlexibleModel':
        return cls(**data)

    @classmethod
    def from_numpy(cls, array: np.ndarray, columns: List[str]) -> List['FlexibleModel']:
        if len(array.shape) != 2 or array.shape[1] != len(columns):
            raise ValueError("Array shape does not match column count")
        return [cls(**dict(zip(columns, row))) for row in array]

    @classmethod
    def from_request(cls, req: Any) -> 'FlexibleModel':
        data = req.json if req.is_json else req.form.to_dict()
        return cls.from_dict(data)