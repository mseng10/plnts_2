from flask import Blueprint

from routes import GenericCRUD, APIBuilder, Schema
from shared.db import Table
from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from models.todo import Todo


bp = Blueprint("todos", __name__)
todo_crud = GenericCRUD(Table.TODO, Schema.TODO)
APIBuilder.register_blueprint(bp, "todos", todo_crud, ["GET", "GET_MANY", "POST", "PATCH", "DELETE"])

@APIBuilder.register_custom_route(bp, "/todos/<string:id>/tasks/<string:task_id>/resolve", methods=['POST'])
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

@APIBuilder.register_custom_route(bp, "/todos/<string:id>/tasks/<string:task_id>/unresolve", methods=['POST'])
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
