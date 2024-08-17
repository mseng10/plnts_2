from sqlalchemy import Column, Integer, String, DateTime, Table, ForeignKey, Boolean
from sqlalchemy.orm import relationship, Mapped
from datetime import datetime
from typing import List
from models.plant import Base, DeprecatableMixin

# Association table
mix_soil_association = Table(
    'mix_soil_association',
    Base.metadata,
    Column('mix_id', Integer, ForeignKey('mix.id')),
    Column('soil_id', Integer, ForeignKey('soil.id'))
    Column('percentage', Integer)
)

class Mix(Base, DeprecatableMixin):
    """Soil mix model."""
    __tablename__ = "mix"

    id = Column(Integer(), primary_key=True)
    name = Column(String(100), nullable=False)
    description = Column(String(400), nullable=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now)
    experimental = Column(Boolean, default=False, nullable=False)
    
    # Plants belonging to this mix
    plants: Mapped[List["Plant"]] = relationship(
        "Plant", backref="mix", passive_deletes=True
    )  # Available plants of this mix

    matter_ids: Mapped[List["SoilMatter"]] = relationship(
        "SoilMatter",
        secondary=mix_soil_association,
        back_populates="mix_ids"
    )

    def __repr__(self) -> str:
        return f"{self.name}"

class SoilMatter(Base):
    """Soil. Created on installation."""
    __tablename__ = "soil_matter"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    description = Column(String(400), nullable=True)
    group = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    
    mix_ids: Mapped[List["Mix"]] = relationship(
        "Mix",
        secondary=mix_soil_association,
        back_populates="matter_ids"
    )

    def __repr__(self) -> str:
        return f"{self.name}"

    @static_method
    def from_json(json):
        return SoilMatter(
            name=json["name"]
            description=json["description"]
            group=json["group"]
        )