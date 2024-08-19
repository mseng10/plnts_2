"""
Module defining models for plants.
"""

# Standard library imports
from datetime import datetime

# Third-party imports
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from models.plant import Base, DeprecatableMixin

class Todo(Base, DeprecatableMixin):
    """TOOO model."""

    __tablename__ = "todos"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    due_on = Column(DateTime(), default=None, nullable=True)
    name = Column(String(100), nullable=False)
    description = Column(String(400), nullable=True)

    def __repr__(self):
        return f"{self.name}"

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "created_on": self.created_on,
            "updated_on": self.updated_on,
            "resolved": self.resolved,
            "resolved_on": self.resolved_on,
            "due_on": self.due_on,
            "description": self.description,
            "name": self.name
        }

class Alert(Base, DeprecatableMixin):
    """Alert Base Class"""
    __tablename__ = "alerts"

    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    alert_type = Column(String(50))
    
    __mapper_args__ = {
        'polymorphic_identity': 'alert',
        'polymorphic_on': alert_type
    }

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "created_on": self.created_on,
            "updated_on": self.updated_on,
            "alert_type": self.alert_type        }


class PlantAlert(Alert):
    """Plant alert model."""

    __tablename__ = "plant_alerts"

    id = Column(Integer(), ForeignKey('alerts.id'), primary_key=True)
    plant_alert_type = Column(String(50))

    plant_id: Mapped[int] = mapped_column(
        ForeignKey("plant.id", ondelete="CASCADE")
    )  # plant this plant belongs to
    system_id: Mapped[int] = mapped_column(
        ForeignKey("system.id", ondelete="CASCADE")
    )  # System this light belongs to

    __mapper_args__ = {
        'polymorphic_identity': 'plant_alert'
    }

    def __repr__(self):
        return "plant_alert"

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "plant_id": self.plant_id,
            "system_id": self.system_id,
        }
