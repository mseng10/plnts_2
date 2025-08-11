"""
Module defining models for plants.
"""

from datetime import datetime
import enum
from bson import ObjectId

from models import FlexibleModel, BanishableMixin, Fields, UNKNOWN


class PHASES(enum.Enum):
    ADULT = "Adult"
    CUTTING = "Cutting"
    JUVY = "Juvy"
    LEAD = "Leaf"
    SEED = "Seed"


class Plant(BanishableMixin, FlexibleModel):
    """Plant model."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.cost = kwargs.get("cost", 0)
        self.updated_on = kwargs.get("updated_on", datetime.now())

        # Metrics
        self.phase = kwargs.get("phase")
        self.size = kwargs.get("size", 0)  # inches

        # Care info
        self.watered_on = kwargs.get("watered_on", datetime.now())
        self.potted_on = kwargs.get("potted_on", datetime.now())
        self.fertilized_on = kwargs.get("fertilized_on", datetime.now())
        self.cleansed_on = kwargs.get("cleansed_on", datetime.now())

        self.species_id = Fields.object_id(kwargs.get("species_id", UNKNOWN))
        self.care_plan_id = Fields.object_id(kwargs.get("care_plan_id", UNKNOWN))
        self.system_id = kwargs.get("system_id", UNKNOWN)
        self.mix_id = Fields.object_id(kwargs.get("mix_id", UNKNOWN))

    def __repr__(self) -> str:
        return f"{self.id}"
    
class CarePlan(FlexibleModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.name = kwargs.get("name", datetime.now())
        self.watering = kwargs.get("watering")
        self.fertilizing = kwargs.get("fertilizing")
        self.cleaning = kwargs.get("cleaning")
        self.potting = kwargs.get("potting")

class PlantGenusType(FlexibleModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.name = kwargs.get("name")
        self.description = kwargs.get("description")
        self.watering = kwargs.get("watering")


class PlantGenus(FlexibleModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.name = kwargs.get("name")
        self.common_name = kwargs.get("common_name")
        self.description = kwargs.get("description")
        self.watering = kwargs.get("watering")
        self.genus_type_id = Fields.object_id(kwargs.get("genus_type_id"))


class PlantSpecies(FlexibleModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.name = kwargs.get("name")
        self.common_name = kwargs.get("common_name")
        self.description = kwargs.get("description")
        self.genus_id = Fields.object_id(kwargs.get("genus_id"))
