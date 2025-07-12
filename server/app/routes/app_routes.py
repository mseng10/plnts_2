from flask import Blueprint, jsonify
from shared.db import Table
from shared.logger import logger

# Standard Blueprint
bp = Blueprint("app", __name__, url_prefix="/health")

@bp.route("/", methods=["GET"])
def health():
    """
    Return health for app.
    """
    logger.info("Received request to check the health endpoint")
    return jsonify({"status": "healthy"})

