"""
Module defining models for todos using the updated FlexibleModel.
"""
from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import Field, field_validator, model_validator
from models import FlexibleModel, ObjectIdPydantic


class Task(FlexibleModel):
    """TODO task"""

    description: Optional[str] = None
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
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

    # Note: No longer inheriting from BanishableMixin since FlexibleModel now has banishing built-in
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    due_on: Optional[datetime] = None
    name: Optional[str] = None
    description: Optional[str] = None
    goal_id: Optional[ObjectIdPydantic] = None  # nullable reference to Goal

    # Embedded tasks - Pydantic handles the conversion automatically
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


class Goal(FlexibleModel):
    """Goal model"""

    # Note: No longer inheriting from BanishableMixin since FlexibleModel now has banishing built-in
    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)
    name: Optional[str] = None
    description: Optional[str] = None
    due_month: Optional[str] = None  # Consider using a more specific date type
    status: str = "not_started"

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        """Validate status field values"""
        valid_statuses = {
            "not_started",
            "in_progress",
            "completed",
            "on_hold",
            "cancelled",
        }
        if v not in valid_statuses:
            raise ValueError(f"Status must be one of: {valid_statuses}")
        return v

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
        return f"{self.name or 'Unnamed Goal'} ({self.due_month or 'No due date'})"

    # Helper methods for goal management
    def mark_completed(self):
        """Mark this goal as completed"""
        self.status = "completed"
        self.updated_on = datetime.now()

    def mark_in_progress(self):
        """Mark this goal as in progress"""
        self.status = "in_progress"
        self.updated_on = datetime.now()

    def put_on_hold(self, cause: Optional[str] = None):
        """Put this goal on hold"""
        self.status = "on_hold"
        self.updated_on = datetime.now()
        # Could store the cause in a custom field if needed

    def cancel(self, cause: Optional[str] = None):
        """Cancel this goal"""
        self.status = "cancelled"
        self.updated_on = datetime.now()
        # Could store the cause in a custom field if needed
