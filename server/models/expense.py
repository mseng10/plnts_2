from datetime import datetime
import enum
from bson import ObjectId

from models import FlexibleModel, Fields, DeprecatableMixin, ExpenseMixin


class EXPENSE_CATEGORY(enum.Enum):
    NEED = "Adult"
    CRAP = "Cutting"


class Expense(FlexibleModel, DeprecatableMixin, ExpenseMixin):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.name = kwargs.get("name", "Unkwown")
        self.category = kwargs.get("category", EXPENSE_CATEGORY.NEED.value)


class Budget(FlexibleModel, DeprecatableMixin):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.budget = kwargs.get("cost", 0)
        self.month = kwargs.get("month")
