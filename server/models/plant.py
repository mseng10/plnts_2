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
    size = Column(Integer(), default=0, nullable=False)  # inches
    genus_id: Mapped[int] = mapped_column(
        ForeignKey("genus.id", ondelete="CASCADE")
    )  # Genus of Plant
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    watered_on = Column(DateTime(), default=datetime.now)  # Water Info
    dead = Column(Boolean, default=False, nullable=False)  # Death Info
    dead_on = Column(DateTime(), default=None, nullable=True)

    def __repr__(self) -> str:
        return f"{self.id}"

    def to_json(self):
        """Convert to json for front end."""
        return {
            "id": self.id,
            "cost": self.cost,
            "size": self.size,
            "created_on": self.created_on,
            "watered_on": self.watered_on,
            "updated_on": self.updated_on,
            "species_id": self.species_id
        }


class Genus(Base):
    """Genus of plant."""

    __tablename__ = "genus"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False, unique=True)
    watering = Column(Integer(), nullable=False)  # days
    updated_on = Column(DateTime(), nullable=True, onupdate=datetime.now)

    plants: Mapped[List["Plant"]] = relationship(
        "Plant", backref="genus", passive_deletes=True
    )  # Available species of this genus

    def __repr__(self) -> str:
        return f"{self.name}"

    def to_json(self):
        """Convert to json for front end."""
        return {"id": self.id, "name": self.name, "watering": self.watering}
