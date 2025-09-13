"""
Module defining models for system.
"""

from typing import Optional
from models import FlexibleModel, ObjectIdPydantic


class Light(FlexibleModel):
    """Light model."""

    name: str 
    cost: float = 0
    system_id: Optional[ObjectIdPydantic] = None

    def __repr__(self) -> str:
        return f"{self.name or 'Unnamed Light'}"


class System(FlexibleModel):
    """System model."""

    name: str = None
    description: Optional[str] = None

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
