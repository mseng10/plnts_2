from flask import Blueprint

from models.mix import Mix
from routes import GenericCRUD, APIBuilder

bp = Blueprint('mixes', __name__)
mix_crud = GenericCRUD(Mix)
APIBuilder.register_resource(bp, 'mixes', mix_crud, ["GET", "GET_MANY", "POST", "DELETE"])
