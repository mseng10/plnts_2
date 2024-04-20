from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship, Mapped
from datetime import datetime
from models import Base
from typing import List


class Batch(Base):
    """ Batch model."""

    __tablename__ = "batch"

    # TODO: Base Merge
    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)

    plants: Mapped[List["Plant"]] = relationship(back_populates="parent")

    def __repr__(self) -> str:
        return f"{self.name}"
