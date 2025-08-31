# models/__init__.py
from typing import List, Any, Dict, Annotated, Optional
import numpy as np
import csv
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator

# --- Custom Type for BSON ObjectId ---

def _object_id_validator(value: Any) -> ObjectId:
    """If the value is a string, convert it to a BSON ObjectId."""
    if isinstance(value, str):
        try:
            return ObjectId(value)
        except Exception:
            raise ValueError(f"'{value}' is not a valid ObjectId")
    return value

ObjectIdPydantic = Annotated[ObjectId, BeforeValidator(_object_id_validator)]


# --- Inheritable Pydantic Base Model ---

class FlexibleModel(BaseModel):
    """
    An inheritable and flexible Pydantic base model for all future models.

    This model is designed to integrate seamlessly with MongoDB and provides
    several utility methods for instantiation from various data sources.

    ✨ **Key Features:**
    - **MongoDB Integration**: Automatically handles MongoDB's `_id` field by
      mapping it to an `id` attribute. A new `ObjectId` is generated if not provided.
    - **Type-Safe & Flexible**: Leverages Pydantic for data validation but allows
      extra, undefined fields (`extra='allow'`) to support varied data structures.
    - **Banishing Support**: Built-in fields for soft deletion functionality.
    - **Convenient Initializers**: Includes class methods to easily create model
      instances from dictionaries, NumPy arrays, web requests, and CSV files.
    """

    # The `id` field is mapped to `_id` for MongoDB compatibility.
    # A new ObjectId is created for new instances via `default_factory`.
    id: ObjectIdPydantic = Field(default_factory=ObjectId, alias="_id")
    
    # Banishing fields for soft deletion
    banished: bool = False
    banished_on: Optional[datetime] = None
    banished_cause: Optional[str] = None

    # `model_config` customizes Pydantic's behavior.
    model_config = ConfigDict(
        # Allows the model to accept fields that are not explicitly defined.
        extra="allow",
        # Allows use of custom types like `ObjectId` that aren't native to Pydantic.
        arbitrary_types_allowed=True,
        # Defines how to encode `ObjectId` to JSON (e.g., for API responses).
        json_encoders={ObjectId: str}
    )

    def banish(self, cause: Optional[str] = None) -> None:
        """Mark this instance as banished (soft delete)"""
        self.banished = True
        self.banished_on = datetime.now()
        self.banished_cause = cause

    def unbanish(self) -> None:
        """Remove banished status"""
        self.banished = False
        self.banished_on = None
        self.banished_cause = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "FlexibleModel":
        """Creates a model instance from a dictionary."""
        return cls.model_validate(data)

    @classmethod
    def from_numpy(cls, data: np.ndarray) -> List["FlexibleModel"]:
        """Creates a list of model instances from a structured NumPy array."""
        columns = data.dtype.names
        if columns is None:
            raise ValueError("NumPy array must have named fields (be a structured array).")
        
        # Convert each row to a dictionary before creating the model instance.
        return [cls.from_dict(dict(zip(columns, row))) for row in data]

    @classmethod
    def from_request(cls, req: Any) -> "FlexibleModel":
        """
        Creates a model instance from a web request object (e.g., from Flask).
        
        Tries to parse a JSON body first, then falls back to form data.
        """
        # This implementation is tailored for Flask-like request objects.
        data = req.get_json(silent=True) or req.form.to_dict()
        if not data:
            raise ValueError("Could not extract JSON or form data from the request.")
        return cls.from_dict(data)

    @classmethod
    def from_csv(cls, file_path: str, encoding: str = "utf-8") -> List["FlexibleModel"]:
        """Creates a list of model instances from a CSV file."""
        models = []
        with open(file_path, "r", newline="", encoding=encoding) as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                models.append(cls.from_dict(row))
        return models

    def to_dict(self) -> Dict[str, Any]:
        """
        Converts the model to a dictionary suitable for MongoDB storage.
        
        The `by_alias=True` argument ensures that the `id` field is correctly
        serialized back to `_id`.
        """
        return self.model_dump(by_alias=True)