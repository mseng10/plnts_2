from sqlalchemy import func

from flask import Blueprint, jsonify, request
from db import Session, safe_sum
from logger import logger

from models.mix import Mix
from models.plant import Plant
from models.system import System
from models.system import Light

bp = Blueprint('stats', __name__, url_prefix='/stats')

@bp.route("/", methods=["GET"])
def stats():
    """
    Return stats for everything.
    """
    logger.info("Received request to query the stats")

    db = Session()

    total_cost = 0
    total_cost += db.query(safe_sum(Plant.cost)).scalar()
    total_cost += db.query(safe_sum(Light.cost)).scalar()

    total_active_cost = 0
    total_active_cost += db.query(safe_sum(Plant.cost)).filter(Plant.deprecated == False).scalar()
    total_active_cost += db.query(safe_sum(Light.cost)).filter(Light.deprecated == False).scalar()

    stats = {
        "total_plants" : db.query(Plant).count(),
        "total_active_plants" : db.query(Plant).filter(Plant.deprecated == False).count(),
        "total_deprecated_plants": db.query(Plant).filter(Plant.deprecated == True).count(),
        "total_active_systems": db.query(System).filter(System.deprecated == False).scalar(),
        "total_cost": total_cost,
        "total_active_cost": total_active_cost
    }
    db.close()

    logger.info("Successfully generated statistical data.")
    return jsonify(stats)