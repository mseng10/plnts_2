from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, Mapped
from datetime import datetime
from models import Base
from typing import List


class System(Base):
    """Batch model."""

    __tablename__ = "batch"

    # TODO: Base Merge
    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)

    # Batches that belong to this system
    batches: Mapped[List["Batch"]] = relationship(back_populates="system_id")

    # Specs
    humidity = Column(Integer(), primary_key=True)  # %
    temperature = Column(Integer(), primary_key=True)  # F

    # Lighting
    duration = Column(Integer(), primary_key=True)  # hours
    distance = Column(Integer(), primary_key=True)  # inches
    light: Mapped["Light"] = relationship(back_populates="plants")

    def __repr__(self) -> str:
        return f"{self.name}"


class Batch(Base):
    """Batch model."""

    __tablename__ = "batch"

    # TODO: Base Merge
    # Creation Info
    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)

    # System this batch belongs too
    system_id: Mapped[int] = mapped_column(ForeignKey("system.id"))
    system: Mapped["System"] = relationship(back_populates="batches")

    # Plants in this batch
    plants: Mapped[List["Plant"]] = relationship(back_populates="batch_id")

    def __repr__(self) -> str:
        return f"{self.name}"


class Light(Base):
    """Light model."""

    __tablename__ = "light"

    # TODO: Base Merge
    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)
    cost = Column(Integer())

    # Death Info
    dead_on = Column(DateTime(), default=None, nullable=True)
    dead = Column(Boolean, default=False, nullable=False)

    def __repr__(self) -> str:
        return f"{self.name}"
