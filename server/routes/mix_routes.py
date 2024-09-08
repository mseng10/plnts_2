from flask import Blueprint, jsonify, request

from models.mix import Mix
from routes import GenericCRUD, APIBuilder

bp = Blueprint('mixes', __name__)
mix_crud = GenericCRUD(Mix, Mix.schema)
APIBuilder.register_resource(bp, 'mixes', mix_crud, ["GET", "POST", "DELETE"])
