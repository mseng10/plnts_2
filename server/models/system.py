"""
Module defining models for system.
"""
from datetime import datetime
from typing import List
from bson import ObjectId
from models.plant import DeprecatableMixin
from models import FlexibleModel, ModelConfig, FieldConfig

class Light(DeprecatableMixin, FlexibleModel):
   """Light model."""
   collection_name = "light"

   def __init__(self, **kwargs):
       super().__init__(**kwargs)
       self._id = kwargs.get('_id', ObjectId())
       self.name = kwargs.get('name')
       self.created_on = kwargs.get('created_on', datetime.now())
       self.updated_on = kwargs.get('updated_on', datetime.now())
       self.cost = kwargs.get('cost', 0)
       self.system_id = kwargs.get('system_id')

   def __repr__(self) -> str:
       return f"{self.name}"

   schema = ModelConfig({
       '_id': FieldConfig(read_only=True),
       'created_on': FieldConfig(read_only=True),
       'updated_on': FieldConfig(read_only=True),
       'name': FieldConfig(),
       'cost': FieldConfig(),
       'system_id': FieldConfig(),
       'deprecated': FieldConfig(),
       'deprecated_on': FieldConfig(),
       'deprecated_cause': FieldConfig()
   })

class System(DeprecatableMixin, FlexibleModel):
   """System model."""
   collection_name = "system"

   def __init__(self, **kwargs):
       super().__init__(**kwargs)
       self._id = kwargs.get('_id', ObjectId())
       self.name = kwargs.get('name')
       self.description = kwargs.get('description')
       self.created_on = kwargs.get('created_on', datetime.now())
       self.updated_on = kwargs.get('updated_on', datetime.now())

       # Controlled Factors
       self.target_humidity = kwargs.get('target_humidity', 0)  # %
       self.target_temperature = kwargs.get('target_temperature', 0)  # F

       # Latest updates
       self.last_humidity = kwargs.get('last_humidity')  # %
       self.last_temperature = kwargs.get('last_temperature')  # F

       # Internal
       self.container_id = kwargs.get('container_id')
       self.url = kwargs.get('url')

       # Lighting
       self.duration = kwargs.get('duration')  # hours
       self.distance = kwargs.get('distance')  # inches

   def __repr__(self) -> str:
       return f"{self.name}"

   schema = ModelConfig({
       '_id': FieldConfig(read_only=True),
       'created_on': FieldConfig(read_only=True),
       'updated_on': FieldConfig(read_only=True),
       'last_humidity': FieldConfig(read_only=True),
       'last_temperature': FieldConfig(read_only=True),
       'container_id': FieldConfig(internal_only=True),
       'is_local': FieldConfig(internal_only=True),
       'url': FieldConfig(internal_only=True),
       'name': FieldConfig(),
       'description': FieldConfig(),
       'target_humidity': FieldConfig(),
       'target_temperature': FieldConfig(),
       'duration': FieldConfig(),
       'distance': FieldConfig(),
       'deprecated': FieldConfig(),
       'deprecated_on': FieldConfig(),
       'deprecated_cause': FieldConfig()
       # Relationships will be handled by querying the related collections
       # 'plants': FieldConfig(nested=Plant.schema, include_nested=True, delete_with_parent=True)
       # 'lights': FieldConfig(nested=Light.schema, include_nested=True, delete_with_parent=True)
   })