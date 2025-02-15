from flask import Blueprint, jsonify
from shared.db import Table
from shared.logger import logger

# Standard Blueprint
bp = Blueprint('stats', __name__, url_prefix='/stats')

@bp.route("/", methods=["GET"])
def stats():
    """
    Return stats for everything.
    """
    logger.info("Received request to query the stats")

    # Extract values safely from aggregation results
    stats = {
        "total_plants": Table.PLANT.count({}),
        "total_active_plants": Table.PLANT.count({'deprecated': False}),
        "total_deprecated_plants": Table.PLANT.count({'deprecated': True}), # sure....
        "total_active_systems": Table.SYSTEM.count({'deprecated': False}),
        "total_cost": 0,
        "total_active_cost": 0
    }

    logger.info("Successfully generated statistical data.")
    return jsonify(stats)