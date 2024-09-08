from flask import Blueprint, jsonify, request
from db import Session
from logger import logger

from models.system import System, Light
from routes.routes import GenericCRUD, APIBuilder

system_bp = Blueprint('systems', __name__)
system_crud = GenericCRUD(System, System.schema)
APIBuilder.register_resource(system_bp, 'systems', system_crud)

@APIBuilder.register_custom_route(system_bp, '<int:system_id>/plants/', ['GET'])
def get_systems_plants(system_id):
    """
    Get system's plants.
    """
    # Log the request
    logger.info("Received request to get a system's plants")
    
    db = Session()
    plants = db.query(Plant).filter(Plant.system_id == system_id).all()
    db.close()

    # Transform plant alerts to JSON format
    plants_json = [plant.to_json() for plant in plants]

    # Return JSON response
    return jsonify(plants_json)

@APIBuilder.register_custom_route(system_bp, "<int:system_id>/alerts/", ["GET"])
def get_systems_alerts(system_id):
    """
    Get system's alerts.
    """
    # Log the request
    logger.info("Received request to get a system's alerts")
    
    db = Session()
    plant_alerts = db.query(PlantAlert).filter(Plant.system_id == system_id).all()
    db.close()

    # Transform plant alerts to JSON format
    plant_alerts_json = [plant_alert.to_json() for plant_alert in plant_alerts]

    # Return JSON response
    return jsonify(plant_alerts_json)

light_bp = Blueprint('lights', __name__)
light_crud = GenericCRUD(Light, Light.schema)
APIBuilder.register_resource(light_bp, 'lights', light_crud, ["GET", "GET_MANY", "POST"])

# TODO: Fix when I have more strength
# # Potentially create lights that were created alongside the system
# potentially_new_light = new_system_json["light"]
# if potentially_new_light is not None:
#     count = potentially_new_light["count"] if potentially_new_light["count"] else 1
#     logger.info(f"Attempting to create {count} embedded lights from system request")
    
#     potentially_new_light["system_id"] = new_system.id
#     new_lights = [create_light_from_json(potentially_new_light) for i in range(count)]
#     db.add_all(new_lights)
#     db.commit()

# db.close()

# def create_light_from_json(light):
#     """
#     Utiltity method to create multiple lights
#     """
#     return Light(
#         name=light["name"],
#         cost=light["cost"],
#         system_id=light["system_id"]
#     )
