from flask import Blueprint

from routes import GenericCRUD, APIBuilder, Schema
from shared.db import Table

bp = Blueprint('todos', __name__)
todo_crud = GenericCRUD(Table.TODO, Schema.TODO)
APIBuilder.register_blueprint(bp, 'todos', todo_crud)

# @APIBuilder.register_custom_route(bp, "/todos/<string:id>/tasks/<string:task_id>", methods=['POST'])
# def get_systems_plants(id, task_id):

