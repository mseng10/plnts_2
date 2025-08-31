"""
Module defining models for alerts.
"""
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import Field
from models import FlexibleModel, ObjectIdPydantic


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
