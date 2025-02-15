"""
Module for soil mix related models.
"""
from datetime import datetime
from typing import List, Dict, Any
from bson import ObjectId
from models.plant import DeprecatableMixin
from models import FlexibleModel
from shared.db import Table

class Soil(FlexibleModel):
   """Soil types available for mixes."""
   table = Table.SOIL

   def __init__(self, **kwargs):
       super().__init__(**kwargs)
       self._id = kwargs.get('_id', ObjectId())
       self.created_on = kwargs.get('created_on', datetime.now())
       self.description = kwargs.get('description')
       self.group = kwargs.get('group')
       self.name = kwargs.get('name')

   def __repr__(self) -> str:
       return f"{self.name}"

class Mix(DeprecatableMixin, FlexibleModel):
   """Soil mix model with embedded soil parts."""
   collection_name = "mix"

   def __init__(self, **kwargs):
       super().__init__(**kwargs)
       self._id = kwargs.get('_id', ObjectId())
       self.name = kwargs.get('name')
       self.description = kwargs.get('description')
       self.created_on = kwargs.get('created_on', datetime.now())
       self.updated_on = kwargs.get('updated_on', datetime.now())
       self.experimental = kwargs.get('experimental', False)
       
       # Embedded soil parts
       self.soil_parts = [
           {
               'soil_id': part.get('soil_id'),
               'parts': part.get('parts', 1),
               'created_on': part.get('created_on', datetime.now()),
               'updated_on': part.get('updated_on', datetime.now())
           }
           for part in kwargs.get('soil_parts', [])
       ]

   def __repr__(self) -> str:
       return f"{self.name}"

   def add_soil_part(self, soil_id: ObjectId, parts: int = 1) -> None:
       """Add a new soil part to the mix"""
       self.soil_parts.append({
           'soil_id': soil_id,
           'parts': parts,
           'created_on': datetime.now(),
           'updated_on': datetime.now()
       })

   def remove_soil_part(self, soil_id: ObjectId) -> None:
       """Remove a soil part from the mix"""
       self.soil_parts = [part for part in self.soil_parts if part['soil_id'] != soil_id]

   def update_soil_part(self, soil_id: ObjectId, parts: int) -> None:
       """Update the parts count for a soil in the mix"""
       for part in self.soil_parts:
           if part['soil_id'] == soil_id:
               part['parts'] = parts
               part['updated_on'] = datetime.now()
               break

#    schema = ModelConfig({
#        '_id': FieldConfig(read_only=True),
#        'created_on': FieldConfig(read_only=True),
#        'updated_on': FieldConfig(read_only=True),
#        'name': FieldConfig(),
#        'description': FieldConfig(),
#        'experimental': FieldConfig(),
#        'soil_parts': FieldConfig(read_only=False),
#        'deprecated': FieldConfig(),
#        'deprecated_on': FieldConfig(),
#        'deprecated_cause': FieldConfig()
#    })

   def to_dict(self) -> Dict[str, Any]:
       """Convert to MongoDB document format"""
       base_dict = super().to_dict()
       # Ensure soil_parts is properly formatted for MongoDB
       if 'soil_parts' in base_dict:
           base_dict['soil_parts'] = [
               {
                   'soil_id': part['soil_id'],
                   'parts': part['parts'],
                   'created_on': part['created_on'],
                   'updated_on': part['updated_on']
               }
               for part in base_dict['soil_parts']
           ]
       return base_dict