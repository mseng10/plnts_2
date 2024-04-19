from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime
from models import Base


class Plant(Base):
    """Plant model."""

    __tablename__ = "plants"

    id = Column(Integer(), primary_key=True)
    genus = Column(String(100), nullable=False)  # should be shared
    type = Column(String(100), nullable=False)  # should be shared
    name = Column(String(100), nullable=False)
    watering = Column(Integer())
    cost = Column(Integer())
    needs_water = Column(Boolean, default=False, nullable=False)

    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    watered_on = Column(DateTime(), default=datetime.now)

    dead_on = Column(DateTime(), default=None, nullable=True)
    cause = Column(String(100), nullable=False)
    alive = Column(Boolean, default=True, nullable=False)

    def __repr__(self) -> str:
        return f"{self.name} ({self.type}/{self.genus})"
