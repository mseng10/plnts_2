"""
Module defining models for system.
"""
from datetime import datetime
from typing import Optional
from pydantic import Field
from models import FlexibleModel, ObjectIdPydantic


class Light(FlexibleModel):
    """Light model."""

    name: Optional[str] = None
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    cost: int = 0
    system_id: Optional[ObjectIdPydantic] = None

    def __repr__(self) -> str:
        return f"{self.name or 'Unnamed Light'}"


class System(FlexibleModel):
    """System model."""

    name: Optional[str] = None
    description: Optional[str] = None
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)

    # Controlled factors
    target_humidity: int = 0  # %
    target_temperature: int = 0  # F

    # Latest updates
    last_humidity: Optional[int] = None  # %
    last_temperature: Optional[int] = None  # F

    # Internal
    container_id: Optional[str] = None
    url: Optional[str] = None

    # Lighting
    duration: Optional[int] = None  # hours
    distance: Optional[int] = None  # inches

    def __repr__(self) -> str:
        return f"{self.name or 'Unnamed System'}"
