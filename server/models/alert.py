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

    alert_type: AlertTypes = None
    model_id: Optional[ObjectIdPydantic] = None
