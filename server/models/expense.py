"""
Module for expense related models.
"""
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import Field
from models import FlexibleModel


class EXPENSE_CATEGORY(Enum):
    """Types of expenses"""
    NEED = "Need"
    CRAP = "Crap"


class Expense(FlexibleModel):
    """Expense model."""
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    name: Optional[str] = None
    category: EXPENSE_CATEGORY = EXPENSE_CATEGORY.NEED
    purchased_on: datetime = Field(default_factory=datetime.now)
    
    # Deprecation fields
    deprecated: bool = False
    deprecated_on: Optional[datetime] = None
    deprecated_cause: Optional[str] = None


class Budget(FlexibleModel):
    """Budget model."""
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    budget: int = 0
    month: Optional[str] = None
    
    # Deprecation fields
    deprecated: bool = False
    deprecated_on: Optional[datetime] = None
    deprecated_cause: Optional[str] = None