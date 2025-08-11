from datetime import datetime
import enum
from bson import ObjectId

from models import FlexibleModel, Fields, DeprecatableMixin, UNKNOWN

class InventoryItem(FlexibleModel, DeprecatableMixin):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.name = kwargs.get("name", UNKNOWN)
        self.cost = kwargs.get("cost", 0)
        self.inventory_type_id = Fields.object_id(kwargs.get("inventory_type_id"))
        self.data = kwargs.get("data", {})


class InventoryType(FlexibleModel):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.data_schema = kwargs.get("data_schema", {})
        self.name = kwargs.get("name", UNKNOWN)
