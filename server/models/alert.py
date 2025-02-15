"""
Module defining models for alerts.
"""
from datetime import datetime
from models.plant import DeprecatableMixin
from models import FlexibleModel
from shared.db import Table
import enum


class AlertTypes(enum.Enum):
    WATER = "Water"

class Alert(DeprecatableMixin, FlexibleModel):
    """Alert Base Class"""

    table = Table.ALERT

    def __init__(self, **kwargs):
       super().__init__(**kwargs)
       self._id = kwargs.get('_id', ObjectId())
       self.created_on = kwargs.get('created_on', datetime.now())
       self.updated_on = kwargs.get('updated_on', datetime.now())
       self.alert_type = kwargs.get('alert_type', 'alert')
       self.model_id = kwargs.get('alert_type', 'alert')
