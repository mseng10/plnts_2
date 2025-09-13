"""
Module for inventory related models.
"""

from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import Field
from models import FlexibleModel, ObjectIdPydantic


class InventoryItem(FlexibleModel):
    """Inventory item model."""

    name: str
    cost: float = 0
    inventory_type_id: ObjectIdPydantic
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

    data_schema: Dict[str, Any] = Field(default_factory=dict)
    name: str
