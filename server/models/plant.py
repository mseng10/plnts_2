from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from datetime import datetime
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy.ext.declarative import declarative_base
from typing import List

from enum import Enum

Base = declarative_base()

# class DeathCause(Enum, str):
    # TOO_LITTLE_WATER = "too little water"
    # TOO_MUCH_WATER = "too much water"
    # TOO_LITTLE_HUMIDITY = "too little humidity"
    # TOO_MUCH_HUMIDITY = "too much humidity"
    # TOO_LITTLE_SUN = "too little sun"
    # TOO_MUCH_SUN = "too much sun"
    # PROPAGATION = "propagation"
    # PESTS = "pests"
    # MOLD = "mold"
    # NEGLECT = "neglect"
    # UNKNOWN = "unknown"


class Plant(Base):
    """Plant model."""

    __tablename__ = "plant"

    # Created at specs
    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    cost = Column(Integer())
    size = Column(Integer())  # inches
    type_id: Mapped[int] = mapped_column(ForeignKey("type.id"))  # Type of Plant

    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)

    # Batch
    batch_id: Mapped[int] = mapped_column(ForeignKey("batch.id"))
    batch: Mapped["Batch"] = relationship(back_populates="plants")

    # Water Info
    watered_on = Column(DateTime(), default=datetime.now)
    watering = Column(Integer())  # days

    # Death Info
    dead = Column(Boolean, default=False, nullable=False)
    # dead_cause = Column(Enum(DeathCause), nullable=True)
    dead_on = Column(DateTime(), default=None, nullable=True)

    def __repr__(self) -> str:
        return f"{self.name} ({self.type}/{self.genus})"


class Type(Base):
    """Type of genus."""

    __tablename__ = "type"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False)

    plants: Mapped[List["Plant"]] = relationship()

    # TODO: Best lighting and soil mixes

    def __repr__(self) -> str:
        return f"{self.name}"


class Genus(Base):
    """Genus of species."""

    __tablename__ = "genus"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False, unique=True)

    def __repr__(self) -> str:
        return f"{self.name}"


class Species(Base):
    """Species of plants."""

    __tablename__ = "species"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    name = Column(String(100), nullable=False, unique=True)

    def __repr__(self) -> str:
        return f"{self.name}"
