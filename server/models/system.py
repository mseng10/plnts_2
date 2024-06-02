from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, Mapped
from datetime import datetime
from models import Base
from typing import List


class System(Base):
    """Batch model."""

    __tablename__ = "batch"

    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), null=True)

    # Specs
    humidity = Column(Integer(), primary_key=True)  # %
    temperature = Column(Integer(), primary_key=True)  # F

    # Lighting
    duration = Column(Integer(), primary_key=True)  # hours
    distance = Column(Integer(), primary_key=True)  # inches
    # light: Mapped["Light"] = relationship(back_populates="plants")

    def __repr__(self) -> str:
        return f"{self.name}"

    def to_json(self):
    """Convert to json for front end."""
    return {
        "id": self.id,
        "name": self.name,
        "size": self.size,
        "created_on": self.created_on,
        "humidity": self.humidity,
        "temperature": self.temperature,
        "updated_on": self.updated_on,
        "duration": self.duration,
        "distance": self.distance
    }


# class Light(Base):
#     """Light model."""

#     __tablename__ = "light"

#     id = Column(Integer(), primary_key=True)
#     name = Column(String(100), nullable=False)
#     created_on = Column(DateTime(), default=datetime.now)
#     cost = Column(Integer())

#     # Death Info
#     dead_on = Column(DateTime(), default=None, nullable=True)
#     dead = Column(Boolean, default=False, nullable=False)

#     def __repr__(self) -> str:
#         return f"{self.name}"
