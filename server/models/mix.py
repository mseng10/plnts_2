from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, Mapped

from datetime import datetime
from typing import List

from models.plant import DeprecatableMixin
from models import Base, FieldConfig, ModelConfig, FlexibleModel

class Soil(Base, FlexibleModel):
    """Soil. Created on installation."""
    __tablename__ = "soil"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    description = Column(String(400), nullable=False)
    group = Column(String(100), nullable=False)
    name = Column(String(100), nullable=False)
    
    mix_soil_parts: Mapped[List["SoilPart"]] = relationship(
        "SoilPart", backref="soil", passive_deletes=True
    )

    def __repr__(self) -> str:
        return f"{self.name}"

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'name': FieldConfig(read_only=True),
        'description': FieldConfig(read_only=True),
        'group': FieldConfig(read_only=True)
    })

class SoilPart(Base, FlexibleModel):
    __tablename__ = 'mix_soil_part'

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    mix_id = Column(Integer, ForeignKey('mix.id'), nullable=False)
    # mix = relationship("Mix", back_populates="soils")
    soil_id = Column(Integer, ForeignKey('soil.id'), nullable=False)
    # soil = relationship("Soil", back_populates="mixes")
    parts = Column(Integer, default=1, nullable=False)

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'mix_id': FieldConfig(),
        'soil_id': FieldConfig(),
        'parts': FieldConfig()
    })

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

    soil_parts: Mapped[List["SoilPart"]] = relationship(
        "SoilPart", backref="mix", passive_deletes=True
    )  # Available tasks of this todo


    def __repr__(self) -> str:
        return f"{self.name}"

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'name': FieldConfig(),
        'description': FieldConfig(),
        'experimental': FieldConfig(),
        'soil_parts': FieldConfig(nested=SoilPart.schema, nested_class=SoilPart, include_nested=True, delete_with_parent=True, nested_identifier='mix_id'),
        # parts: Fieldconfig ?
    })
