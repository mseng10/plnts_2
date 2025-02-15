from flask import Blueprint

from routes import GenericCRUD, APIBuilder
from models.todo import Todo

bp = Blueprint('todos', __name__)
todo_crud = GenericCRUD(Todo)
APIBuilder.register_resource(bp, 'todos', todo_crud)
