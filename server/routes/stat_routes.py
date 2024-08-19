from flask import Blueprint, jsonify, request
from db import Session
from logger import setup_logger
import logging

from models.mix import Mix

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)
bp = Blueprint('stats', __name__, url_prefix='/stats')

@bp.route("/", methods=["GET"])
def stats():
    """
    Return stats for everything
    """
    logger.info("Received request to query the meta")

    db = Session()

    total_cost = 0
    total_cost += db.query(func.sum(Plant.cost)).scalar()
    # total_cost += db.query(func.sum(Light.cost)).scalar()

    total_active_cost = 0
    total_active_cost += db.query(func.sum(Plant.cost)).filter(Plant.deprecated == False).scalar()
    # total_active_cost += db.query(func.sum(Light.cost)).filter(Light.deprecated == False).scalar()

    stats = {
        "total_plants" : db.query(Plant).count(),
        "total_active_plants" : db.query(Plant).filter(Plant.deprecated == False).count(),
        "total_deprecated_plants": db.query(Plant).filter(Plant.deprecated == True).count(),
        "total_active_systems": db.query(System).filter(System.deprecated == False).count(),
        "total_cost": total_cost,
        "total_active_cost": total_active_cost
    }
    db.close()

    logger.info("Successfully generated stats data.")
    return jsonify(stats)