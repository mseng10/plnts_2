from flask import Blueprint

from shared.db import Table
from routes import GenericCRUD, APIBuilder, Schema

bp = Blueprint("alerts", __name__)
alert_crud = GenericCRUD(Table.ALERT, Schema.ALERT)
APIBuilder.register_blueprint(bp, "alerts", alert_crud, ["GET", "GET_MANY", "BANISH"])
