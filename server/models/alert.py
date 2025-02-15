"""
Module defining models for alerts.
"""
from datetime import datetime
from bson import ObjectId
from models.plant import DeprecatableMixin
from models import FlexibleModel, ModelConfig, FieldConfig

class Alert(DeprecatableMixin, FlexibleModel):
   """Alert Base Class"""
   collection_name = "alert"

   def __init__(self, **kwargs):
       super().__init__(**kwargs)
       self._id = kwargs.get('_id', ObjectId())
       self.created_on = kwargs.get('created_on', datetime.now())
       self.updated_on = kwargs.get('updated_on', datetime.now())
       self.alert_type = kwargs.get('alert_type', 'alert')

   schema = ModelConfig({
       '_id': FieldConfig(read_only=True),
       'created_on': FieldConfig(read_only=True),
       'updated_on': FieldConfig(read_only=True),
       'alert_type': FieldConfig(read_only=True),
       'deprecated': FieldConfig(),
       'deprecated_on': FieldConfig(),
       'deprecated_cause': FieldConfig()
   })

class PlantAlert(Alert):
   """Plant alert model."""
   collection_name = "alert"  # Same collection as Alert

   def __init__(self, **kwargs):
       super().__init__(**kwargs)
       self.alert_type = 'plant_alert'  # Override alert_type
       self.plant_alert_type = kwargs.get('plant_alert_type')
       self.plant_id = kwargs.get('plant_id')
       self.system_id = kwargs.get('system_id')

   def __repr__(self):
       return "plant_alert"

   schema = ModelConfig({
       '_id': FieldConfig(read_only=True),
       'created_on': FieldConfig(read_only=True),
       'updated_on': FieldConfig(read_only=True),
       'alert_type': FieldConfig(read_only=True),
       'plant_alert_type': FieldConfig(read_only=True),
       'plant_id': FieldConfig(read_only=True),
       'system_id': FieldConfig(read_only=True),
       'deprecated': FieldConfig(),
       'deprecated_on': FieldConfig(),
       'deprecated_cause': FieldConfig()
   })

   @classmethod
   def find_by_plant(cls, db, plant_id: ObjectId):
       """Find all alerts for a specific plant"""
       return db[cls.collection_name].find({
           'alert_type': 'plant_alert',
           'plant_id': plant_id
       })

   @classmethod
   def find_by_system(cls, db, system_id: ObjectId):
       """Find all alerts for a specific system"""
       return db[cls.collection_name].find({
           'alert_type': 'plant_alert',
           'system_id': system_id
       })