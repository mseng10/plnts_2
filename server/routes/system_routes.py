from flask import Blueprint, jsonify, request
from db import Session
from logger import setup_logger
import logging

from models.system import System, Light

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)
system_bp = Blueprint('systems', __name__, url_prefix='/systems')
light_bp = Blueprint('lights', __name__, url_prefix='/lights')

@system_bp.route("/", methods=["GET"])
def get_systems():
    """
    Retrieve all systems from the database.
    """
    logger.info("Received request to retrieve all systems")

    db = Session()
    systems = db.query(System).all()
    db.close()
    # Transform systems to JSON format
    systems_json = [system.to_json() for system in systems]
    # Return JSON response
    return jsonify(systems_json)

@system_bp.route("/", methods=["POST"])
def create_system():
    """
    Create a new system and add it to the database.
    """
    logger.info("Attempting to create system")

    new_system_json = request.get_json()

    # Create a new System object
    new_system = System(
        name=new_system_json["name"],
        temperature=new_system_json["temperature"],
        humidity=new_system_json["humidity"],
        duration=new_system_json["duration"],
        distance=new_system_json["distance"],
        description=new_system_json["description"]
    )

    # Add the new system object to the session
    db = Session()
    db.add(new_system)
    db.commit()

    # Potentially create lights that were created alongside the system
    potentially_new_light = new_system_json["light"]
    if potentially_new_light is not None:
        count = potentially_new_light["count"] if potentially_new_light["count"] else 1
        logger.info(f"Attempting to create {count} embedded lights from system request")
        
        potentially_new_light["system_id"] = new_system.id
        new_lights = [create_light_from_json(potentially_new_light) for i in range(count)]
        db.add_all(new_lights)
        db.commit()

    db.close()

    return jsonify({"message": "System added successfully"}), 201

@system_bp.route("/<int:system_id>", methods=["GET"])
def get_system(system_id):
    """
    Query the specific system.
    """
    # Log the request
    logger.info("Received request to query the system")
    db = Session()
    system = db.query(System).get(system_id)
    db.close()

    # Return JSON response
    return jsonify(system.to_json())

@system_bp.route("/<int:system_id>", methods=["PATCH"])
def update_system(system_id):
    """
    Query the specific system.
    """
    # Log the request
    logger.info(f"Received request to patch system {system_id}")

    changes = request.get_json()

    db = Session()
    system = db.query(System).get(system_id)

    system.name=changes["name"],
    system.temperature=changes["temperature"],
    system.humidity=changes["humidity"],
    system.duration=changes["duration"],
    system.distance=changes["distance"],
    system.description=changes["description"]

    db.flush()
    db.commit()

    # Return JSON response
    return jsonify(system.to_json())

@system_bp.route("/<int:system_id>/deprecate", methods=["POST"])
def system_deprecate(system_id):
    """
    Deprecate the specified system.
    """
    logger.info("Received request to deprecate the specified plants")
    db = Session()

    system = db.query(System).get(system_id)

    system.deprecated = True
    system.deprecated_on = datetime.now()
    system.deprecated_cause = "User Deletion"
    
    db.commit()
    db.close()

    return jsonify({"message": f"{len(systems)} Systems deprecated successfully:("}), 201

@system_bp.route("/<int:system_id>/plants", methods=["GET"])
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

@system_bp.route("/<int:system_id>/alerts", methods=["GET"])
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

def create_light_from_json(light):
    """
    Utiltity method to create multiple lights
    """
    return Light(
        name=light["name"],
        cost=light["cost"],
        system_id=light["system_id"]
    )

@light_bp.route("/", methods=["GET"])
def get_light():
    """
    Retrieve all lights from the database.
    """
    logger.info("Received request to retrieve all lights")

    db = Session()
    lights = db.query(Light).all()
    db.close()
    return jsonify([light.to_json() for light in lights])

@light_bp.route("/", methods=["POST"])
def create_light():
    """
    Create a new light and add it to the database.
    """
    logger.info("Attempting to create light")

    new_light_json = request.get_json()

    # Create a new Light object
    new_light = create_light_from_json(new_light_json)

    # Add the new Light object to the session
    db = Session()
    db.add(new_light)
    db.commit()
    db.close()

    return jsonify({"message": "Light added successfully"}), 201
