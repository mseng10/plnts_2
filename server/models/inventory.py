"""
Module for inventory related models.
"""
from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import Field
from models import FlexibleModel, ObjectIdPydantic


class InventoryItem(FlexibleModel):
    """Inventory item model."""
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    name: Optional[str] = None
    cost: int = 0
    inventory_type_id: Optional[ObjectIdPydantic] = None
    data: Dict[str, Any] = Field(default_factory=dict)
    
    # Deprecation fields
    deprecated: bool = False
    deprecated_on: Optional[datetime] = None
    deprecated_cause: Optional[str] = None

    def deprecate(self, cause: Optional[str] = None) -> None:
        """Mark this item as deprecated"""
        self.deprecated = True
        self.deprecated_on = datetime.now()
        self.deprecated_cause = cause

    def undeprecate(self) -> None:
        """Remove deprecated status"""
        self.deprecated = False
        self.deprecated_on = None
        self.deprecated_cause = None


class InventoryType(FlexibleModel):
    """Inventory type model."""
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    data_schema: Dict[str, Any] = Field(default_factory=dict)
    name: Optional[str] = None