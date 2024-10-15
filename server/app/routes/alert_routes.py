from flask import Blueprint

from models.alert import Alert
from app.routes import GenericCRUD, APIBuilder

bp = Blueprint('alerts', __name__)
alert_crud = GenericCRUD(Alert, Alert.schema)
APIBuilder.register_resource(bp, 'alerts', alert_crud, ["GET", "GET_MANY", "DELETE"])
