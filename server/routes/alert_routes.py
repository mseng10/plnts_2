from flask import Blueprint, jsonify, request

from models.alert import PlantAlert, Alert
from routes import GenericCRUD, APIBuilder

bp = Blueprint('alerts', __name__)
alert_crud = GenericCRUD(Alert, Alert.schema)
APIBuilder.register_resource(bp, 'alerts', alert_crud, ["GET", "DELETE"])
