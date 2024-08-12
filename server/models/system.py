"""
Module defining models for system.
"""
# Standard library imports
from datetime import datetime
from typing import List

# Third-party imports
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship, Mapped, mapped_column
from models.plant import Base


class System(Base):
    """System model."""

    __tablename__ = "system"

    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(400), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now)

    # Deprecated Info
    deprecated = Column(Boolean, default=False, nullable=False)
    deprecated_on = Column(DateTime(), default=None, nullable=True)
    deprecated_cause = Column(String(100), nullable=False)

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

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "name": self.name,
            "created_on": self.created_on,
            "updated_on": self.updated_on,
            "humidity": self.humidity,
            "temperature": self.temperature,
            "duration": self.duration,
            "distance": self.distance
        }


class Light(Base):
    """Light model."""

    __tablename__ = "light"

    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now)
    cost = Column(Integer())
    system_id: Mapped[int] = mapped_column(
        ForeignKey("system.id", ondelete="CASCADE")
    )  # System this light belongs to

    # Death Info
    dead_on = Column(DateTime(), default=None, nullable=True)
    dead = Column(Boolean, default=False, nullable=False)

    def __repr__(self) -> str:
        return f"{self.name}"

    def to_json(self):
        """Convert to json."""
        return {
            "id": self.id,
            "name": self.name,
            "cost": self.cost,
            "created_on": self.created_on,
            "updated_on": self.updated_on,
            "system_id": self.system_id,
            "dead": self.dead,
            "dead_on": self.dead_on
        }
