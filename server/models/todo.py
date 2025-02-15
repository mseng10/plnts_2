"""
Module defining models for todos.
"""
from datetime import datetime
from typing import List, Dict, Any
from bson import ObjectId
from models.plant import DeprecatableMixin
from models import FlexibleModel, ModelConfig, FieldConfig

class Todo(DeprecatableMixin, FlexibleModel):
    """TODO model with embedded tasks."""
    collection_name = "todo"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._id = kwargs.get('_id', ObjectId())
        self.created_on = kwargs.get('created_on', datetime.now())
        self.updated_on = kwargs.get('updated_on', datetime.now())
        self.due_on = kwargs.get('due_on')
        self.name = kwargs.get('name')
        self.description = kwargs.get('description')
        
        # Embedded tasks
        self.tasks = [
            {
                'description': task.get('description'),
                'resolved': task.get('resolved', False),
                'resolved_on': task.get('resolved_on'),
                'created_on': task.get('created_on', datetime.now()),
                'updated_on': task.get('updated_on', datetime.now()),
            }
            for task in kwargs.get('tasks', [])
        ]

    def __repr__(self):
        return f"{self.name}"

    def add_task(self, description: str) -> None:
        """Add a new task to the todo"""
        self.tasks.append({
            'description': description,
            'resolved': False,
            'resolved_on': None,
            'created_on': datetime.now(),
            'updated_on': datetime.now()
        })

    def resolve_task(self, task_index: int) -> None:
        """Mark a task as resolved"""
        if 0 <= task_index < len(self.tasks):
            self.tasks[task_index]['resolved'] = True
            self.tasks[task_index]['resolved_on'] = datetime.now()
            self.tasks[task_index]['updated_on'] = datetime.now()

    def unresolve_task(self, task_index: int) -> None:
        """Mark a task as unresolved"""
        if 0 <= task_index < len(self.tasks):
            self.tasks[task_index]['resolved'] = False
            self.tasks[task_index]['resolved_on'] = None
            self.tasks[task_index]['updated_on'] = datetime.now()

    def remove_task(self, task_index: int) -> None:
        """Remove a task from the todo"""
        if 0 <= task_index < len(self.tasks):
            self.tasks.pop(task_index)

    def update_task(self, task_index: int, description: str) -> None:
        """Update a task's description"""
        if 0 <= task_index < len(self.tasks):
            self.tasks[task_index]['description'] = description
            self.tasks[task_index]['updated_on'] = datetime.now()

    schema = ModelConfig({
        '_id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'due_on': FieldConfig(),
        'name': FieldConfig(),
        'description': FieldConfig(),
        'tasks': FieldConfig(read_only=False),
        'deprecated': FieldConfig(),
        'deprecated_on': FieldConfig(),
        'deprecated_cause': FieldConfig()
    })

    def to_dict(self) -> Dict[str, Any]:
        """Convert to MongoDB document format"""
        base_dict = super().to_dict()
        if 'tasks' in base_dict:
            base_dict['tasks'] = [
                {
                    'description': task['description'],
                    'resolved': task['resolved'],
                    'resolved_on': task['resolved_on'],
                    'created_on': task['created_on'],
                    'updated_on': task['updated_on']
                }
                for task in base_dict['tasks']
            ]
        return base_dict