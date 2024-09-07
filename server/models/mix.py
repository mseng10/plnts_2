from sqlalchemy import Column, Integer, String, DateTime, Table, ForeignKey, Boolean
from sqlalchemy.orm import relationship, Mapped
from datetime import datetime
from typing import List
from models.plant import DeprecatableMixin
from models.model import Base, FieldConfig, ModelConfig, FlexibleModel

# Association table
mix_soil_association = Table(
    'mix_soil_association',
    Base.metadata,
    Column('mix_id', Integer, ForeignKey('mix.id')),
    Column('soil_id', Integer, ForeignKey('soil.id')),
    Column('parts', Integer)
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

    soil_ids: Mapped[List["Soil"]] = relationship(
        "Soil",
        secondary=mix_soil_association,
        back_populates="mix_ids"
    )

    def to_json(self) -> dict:
        """Convert to json."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_on": self.created_on,
            "updated_on": self.updated_on,
            "experimental": self.experimental
        }

    def __repr__(self) -> str:
        return f"{self.name}"

class Soil(Base, FlexibleModel):
    """Soil. Created on installation."""
    __tablename__ = "soil"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    description = Column(String(400), nullable=True)
    group = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    
    mix_ids: Mapped[List["Mix"]] = relationship(
        "Mix",
        secondary=mix_soil_association,
        back_populates="soil_ids"
    )

    def __repr__(self) -> str:
        return f"{self.name}"


    soil_schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'name': FieldConfig(read_only=True),
        'description': FieldConfig(read_only=True),
        'group': FieldConfig(read_only=True),
        # 'mix_ids': FieldConfig(),
    })

    @staticmethod
    def from_numpy(nump):
        return Soil(
            name=nump[0],
            description=nump[1],
            group=nump[2]
        )