from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from datetime import datetime
from models import Base
from sqlalchemy.orm import Mapped, relationship, mapped_column

from enum import Enum

class MyEnum(Enum, str):
    TOO_LITTLE_WATER = 'too little water'
    TOO_MUCH_WATER = 'too much water'
    TOO_LITTLE_HUMIDITY = 'too little humidity'
    TOO_MUCH_HUMIDITY = 'too much humidity'
    TOO_LITTLE_SUN = 'too little sun'
    TOO_MUCH_SUN = 'too much sun'
    PROPAGATION = 'propagation'
    PESTS = 'pests'
    MOLD = 'mold'
    UNKNOWN = 'unknown'

class Plant(Base):
    """Plant model."""

    __tablename__ = "plants"

    id = Column(Integer(), primary_key=True)

    # Batch
    batch_id: Mapped[int] = mapped_column(ForeignKey("batch.id"))
    batch: Mapped["Batch"] = relationship(back_populates="plants")

    # Created at specs
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    cost = Column(Integer())

    size = Column(Integer()) # inches
    name = Column(String(100), nullable=False)
    genus = Column(String(100), nullable=False)  # should be shared
    type = Column(String(100), nullable=False)  # should be shared

    # Water Info
    watered_on = Column(DateTime(), default=datetime.now)
    watering = Column(Integer()) # days

    # Death Info
    dead_on = Column(DateTime(), default=None, nullable=True)
    cause = Column(String(100), nullable=False)
    value = Column(Enum(MyEnum))
    alive = Column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:
        return f"{self.name} ({self.type}/{self.genus})"
