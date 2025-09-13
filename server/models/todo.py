"""
Module defining models for todos using the updated FlexibleModel.
"""

from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import Field, field_validator, model_validator
from models import FlexibleModel, ObjectIdPydantic
from enum import Enum

class Task(FlexibleModel):
    """TODO task"""

    description: str
    resolved_on: Optional[datetime] = None
    resolved: bool = False

    @model_validator(mode="before")
    @classmethod
    def update_timestamp_on_resolution(cls, values):
        """Update resolved_on timestamp when task is marked as resolved"""
        if isinstance(values, dict):
            # If resolved is being set to True and resolved_on is not set
            if values.get("resolved") and not values.get("resolved_on"):
                values["resolved_on"] = datetime.now()
            # If resolved is being set to False, clear resolved_on
            elif not values.get("resolved", False):
                values["resolved_on"] = None
        return values


class Todo(FlexibleModel):
    """TODO model with embedded tasks."""

    due_on: datetime
    name: str
    description: str
    goal_id: Optional[ObjectIdPydantic] = None  # nullable reference to Goal

    tasks: List[Task] = Field(default_factory=list)

    def __repr__(self):
        return f"{self.name or 'Unnamed Todo'}"

    @model_validator(mode="before")
    @classmethod
    def process_embedded_tasks(cls, values):
        """Convert task dictionaries to Task instances if needed"""
        if isinstance(values, dict) and "tasks" in values:
            tasks = values["tasks"]
            if tasks and isinstance(tasks[0], dict):
                # Convert dict representations to Task instances
                values["tasks"] = [Task.model_validate(task) for task in tasks]
        return values

    def to_dict(self) -> Dict[str, Any]:
        """Convert to MongoDB document format with embedded tasks"""
        base_dict = super().to_dict()
        # Ensure tasks are properly serialized as dictionaries
        if "tasks" in base_dict and self.tasks:
            base_dict["tasks"] = [task.to_dict() for task in self.tasks]
        return base_dict

    # Helper methods for task management
    def add_task(self, description: str) -> Task:
        """Add a new task to this todo"""
        task = Task(description=description)
        self.tasks.append(task)
        self.updated_on = datetime.now()
        return task

    def complete_task(self, task_index: int) -> bool:
        """Mark a specific task as completed"""
        if 0 <= task_index < len(self.tasks):
            self.tasks[task_index].resolved = True
            self.tasks[task_index].resolved_on = datetime.now()
            self.updated_on = datetime.now()
            return True
        return False

    def get_completed_tasks(self) -> List[Task]:
        """Get all completed tasks"""
        return [task for task in self.tasks if task.resolved]

    def get_pending_tasks(self) -> List[Task]:
        """Get all pending tasks"""
        return [task for task in self.tasks if not task.resolved]

class GoalStatus(str, Enum):
    """Goal status enum"""

    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ON_HOLD = "on_hold"
    CANCELLED = "cancelled"


class Goal(FlexibleModel):
    """Goal model"""

    name: str
    description: str
    due_month: Optional[str] = None
    status: GoalStatus = GoalStatus.NOT_STARTED

    @field_validator("due_month")
    @classmethod
    def validate_due_month(cls, v):
        """Validate due_month format (optional enhancement)"""
        if v is None:
            return v
        # Add your specific validation logic here if needed
        # Example: validate YYYY-MM format or month names
        if isinstance(v, str) and len(v) > 0:
            return v
        return v

    def __repr__(self):
        return f"{self.name} ({self.due_month or 'No due date'})"
