from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from datetime import datetime
from models import Base


class Light(Base):
    """ Light model."""
    __tablename__ = "light"

    # TODO: Base Merge
    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime(), default=datetime.now)
    cost = Column(Integer())

    dead_on = Column(DateTime(), default=None, nullable=True)
    dead = Column(Boolean, default=False, nullable=False)

    def __repr__(self) -> str:
        return f"{self.name}"
