from flask import Blueprint, jsonify, request
from db import Session
from logger import logger

from models.alert import PlantAlert, Alert
from routes.routes import GenericCRUD, APIBuilder

bp = Blueprint('alerts', __name__)
alert_crud = GenericCRUD(Alert, Alert.alert_schema)
APIBuilder.register_resource(bp, 'alerts', alert_crud, ["GET", "DELETE"])
