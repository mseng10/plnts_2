"""
Module defining models for plants.
"""

from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import Field
from models import FlexibleModel, ObjectIdPydantic


class PHASES(Enum):
    ADULT = "Adult"
    CUTTING = "Cutting"
    JUVY = "Juvy"
    LEAF = "Leaf"
    SEED = "Seed"


class Plant(FlexibleModel):
    """Plant model."""

    cost: float = 0

    # Metrics
    phase: PHASES
    size: int = 0  # inches

    # Care info
    watered_on: datetime = Field(default_factory=datetime.now)
    potted_on: datetime = Field(default_factory=datetime.now)
    fertilized_on: datetime = Field(default_factory=datetime.now)
    cleansed_on: datetime = Field(default_factory=datetime.now)

    # Quarentine
    quarentine: bool = False

    # References
    species_id: Optional[ObjectIdPydantic] = None
    genus_id: Optional[ObjectIdPydantic] = None
    genus_type_id: Optional[ObjectIdPydantic] = None
    care_plan_id: Optional[ObjectIdPydantic] = None
    system_id: Optional[str] = None
    mix_id: Optional[ObjectIdPydantic] = None
    description: Optional[str] = None

    def __repr__(self) -> str:
        return f"{self.id}"


class CarePlan(FlexibleModel):
    """Care plan model."""

    name: str
    watering: int
    fertilizing: int
    cleaning: int
    potting: int


class PlantGenusType(FlexibleModel):
    """Plant genus type model."""

    name: str
    description: str
    watering: int


class PlantGenus(FlexibleModel):
    """Plant genus model."""

    name: str
    genus_type_id: ObjectIdPydantic


class PlantSpecies(FlexibleModel):
    """Plant species model."""

    name: str
    description: str
    genus_id: ObjectIdPydantic


class CareEventType(Enum):
    WATER = "Water"
    FERTILIZE = "Fertilize"
    REPOT = "Repot"
    CLEANSE = "Cleanse"
    PRUNE = "Prune"
    TRANSPLANT = "Transplant"


class PlantCareEvent(FlexibleModel):
    """Individual care event for a plant."""

    plant_id: ObjectIdPydantic
    event_type: CareEventType
    performed_on: datetime = Field(default_factory=datetime.now)

    # Optional metadata
    notes: Optional[str] = None
    amount: Optional[float] = None  # ml of water, grams of fertilizer, etc
    duration: Optional[int] = None  # minutes spent on care
    conditions: Dict[str, Any] = Field(default_factory=dict)  # temp, humidity, etc
