"""
Module defining models for todos.
"""
from datetime import datetime
from typing import Dict, Any, List
from bson import ObjectId
from models import FlexibleModel, BanishableMixin, Fields


class Task(FlexibleModel):
    """TODO Item"""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.description = kwargs.get("description")
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.resolved_on = kwargs.get("resolved_on")
        self.resolved = kwargs.get("resolved", False)


class Todo(BanishableMixin, FlexibleModel):
    """TODO model with embedded tasks."""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.id = Fields.object_id(kwargs.get("_id", ObjectId()))
        self.created_on = kwargs.get("created_on", datetime.now())
        self.updated_on = kwargs.get("updated_on", datetime.now())
        self.due_on = kwargs.get("due_on")
        self.name = kwargs.get("name")
        self.description = kwargs.get("description")

        # Embedded tasks
        self.tasks: List[Task] = [Task(**task) for task in kwargs.get("tasks", [])]

    def __repr__(self):
        return f"{self.name}"

    def to_dict(self) -> Dict[str, Any]:
        """Convert to MongoDB document format"""
        base_dict = super().to_dict()
        if "tasks" in base_dict:
            base_dict["tasks"] = [task.to_dict() for task in self.tasks]
        return base_dict
