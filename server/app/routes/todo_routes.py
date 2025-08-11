from flask import Blueprint

from routes import GenericCRUD, APIBuilder, Schema
from shared.db import Table
from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from models.todo import Todo


todos_bp = Blueprint("todos", __name__)
todos_crud = GenericCRUD(Table.TODO, Schema.TODO)
APIBuilder.register_blueprint(
    todos_bp, "todos", todos_crud, ["GET", "GET_MANY", "POST", "PATCH", "DELETE"]
)

goals_bp = Blueprint("goals", __name__)
goals_crud = GenericCRUD(Table.GOAL, Schema.GOAL)
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

    task = next((model for model in todo.tasks if model.id == ObjectId(task_id)), None)

    task.resolved = True
    task.resolved_on = datetime.now()
    task.updated_on = datetime.now()

    todo.updated_on = datetime.now()

    Table.TODO.update(id, todo)

    return jsonify(Schema.TASK.read(task)), 201


@APIBuilder.register_custom_route(
    todos_bp, "/todos/<string:id>/tasks/<string:task_id>/unresolve", methods=["POST"]
)
def unresolve_task(id, task_id):
    todo: Todo = Table.TODO.get_one(id)
    if todo is None:
        return jsonify({"error": "Not found"}), 404

    task = next((model for model in todo.tasks if model.id == ObjectId(task_id)), None)

    task.resolved = False
    task.resolved_on = None
    task.updated_on = datetime.now()

    todo.updated_on = datetime.now()

    Table.TODO.update(id, todo)

    return jsonify(Schema.TASK.read(task)), 201
