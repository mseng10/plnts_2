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

from models import FlexibleModel, ModelConfig, FieldConfig, Base

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

class Plant(Base, DeprecatableMixin, FlexibleModel):
    """Plant model."""

    __tablename__ = "plant"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    cost = Column(Integer(), default=0, nullable=False)
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

    species_id = Column(Integer, ForeignKey('plant_species.id'), nullable=False)
    species = relationship("PlantSpecies", back_populates="plants")

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
        'species_id': FieldConfig(),
        'watered_on': FieldConfig(),
        'watering': FieldConfig(),
        'identity': FieldConfig(),
        'phase': FieldConfig(),
        'size': FieldConfig(),
        # TODO:
        # 'species': FieldConfig(nested=Type.schema)
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

class PlantGenusType(Base, FlexibleModel):
    __tablename__ = 'plant_genus_type'

    id = Column(Integer, primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    name = Column(String(50), nullable=False, unique=True)
    description = Column(String(200))
    watering = Column(Integer(), nullable=False)  # days

    # Relationship to PlantGenus
    genera = relationship("PlantGenus", back_populates="genus_type")

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'name': FieldConfig(write_only=True),
        'description': FieldConfig(write_only=True),
        'watering': FieldConfig()
        # 'genera': FieldConfig(nested=PlantGenus.schema, include_nested=True),
    })

class PlantGenus(Base, FlexibleModel):
    __tablename__ = 'plant_genus'

    id = Column(Integer, primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    name = Column(String(50), nullable=False, unique=True)
    common_name = Column(String(100))
    description = Column(String(200))
    watering = Column(Integer(), nullable=False)  # days

    # Relationship to PlantGenusType
    genus_type_id = Column(Integer, ForeignKey('plant_genus_type.id'), nullable=False)
    genus_type = relationship("PlantGenusType", back_populates="genera")

    # Relationship to PlantSpecies
    species = relationship("PlantSpecies", back_populates="genus")

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'name': FieldConfig(write_only=True),
        'common_name': FieldConfig(write_only=True),
        'description': FieldConfig(write_only=True),
        'watering': FieldConfig(),
        'genus_type_id': FieldConfig(write_only=True),
        'genus_type': FieldConfig(nested=PlantGenusType.schema, include_nested=True),
        # 'species': FieldConfig(nested=Plant.schema)
    })

class PlantSpecies(Base, FlexibleModel):
    __tablename__ = 'plant_species'

    id = Column(Integer, primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    scientific_name = Column(String(100), nullable=False, unique=True)
    common_name = Column(String(100))
    description = Column(String(500))

    # Relationship to PlantGenus
    genus_id = Column(Integer, ForeignKey('plant_genus.id'), nullable=False)
    genus = relationship("PlantGenus", back_populates="species")

    # Relationship to alive plants
    plants = relationship("Plant", back_populates="species")

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'scientific_name': FieldConfig(write_only=True),
        'common_name': FieldConfig(write_only=True),
        'description': FieldConfig(write_only=True),
        'genus_id':  FieldConfig(write_only=True),
        'genus': FieldConfig(nested=PlantGenus.schema, include_nested=True)
        # 'plants': FieldConfig(nested=Plant.schema)
    })
