"""
Module defining models for plants.
"""

# Standard library imports
from datetime import datetime
from typing import List

# Third-party imports
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy.ext.declarative import declarative_base
from models.plant import Base

class Todo(Base):
    """TOOO model."""

    __tablename__ = "todo"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    resolved = Column(Boolean, default=False, nullable=False)
    resolved_on = Column(DateTime(), default=None, nullable=True)
    due_on = Column(DateTime(), default=None, nullable=True)
    description = Column(String(400), nullable=True)

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "created_on": self.created_on,
            "updated_on": self.updated_on,
            "resolved": self.resolved,
            "resolved_on": self.resolved_on,
            "due_on": self.due_on,
            "description": self.description
        }
class PlantAlert(Base):
    """Plant alert model."""

    __tablename__ = "plant_alert"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    resolved = Column(Boolean, default=False, nullable=False)
    resolved_on = Column(DateTime(), default=None, nullable=True)

    plant_id: Mapped[int] = mapped_column(
        ForeignKey("plant.id", ondelete="CASCADE")
    )  # plant this plant belongs to
    system_id: Mapped[int] = mapped_column(
        ForeignKey("system.id", ondelete="CASCADE")
    )  # System this light belongs to
    alert_type = Column(String(400), nullable=False)

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "created_on": self.created_on,
            "updated_on": self.updated_on,
            "resolved": self.resolved,
            "resolved_on": self.resolved_on,
            "alert_type": self.alert_type,
            "plant_id": self.plant_id,
            "system_id": self.system_id,
        }
