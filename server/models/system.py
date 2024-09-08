"""
Module defining models for system.
"""
# Standard library imports
from datetime import datetime
from typing import List

# Third-party imports
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from models.plant import DeprecatableMixin
from models.model import FlexibleModel, ModelConfig, FieldConfig, Base


class Light(Base, DeprecatableMixin, FlexibleModel):
    """Light model."""

    __tablename__ = "light"

    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now)
    cost = Column(Integer(), nullable=False, default=0)
    system_id: Mapped[int] = mapped_column(
        ForeignKey("system.id", ondelete="CASCADE")
    )  # System this light belongs to

    def __repr__(self) -> str:
        return f"{self.name}"
    
    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'name': FieldConfig(),
        'cost': FieldConfig(),
        'system_id': FieldConfig()
    })
    

class System(Base, DeprecatableMixin, FlexibleModel):
    """System model."""

    __tablename__ = "system"

    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(400), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now)

    # Controlled Factors
    humidity = Column(Integer(), default=0, nullable=False)  # %
    temperature = Column(Integer(), default=0, nullable=False)  # F

    # Plants belonging to this system
    plants: Mapped[List["Plant"]] = relationship(
        "Plant", backref="system", passive_deletes=True
    )  # Available plants of this system

    # Lighting
    duration = Column(Integer(), nullable=False)  # hours
    distance = Column(Integer(), nullable=False)  # inches
    lights: Mapped[List["Light"]] = relationship(
        "Light", backref="system", passive_deletes=True
    )  # Available plants of this system

    def __repr__(self) -> str:
        return f"{self.name}"

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'name': FieldConfig(),
        'description': FieldConfig(),
        'humidity': FieldConfig(),
        'temperature': FieldConfig(),
        'duration': FieldConfig(),
        'distance': FieldConfig(),
        # 'plants': FieldConfig(nested=Plant.schema, include_nested=True, delete_with_parent=True) 
        # 'lights': FieldConfig(nested=Light.schema, include_nested=True, delete_with_parent=True) 
    })