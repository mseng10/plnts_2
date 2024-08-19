from flask import Blueprint, jsonify, request
from db import Session
from logger import setup_logger
import logging

from models.plant import Genus, Type
from models.mix import Soil

logger = setup_logger(__name__, logging.DEBUG)

types_bp = Blueprint('types', __name__, url_prefix='/types')
genuses_bp = Blueprint('genuses', __name__, url_prefix='/genuses')
soils_bp = Blueprint('genuses', __name__, url_prefix='/soils')

@genuses_bp.route("/", methods=["GET"])
def get_genuses():
    """
    Retrieve all genuses from the database.
    """
    logger.info("Received request to retrieve all plant genuses")

    db = Session()
    genuses = db.query(Genus).all()
    db.close()
    # Transform genuses to JSON format
    genuses_json = [genus.to_json() for genus in genuses]
    # Return JSON response
    return jsonify(genuses_json)

@genuses_bp.route("/", methods=["POST"])
def create_genus():
    """
    Create a new genus and add it to the database.
    """
    logger.info("Attempting to create genus")

    new_genus_data = request.get_json()

    # Create a new Genus object
    new_genus = Genus(name=new_genus_data["name"], watering=new_genus_data["watering"])

    # Add the new genus object to the session
    db = Session()
    db.add(new_genus)
    db.commit()
    db.close()

    return jsonify({"message": "Genus added successfully"}), 201

@types_bp.route("/", methods=["GET"])
def get_types():
    """
    Retrieve all types from the database.
    """
    logger.info("Received request to retrieve all plant types")

    db = Session()
    types = db.query(Type).all()
    db.close()
    # Transform types to JSON format
    types_json = [_type.to_json() for _type in types]
    # Return JSON response
    return jsonify(types_json)

@types_bp.route("/", methods=["POST"])
def create_type():
    """
    Create a new type and add it to the database.
    """
    logger.info("Attempting to create type")

    new_type_data = request.get_json()

    # Create a new Type object
    new_type = Type(
        name=new_type_data["name"],
        description=new_type_data["description"],
        genus_id=new_type_data["genus_id"]
    )

    # Add the new type object to the session
    db = Session()
    db.add(new_type)
    db.commit()
    db.close()

    return jsonify({"message": "Type added successfully"}), 201

@soils_bp.route("/", methods=["GET"])
def get_soils():
    """
    Retrieve all soils from the database.
    """
    logger.info("Received request to retrieve all soils")
    db = Session()
    soils = db.query(Soil).all()
    db.close()

    soils_json = [soil.to_json() for soil in soils]

    logger.info("Succesfully queried all soils")
    return jsonify(soils_json)

@soils_bp.route("/", methods=["POST"])
def create_soil():
    """
    Create a new soil and add it to the database.
    """
    logger.info("Attempting to create soil")

    new_soil_data = request.get_json()

    # Create a new Soil object
    new_soil = Soil(
        name=new_soil_data["name"],
        description=new_soil_data["description"],
        group=new_soil_data["group"]
    )

    # Add the new soil object to the session
    db = Session()
    db.add(new_soil)
    db.commit()
    db.close()

    return jsonify({"message": "Soil added successfully"}), 201