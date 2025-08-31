from flask import Blueprint, request, jsonify
from routes import GenericCRUD, APIBuilder
from shared.db import Table
from bson import ObjectId
from datetime import datetime
from models.todo import Todo, Task

todos_bp = Blueprint("todos", __name__)
todos_crud = GenericCRUD(Table.TODO)
APIBuilder.register_blueprint(
    todos_bp, "todos", todos_crud, ["GET", "GET_MANY", "POST", "PATCH", "DELETE"]
)

goals_bp = Blueprint("goals", __name__)
goals_crud = GenericCRUD(Table.GOAL)
APIBuilder.register_blueprint(
    goals_bp, "goals", goals_crud, ["GET", "GET_MANY", "POST", "PATCH", "DELETE"]
)


@APIBuilder.register_custom_route(
    todos_bp, "/todos/<string:id>/tasks/<string:task_id>/resolve", methods=["POST"]
)
def resolve_task(id, task_id):
    todo: Todo = Table.TODO.get_one(id)
    if todo is None:
        return jsonify({"error": "Not found"}), 404

    task: Task = next((task for task in todo.tasks if str(task.id) == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404

    task.resolved = True
    task.resolved_on = datetime.now()
    task.updated_on = datetime.now()
    todo.updated_on = datetime.now()

    Table.TODO.update(id, todo)
    return jsonify(task.model_dump(mode="json")), 201


@APIBuilder.register_custom_route(
    todos_bp, "/todos/<string:id>/tasks/<string:task_id>/unresolve", methods=["POST"]
)
def unresolve_task(id, task_id):
    todo: Todo = Table.TODO.get_one(id)
    if todo is None:
        return jsonify({"error": "Not found"}), 404

    task = next((task for task in todo.tasks if str(task.id) == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404

    task.resolved = False
    task.resolved_on = None
    task.updated_on = datetime.now()
    todo.updated_on = datetime.now()

    Table.TODO.update(id, todo)
    return jsonify(task.model_dump(mode="json")), 201
