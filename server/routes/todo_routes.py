from flask import Blueprint, jsonify, request, make_response
from db import Session
from logger import logger
from datetime import datetime

from routes.routes import GenericCRUD, APIBuilder
from models.alert import Todo, Task

bp = Blueprint('todos', __name__)

todo_crud = GenericCRUD(Todo, Todo.schema)
task_crud = GenericCRUD(Task, Task.schema)

APIBuilder.register_resource(bp, 'todos', todo_crud)
APIBuilder.register_resource(bp, 'tasks', task_crud)
