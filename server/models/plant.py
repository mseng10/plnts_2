"""
Module defining models for plants.
"""

# Standard library imports
from datetime import datetime
from typing import List

# Third-party imports
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy.ext.declarative import declared_attr

from models.model import FlexibleModel, ModelConfig, FieldConfig, Base

class DeprecatableMixin:
    """ In case the model is deprecated."""
    @declared_attr
    def deprecated(cls):
        return Column(Boolean, default=False, nullable=False)

    @declared_attr
    def deprecated_on(cls):
        return Column(DateTime(), default=None, nullable=True)

    @declared_attr
    def deprecated_cause(cls):
        return Column(String(400), nullable=True)

class Plant(Base, DeprecatableMixin):
    """Plant model."""

    __tablename__ = "plant"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    cost = Column(Integer(), default=0, nullable=False)
    type_id: Mapped[int] = mapped_column(
        ForeignKey("type.id", ondelete="CASCADE")
    )  # Type of Genus
    genus_id: Mapped[int] = mapped_column(
        ForeignKey("genus.id", ondelete="CASCADE")
    )  # Genus of Plant
    system_id: Mapped[int] = mapped_column(
        ForeignKey("system.id", ondelete="CASCADE")
    )  # System for housing the plant
    mix_id: Mapped[int] = mapped_column(
        ForeignKey("mix.id", ondelete="CASCADE")
    )  # Soil mix for housing the plant
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    
    # Metrics
    phase = Column(String(400), nullable=True)
    size = Column(Integer(), default=0, nullable=False)  # inches

    # Watering info
    watering = Column(Integer(), default=0, nullable=False) # Days
    watered_on = Column(DateTime(), default=datetime.now)  # Water Info

    # Sure
    identity = Column(String(50))
    __mapper_args__ = {
        'polymorphic_identity': 'plant',
        'polymorphic_on': identity
    }

    # Misc
    plant_alerts: Mapped[List["PlantAlert"]] = relationship(
        "PlantAlert", backref="type", passive_deletes=True
    )  # Available plants of this type

    def __repr__(self) -> str:
        return f"{self.id}"

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'cost': FieldConfig(),
        'type_id': FieldConfig(),
        'genus_id': FieldConfig(),
        'watered_on': FieldConfig(),
        'watering': FieldConfig(),
        'identity': FieldConfig(),
        'phase': FieldConfig(),
        'size': FieldConfig(),
        # TODO:
        # 'type': FieldConfig(nested=Type.schema)
        # plant_alerts: FieldConfig(nested=PlantAlert.schema)
    })

# Single Table Inheritance
class Batch(Plant):
    """Batch of plants."""
     # Number of plants
    count = Column(Integer(), default=0, nullable=False)

    __mapper_args__ = {
        'polymorphic_identity': 'batch'
    }

class Type(Base):
    """Type of genus"""

    __tablename__ = "type"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False)
    description = Column(String(400), nullable=True)

    genus_id: Mapped[int] = mapped_column(
        ForeignKey("genus.id", ondelete="CASCADE")
    )  # Genus of Plant

    plants: Mapped[List["Plant"]] = relationship(
        "Plant", backref="type", passive_deletes=True
    )  # Available plants of this type

    def __repr__(self) -> str:
        return f"{self.name}"

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'name': FieldConfig(write_only=True),
        'description': FieldConfig(write_only=True),
        'genus_id': FieldConfig(write_only=True),
        # 'plants': FieldConfig(nested=Task.schema) 
    })

class Genus(Base):
    """Genus of plant."""

    __tablename__ = "genus"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(400), nullable=True)
    watering = Column(Integer(), nullable=False)  # days

    types: Mapped[List["Type"]] = relationship(
        "Type", backref="genus", passive_deletes=True
    )  # Available types of this genus

    plants: Mapped[List["Plant"]] = relationship(
        "Plant", backref="genus", passive_deletes=True
    )  # Available plants of this type

    def __repr__(self) -> str:
        return f"{self.name}"

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'name': FieldConfig(write_only=True),
        'description': FieldConfig(write_only=True),
        'watering': FieldConfig(),
        # 'types': FieldConfig(nested=Type.schema),
        # 'plants': FieldConfig(nested=Plant.schema)
    })
