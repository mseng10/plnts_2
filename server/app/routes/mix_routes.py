from flask import Blueprint

from shared.db import Table
from routes import GenericCRUD, APIBuilder, Schema

mixes_bp = Blueprint("mixes", __name__)
mix_crud = GenericCRUD(Table.MIX, Schema.MIX)
APIBuilder.register_blueprint(
    mixes_bp, "mixes", mix_crud, ["GET", "GET_MANY", "POST", "BANISH", "PATCH"]
)

soils_bp = Blueprint("soils", __name__)
soils_crud = GenericCRUD(Table.SOIL, Schema.SOIL)
APIBuilder.register_blueprint(
    soils_bp, "soils", soils_crud, methods=["GET", "GET_MANY"]
)