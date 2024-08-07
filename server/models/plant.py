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

Base = declarative_base()


class Plant(Base):
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
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    
    # Metrics
    phase = Column(String(400), nullable=True)
    size = Column(Integer(), default=0, nullable=False)  # inches

    # Watering info
    watering = Column(Integer(), default=0, nullable=False) # Days
    watered_on = Column(DateTime(), default=datetime.now)  # Water Info

    # Death info
    # Shared?
    dead = Column(Boolean, default=False, nullable=False)  # Death Info
    dead_on = Column(DateTime(), default=None, nullable=True)
    dead_cause = Column(String(400), nullable=True)

    # Misc
    plant_alerts: Mapped[List["PlantAlert"]] = relationship(
        "PlantAlert", backref="type", passive_deletes=True
    )  # Available plants of this type

    def __repr__(self) -> str:
        return f"{self.id}"

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "cost": self.cost,
            "size": self.size,
            "created_on": self.created_on,
            "watered_on": self.watered_on,
            "updated_on": self.updated_on,
            "genus_id": self.genus_id,
            "system_id": self.system_id,
            "type_id": self.type_id,
            "watering": self.watering,
            "phase": self.phase
        }

class Type(Base):
    """Type of genus"""

    __tablename__ = "type"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False)
    description = Column(String(400), nullable=True)
    updated_on = Column(DateTime(), nullable=True, onupdate=datetime.now)

    genus_id: Mapped[int] = mapped_column(
        ForeignKey("genus.id", ondelete="CASCADE")
    )  # Genus of Plant

    plants: Mapped[List["Plant"]] = relationship(
        "Plant", backref="type", passive_deletes=True
    )  # Available plants of this type

    def __repr__(self) -> str:
        return f"{self.name}"

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_on": self.created_on,
            "updated_on": self.updated_on,
            "genus_id": self.genus_id
        }

class Genus(Base):
    """Genus of plant."""

    __tablename__ = "genus"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(400), nullable=True)
    watering = Column(Integer(), nullable=False)  # days
    updated_on = Column(DateTime(), nullable=True, onupdate=datetime.now)

    types: Mapped[List["Type"]] = relationship(
        "Type", backref="genus", passive_deletes=True
    )  # Available types of this genus

    plants: Mapped[List["Plant"]] = relationship(
        "Plant", backref="genus", passive_deletes=True
    )  # Available plants of this type

    def __repr__(self) -> str:
        return f"{self.name}"

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "name": self.name,
            "watering": self.watering,
            "description": self.description,
            "created_on": self.created_on,
            "updated_on": self.updated_on
        }
