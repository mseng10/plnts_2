from flask import Blueprint, jsonify
from shared.logger import logger
from shared.db import Table
from bson import ObjectId
from routes import GenericCRUD, APIBuilder

system_bp = Blueprint("systems", __name__)
system_crud = GenericCRUD(Table.SYSTEM)
APIBuilder.register_blueprint(
    system_bp, "systems", system_crud, ["GET", "GET_MANY", "POST", "PATCH", "BANISH"]
)

@APIBuilder.register_custom_route(
    system_bp, "/systems/<string:id>/plants/", methods=["GET"]
)
def get_systems_plants(id):
    """Get system's plants."""
    logger.info("Received request to get a system's plants")
    plants = Table.PLANT.get_many({"system_id": id})
    return jsonify([plant.model_dump(mode='json') for plant in plants])

@APIBuilder.register_custom_route(
    system_bp, "/systems/<string:id>/alerts/", methods=["GET"]
)
def get_systems_alerts(id):
    """Get system's alerts."""
    logger.info("Received request to get a system's alerts")
    alerts = Table.ALERT.get_many({"model_id": ObjectId(id)})
    return jsonify([alert.model_dump(mode='json') for alert in alerts])

@APIBuilder.register_custom_route(
    system_bp, "/systems/<string:id>/lights/", methods=["GET"]
)
def get_systems_lights(id):
    """Get system's lights."""
    logger.info("Received request to get a system's lights")
    lights = Table.LIGHT.get_many({"system_id": ObjectId(id)})
    return jsonify([light.model_dump(mode='json') for light in lights])

light_bp = Blueprint("lights", __name__)
light_crud = GenericCRUD(Table.LIGHT)
APIBuilder.register_blueprint(
    light_bp, "lights", light_crud, ["GET", "GET_MANY", "POST", "BANISH"]
)