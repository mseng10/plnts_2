"""
Module defining models for plants.
"""
from datetime import datetime
from typing import List
import enum
from bson import ObjectId
from shared.db import Table

from models import FlexibleModel

class DeprecatableMixin:
    """ In case the model is deprecated."""
    def __init__(self, **kwargs):
        self.deprecated = kwargs.get('deprecated', False)
        self.deprecated_on = kwargs.get('deprecated_on')
        self.deprecated_cause = kwargs.get('deprecated_cause')

class PHASES(enum.Enum):
    ADULT = "Adult"
    CUTTING = "Cutting"
    JUVY = "Juvy"
    LEAD = "Leaf"
    SEED = "Seed"

class Plant(DeprecatableMixin, FlexibleModel):
    """Plant model."""
    table = Table.PLANT

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._id = kwargs.get('_id', ObjectId())
        self.created_on = kwargs.get('created_on', datetime.now())
        self.cost = kwargs.get('cost', 0)
        self.system_id = kwargs.get('system_id')
        self.mix_id = kwargs.get('mix_id')
        self.updated_on = kwargs.get('updated_on', datetime.now())
        
        # Metrics
        self.phase = kwargs.get('phase')
        self.size = kwargs.get('size', 0)  # inches

        # Watering info
        self.watering = kwargs.get('watering', 0)  # Days
        self.watered_on = kwargs.get('watered_on', datetime.now())

        self.species_id = kwargs.get('species_id')
        self.identity = kwargs.get('identity', 'plant')

    def __repr__(self) -> str:
        return f"{self._id}"

class Batch(Plant):
    """Batch of plants."""
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.count = kwargs.get('count', 0)
        self.identity = 'batch'

class PlantGenusType(FlexibleModel):
    table = Table.GENUS_TYPE

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._id = kwargs.get('_id', ObjectId())
        self.created_on = kwargs.get('created_on', datetime.now())
        self.updated_on = kwargs.get('updated_on', datetime.now())
        self.name = kwargs.get('name')
        self.description = kwargs.get('description')
        self.watering = kwargs.get('watering')

class PlantGenus(FlexibleModel):
    table = Table.GENUS

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._id = kwargs.get('_id', ObjectId())
        self.created_on = kwargs.get('created_on', datetime.now())
        self.updated_on = kwargs.get('updated_on', datetime.now())
        self.name = kwargs.get('name')
        self.common_name = kwargs.get('common_name')
        self.description = kwargs.get('description')
        self.watering = kwargs.get('watering')
        self.genus_type_id = kwargs.get('genus_type_id')

class PlantSpecies(FlexibleModel):
    table = Table.SPECIES

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._id = kwargs.get('_id', ObjectId())
        self.created_on = kwargs.get('created_on', datetime.now())
        self.updated_on = kwargs.get('updated_on', datetime.now())
        self.name = kwargs.get('name')
        self.common_name = kwargs.get('common_name')
        self.description = kwargs.get('description')
        self.genus_id = kwargs.get('genus_id')
