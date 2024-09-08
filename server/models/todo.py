"""
Module defining models for plants.
"""

from datetime import datetime
from typing import List

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.plant import DeprecatableMixin
from models import FlexibleModel, ModelConfig, FieldConfig, Base

class Task(Base, DeprecatableMixin, FlexibleModel):
    """Task of a Todo."""

    __tablename__ = "task"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    description = Column(String(100), nullable=False)
    todo_id: Mapped[int] = mapped_column(
        ForeignKey("todo.id", ondelete="CASCADE")
    )  # Todo this task belongs to
    
    resolved = Column(Boolean, default=False, nullable=False)
    resolved_on = Column(DateTime(), nullable=True)

    def __repr__(self):
        return f"{self.description}"

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'todo_id': FieldConfig(),
        'description': FieldConfig(),
        'resolved': FieldConfig(),
        'resolved_on': FieldConfig()
    })

class Todo(Base, DeprecatableMixin, FlexibleModel):
    """TOOO model."""

    __tablename__ = "todo"

    id = Column(Integer(), primary_key=True)
    created_on = Column(DateTime(), default=datetime.now)
    updated_on = Column(DateTime(), default=datetime.now, onupdate=datetime.now)
    due_on = Column(DateTime(), default=None, nullable=True)
    name = Column(String(100), nullable=False)
    description = Column(String(400), nullable=True)

    tasks: Mapped[List["Task"]] = relationship(
        "Task", backref="todo", passive_deletes=True
    )  # Available tasks of this todo

    schema = ModelConfig({
        'id': FieldConfig(read_only=True),
        'created_on': FieldConfig(read_only=True),
        'updated_on': FieldConfig(read_only=True),
        'due_on': FieldConfig(),
        'name': FieldConfig(),
        'description': FieldConfig(),
        'tasks': FieldConfig(nested=Task.schema, include_nested=True, delete_with_parent=True) 
    })

    def __repr__(self):
        return f"{self.name}"