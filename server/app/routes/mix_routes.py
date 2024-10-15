from flask import Blueprint

from models.mix import Mix
from app.routes import GenericCRUD, APIBuilder

bp = Blueprint('mixes', __name__)
mix_crud = GenericCRUD(Mix, Mix.schema)
APIBuilder.register_resource(bp, 'mixes', mix_crud, ["GET", "GET_MANY", "POST", "DELETE"])
