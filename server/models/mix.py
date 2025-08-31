"""
Module for soil mix related models.
"""
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import Field, model_validator
from models import FlexibleModel, ObjectIdPydantic


class Soil(FlexibleModel):
    """Soil types available for mixes."""
    created_on: datetime = Field(default_factory=datetime.now)
    description: Optional[str] = None
    group: Optional[str] = None
    name: Optional[str] = None

    def __repr__(self) -> str:
        return f"{self.name or 'Unnamed Soil'}"


class SoilPart(FlexibleModel):
    """Soil part for mixes."""
    soil_id: Optional[ObjectIdPydantic] = None
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    parts: Optional[int] = None


class Mix(FlexibleModel):
    """Soil mix model with embedded soil parts."""
    name: Optional[str] = None
    description: Optional[str] = None
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    experimental: bool = False
    soil_parts: List[SoilPart] = Field(default_factory=list)

    @model_validator(mode='before')
    @classmethod
    def process_embedded_soil_parts(cls, values):
        """Convert soil part dictionaries to SoilPart instances if needed"""
        if isinstance(values, dict) and 'soil_parts' in values:
            parts = values['soil_parts']
            if parts and isinstance(parts[0], dict):
                values['soil_parts'] = [SoilPart.model_validate(part) for part in parts]
        return values

    def __repr__(self) -> str:
        return f"{self.name or 'Unnamed Mix'}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to MongoDB document format"""
        base_dict = super().to_dict()
        if self.soil_parts:
            base_dict["soil_parts"] = [part.to_dict() for part in self.soil_parts]
        return base_dict