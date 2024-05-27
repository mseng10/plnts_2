from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from datetime import datetime
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy.ext.declarative import declarative_base
from typing import List

from enum import Enum

Base = declarative_base()

# class DeathCause(Enum, str):
#     TOO_LITTLE_WATER = "too little water"
#     TOO_MUCH_WATER = "too much water"
#     TOO_LITTLE_HUMIDITY = "too little humidity"
#     TOO_MUCH_HUMIDITY = "too much humidity"
#     TOO_LITTLE_SUN = "too little sun"
#     TOO_MUCH_SUN = "too much sun"
#     PROPAGATION = "propagation"
#     PESTS = "pests"
#     MOLD = "mold"
#     NEGLECT = "neglect"
#     UNKNOWN = "unknown"


class Plant(Base):
    """Plant model."""

    __tablename__ = "plant"

    # Created at specs
    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    cost = Column(Integer(), default=0, nullable=False)
    size = Column(Integer(), default=0, nullable=False)  # inches
    species_id: Mapped[int] = mapped_column(ForeignKey("species.id", ondelete='CASCADE'))  # Species of Plant

    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)

    # Water Info
    watered_on = Column(DateTime(), default=datetime.now)

    # Death Info
    dead = Column(Boolean, default=False, nullable=False)
    # dead_cause = Column(Enum(DeathCause), nullable=True)
    dead_on = Column(DateTime(), default=None, nullable=True)

class Species(Base):
    """Species of genus."""

    __tablename__ = "species"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False, unique=True)

    # Available plants of this species
    plants: Mapped[List["Plant"]] = relationship('Plant', backref='plant', passive_deletes=True)

    # Genus of this species of plant
    genus_id: Mapped[int] = mapped_column(ForeignKey("genus.id", ondelete='CASCADE'))

    def __repr__(self) -> str:
        return f"{self.name}"

class Genus(Base):
    """Genus of plant."""

    __tablename__ = "genus"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False, unique=True)
    watering = Column(Integer())  # days

    # Available species of this genus
    species: Mapped[List["Species"]] = relationship('Species', backref='species', passive_deletes=True)

    def __repr__(self) -> str:
        return f"{self.name}"
