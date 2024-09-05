from flask import Blueprint, jsonify, request, make_response
from db import Session
from logger import logger
from datetime import datetime

from models.alert import Todo, Task

bp = Blueprint('todos', __name__, url_prefix='/todos')

@bp.route("/", methods=["GET"])
def get_todos():
    """
    Retrieve all todos from the database.
    """
    logger.info("Received request to retrieve all todos")

    db = Session()
    todos = db.query(Todo).all()
    db.close()
    # Transform plant alerts to JSON format
    todos_json = [todo.to_json() for todo in todos if todo.deprecated is False]
    # Return JSON response
    return jsonify(todos_json)

@bp.route("/", methods=["POST"])
def create_todo():
    """
    Create a new TODO and add it to the database.
    """
    logger.info("Attempting to create TODO")

    new_todo_data = request.get_json()

    # Create a new Todo object
    new_todo = Todo(
        description=new_todo_data["description"],
        name=new_todo_data["name"],
        due_on=new_todo_data["due_on"]
    )

    # Add the new TODO object to the session
    db = Session()
    db.add(new_todo)
    db.flush()

    # Create Tasks
    potentially_new_tasks = new_todo_data["tasks"]
    if potentially_new_tasks is not None:
        logger.info(f"Attempting to create {len(potentially_new_tasks)} embedded tasks from todo creation request")

        for new_task in potentially_new_tasks:
            new_task = Task(
                description=new_task["description"],
                todo_id=new_todo.id,
            )
            db.add(new_task)
        db.commit()

        logger.info(f"Successfully created {len(potentially_new_tasks)} tasks from todo creation request")

    db.close()

    return jsonify({"message": "TODO added successfully"}), 201

@bp.route("/<int:todo_id>/", methods=["PATCH"])
def update_todo(todo_id):
    """
    Query the specific todo.
    """
    # Log the request
    logger.info(f"Received request to patch todo {todo_id}")

    changes = request.get_json()

    db = Session()
    todo = db.query(Todo).get(todo_id)

    todo.name = changes["name"]
    todo.description = changes["description"]
    todo.due_on = changes["due_on"]

    db.flush()
    db.commit()

    # Return JSON response
    return jsonify(todo.to_json())

@bp.route("/<int:todo_id>", methods=["GET"])
def get_todo(todo_id):
    """
    Query the specific todo.
    """
    # Log the request
    logger.info("Received request to query the todo")
    db = Session()
    todo = db.query(Todo).get(todo_id)
    db.close()

    # Return JSON response
    return jsonify(todo.to_json())

@bp.route("/<int:todo_id>/deprecate/", methods=["POST"])
def todo_deprecate(todo_id):
    """
    Resolves the todo.
    """
    logger.info("Received request to resolve todo")
    db = Session()

    todo = db.query(Todo).get(todo_id)
    todo.deprecated = True
    todo.deprecated_on = datetime.now()

    db.flush()
    db.commit()

    return jsonify(todo.to_json())

@bp.route("/<int:todo_id>/tasks/<int:task_id>/", methods=["PATCH"])
def todo_task_update(todo_id, task_id):
    """
    Update the todo's task.
    """
    logger.info("Received request to resolve a todo's task")
    db = Session()

    changes = request.get_json()

    task = db.query(Task).get(task_id)
    task.description = changes["description"]
    task.resolved_on = changes["resolved_on"]
    task.resolved = change["resolved"]

    db.flush()
    db.commit()

    return jsonify(task.to_json())
