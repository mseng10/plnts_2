"""
Module defining models for system.
"""

from datetime import datetime
from bson import ObjectId
from models import FlexibleModel, BanishableMixin, Fields


class Light(BanishableMixin, FlexibleModel):
    """Light model."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.name = kwargs.get("name")
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.cost = kwargs.get("cost", 0)
        self.system_id = Fields.object_id(kwargs.get("system_id"))

    def __repr__(self) -> str:
        return f"{self.name}"


class System(BanishableMixin, FlexibleModel):
    """System model."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.name = kwargs.get("name")
        self.description = kwargs.get("description")
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())

        # Controlled Factors
        self.target_humidity = kwargs.get("target_humidity", 0)  # %
        self.target_temperature = kwargs.get("target_temperature", 0)  # F

        # Latest updates
        self.last_humidity = kwargs.get("last_humidity")  # %
        self.last_temperature = kwargs.get("last_temperature")  # F

        # Internal
        self.container_id = kwargs.get("container_id")
        self.url = kwargs.get("url")

        # Lighting
        self.duration = kwargs.get("duration")  # hours
        self.distance = kwargs.get("distance")  # inches

    def __repr__(self) -> str:
        return f"{self.name}"
