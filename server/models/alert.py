"""
Module defining models for alerts.
"""

from enum import Enum
from typing import Optional
from models import FlexibleModel, ObjectIdPydantic


class AlertTypes(Enum):
    WATER = "Water"
    REPOT = "Repot"
    CLEANSE = "Cleanse"
    FERTILIZE = "Fertilize"


class Alert(FlexibleModel):
    """Alert model."""

    alert_type: AlertTypes = None
    model_id: Optional[ObjectIdPydantic] = None
