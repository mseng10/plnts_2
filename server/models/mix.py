"""
Module for soil mix related models.
"""

from datetime import datetime
from typing import Dict, Any, List
from bson import ObjectId
from models import FlexibleModel, BanishableMixin, Fields


class Soil(FlexibleModel):
    """Soil types available for mixes."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.description = kwargs.get("description")
        self.group = kwargs.get("group")
        self.name = kwargs.get("name")

    def __repr__(self) -> str:
        return f"{self.name}"


class SoilPart(FlexibleModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.soil_id = Fields.object_id(kwargs.get("soil_id"))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.parts = kwargs.get("parts")


class Mix(BanishableMixin, FlexibleModel):
    """Soil mix model with embedded soil parts."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.name = kwargs.get("name")
        self.description = kwargs.get("description")
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.experimental = kwargs.get("experimental", False)

        # Embedded soil parts
        self.soil_parts: List[SoilPart] = [
            SoilPart(**sp) for sp in kwargs.get("soil_parts", [])
        ]

    def __repr__(self) -> str:
        return f"{self.name}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to MongoDB document format"""
        base_dict = super().to_dict()
        if len(self.soil_parts) > 0:
            base_dict["soil_parts"] = [part.to_dict() for part in self.soil_parts]
        return base_dict
