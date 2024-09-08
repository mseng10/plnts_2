"""
Module defining models for plants.
"""

from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.plant import DeprecatableMixin
from models import FlexibleModel, ModelConfig, FieldConfig, Base

class Alert(Base, DeprecatableMixin):
    """Alert Base Class"""
    __tablename__ = "alert"

    id = Column(Integer, primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    alert_type = Column(String(50))
    
    __mapper_args__ = {
        'polymorphic_identity': 'alert',
        'polymorphic_on': alert_type
    }

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'alert_type': FieldConfig(read_only=True)
    })

class PlantAlert(Alert):
    """Plant alert model."""

    __tablename__ = "plant_alert"

    id = Column(Integer(), ForeignKey('alert.id'), primary_key=True)
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

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'plant_alert_type': FieldConfig(read_only=True),
        'plant_id': FieldConfig(read_only=True),
        'system_id': FieldConfig(read_only=True)
    })
