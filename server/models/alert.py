"""
Module defining models for alerts.
"""
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import Field, BeforeValidator
from models import FlexibleModel, ObjectIdPydantic
from typing import Annotated

# def _alert_type_validator(value: Any) -> Optional[AlertTypes]:
#     """Convert string to AlertTypes enum."""
#     if value is None:
#         return None
#     if isinstance(value, AlertTypes):
#         return value
#     if isinstance(value, str):
#         # Try to match by value first
#         for alert_type in AlertTypes:
#             if alert_type.value == value:
#                 return alert_type
#         # If no match by value, try by name (case-insensitive)
#         try:
#             return AlertTypes[value.upper()]
#         except KeyError:
#             raise ValueError(f"'{value}' is not a valid AlertTypes")
#     raise ValueError(f"Cannot convert {type(value)} to AlertTypes")

# AlertTypesPydantic = Annotated[Optional[AlertTypes], BeforeValidator(_alert_type_validator)]


class AlertTypes(Enum):
    WATER = "Water"
    REPOT = "Repot"
    CLEANSE = "Cleanse"
    FERTILIZE = "Fertilize"


class Alert(FlexibleModel):
    """Alert model."""

    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    alert_type: Optional[AlertTypes] = None
    model_id: Optional[ObjectIdPydantic] = None

    # Deprecation fields
    deprecated: bool = False
    deprecated_on: Optional[datetime] = None
    deprecated_cause: Optional[str] = None
