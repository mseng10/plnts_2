from flask import Blueprint

from shared.db import Table
from routes import GenericCRUD, APIBuilder, Schema

bp = Blueprint("mixes", __name__)
mix_crud = GenericCRUD(Table.MIX, Schema.MIX)
APIBuilder.register_blueprint(
    bp, "mixes", mix_crud, ["GET", "GET_MANY", "POST", "BANISH", "PATCH"]
)
