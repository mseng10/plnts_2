from flask import Blueprint, jsonify, request
from db import Session
from logger import logger

from models.plant import Plant

bp = Blueprint('plants', __name__, url_prefix='/plants')

@bp.route("/", methods=["POST"])
def create_plant():
    """
    Add a new plant to the database.
    """
    logger.info("Attempting to create plant")
    # Get JSON data from request
    new_plant_data = request.get_json()
    # Create a new Plant object
    new_plant = Plant(
        cost=new_plant_data["cost"],
        size=new_plant_data["size"],
        genus_id=new_plant_data["genus_id"],
        type_id=new_plant_data["type_id"],
        system_id=new_plant_data["system_id"],
        watering=new_plant_data["watering"],
        phase = new_plant_data["phase"],
        mix_id = new_plant_data["mix_id"]
    )
    # Add the new plant object to the session
    db = Session()
    db.add(new_plant)
    db.commit()
    db.close()
    # Return response
    return jsonify({"message": "Plant added successfully"}), 201

@bp.route("/", methods=["GET"])
def get_plants():
    """
    Retrieve all plants from the database.
    """
    # Log the request
    logger.info("Received request to retrieve all plants")
    db = Session()
    plants = db.query(Plant).all()
    db.close()
    # Transform plants to JSON format
    plants_json = [plant.to_json() for plant in plants]
    # Return JSON response
    return jsonify(plants_json)

@bp.route("/plants/<int:plant_id>", methods=["GET"])
def get_plant(plant_id):
    """
    Query the specific plant.
    """
    # Log the request
    logger.info("Received request to query the plant")
    db = Session()
    plant = db.query(Plant).get(plant_id)
    session.close()

    # Return JSON response
    return jsonify(plant.to_json())

@bp.route("/<int:plant_id>", methods=["PATCH"])
def update_plant(plant_id):
    """
    Query the specific plant.
    """
    # Log the request
    logger.info("Received request to query the plant")

    changes = request.get_json()

    db = Session()
    plant = db.query(Plant).get(plant_id)

    plant.cost = changes["cost"]
    plant.size = change["size"]
    plant.genus_id = change["genus_id"]
    plant.type_id=change["type_id"],
    plant.system_id=change["system_id"],
    plant.watering=change["watering"],
    plant.phase = change["phase"]
    plant.updated_on = datetime.now

    db.flush()
    db.commit()

    # Return JSON response
    return jsonify(plant.to_json())

@bp.route("/water", methods=["POST"])
def water_plants():
    """
    Water the specified plants.
    """
    logger.info("Received request to water the specified plants")
    watering_ids = [int(id) for id in request.get_json()["ids"]]
    db = Session()
    plants = db.query(Plant).filter(Plant.id.in_(watering_ids)).all()
    now = datetime.now()
    for plant in plants:
        plant.watered_on = now
        plant.updated_on = now
    db.commit()
    db.close()

    return jsonify({"message": f"{len(plants)} Plants watered successfully"}), 201

@bp.route("/deprecate", methods=["POST"])
def deprecate_plants():
    """
    Deprecate the specified plants.
    """
    logger.info("Received request to deprecate the specified plants")

    deprecate_ids = [int(id) for id in request.get_json()["ids"]]
    cause = request.get_json()["cause"]

    db = Session()
    plants = db.query(Plant).filter(Plant.id.in_(watering_ids)).all()
    now = datetime.now()
    for plant in plants:
        plant.deprecated = True
        plant.deprecated_on = datetime.now()
        plant.deprecated_cause = cause
    
    db.commit()
    db.close()

    return jsonify({"message": f"{len(plants)} Plants deprecated successfully:("}), 201
