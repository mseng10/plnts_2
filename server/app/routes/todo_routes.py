from flask import Blueprint

from app.routes import GenericCRUD, APIBuilder
from models.todo import Todo, Task

bp = Blueprint('todos', __name__)
tasks_bp = Blueprint('tasks', __name__)

todo_crud = GenericCRUD(Todo, Todo.schema)
task_crud = GenericCRUD(Task, Task.schema)

APIBuilder.register_resource(bp, 'todos', todo_crud)
APIBuilder.register_resource(tasks_bp, 'tasks', task_crud)
