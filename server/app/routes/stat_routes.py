from flask import Blueprint, jsonify
from shared.db import Table
from shared.logger import logger

bp = Blueprint("stats", __name__, url_prefix="/stats")


@bp.route("/", methods=["GET"])
def stats():
    """Return stats for everything."""
    logger.info("Received request to query the stats")

    stats = {
        "total_plants": Table.PLANT.count({}),
        "total_active_plants": Table.PLANT.count({"banished": False}),
        "total_banished_plants": Table.PLANT.count({"banished": True}),
        "total_active_systems": Table.SYSTEM.count({"banished": False}),
        "total_cost": 0,
        "total_active_cost": 0,
    }

    logger.info("Successfully generated statistical data.")
    return jsonify(stats)
