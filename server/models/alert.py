"""
Module defining models for alerts.
"""

from datetime import datetime
from models import FlexibleModel, BanishableMixin, Fields
import enum
from bson import ObjectId


class AlertTypes(enum.Enum):
    WATER = "Water"


class Alert(BanishableMixin, FlexibleModel):
    """Alert Base Class"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.alert_type = kwargs.get("alert_type", "alert")
        self.model_id = Fields.object_id(kwargs.get("alert_type", "alert"))
