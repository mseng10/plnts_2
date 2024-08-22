from flask import Blueprint, jsonify, request
from db import Session
from logger import setup_logger
import logging

from models.alert import PlantAlert, Alert

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)
bp = Blueprint('alerts', __name__, url_prefix='/alerts')

@bp.route("/", methods=["GET"])
def get_alerts():
    """
    Retrieve all Plant alerts from the database.
    """
    logger.info("Received request to retrieve all plant alerts")

    db = Session()
    alerts = db.query(Alert).all()
    db.close()
    return jsonify([alert.to_json() for alert in alerts])

@bp.route("/check", methods=["GET"])
def alert_check():
    """
    Get system's alerts.
    """
    # Log the request
    logger.info("Received request to get a system's alerts")
    
    db = Session()
    alerts = db.query(Alert).all()
    db.close()

    alerts_json = [alert.to_json() for alert in alerts]
    return jsonify(alerts_json)

@bp.route("/<int:alert_id>/deprecate", methods=["POST"])
def alert_deprecate(alert_id):
    """
    Deprecates the alert.
    """
    # Log the request
    logger.info("Received request to deprecate plant alert")
    db = Session()

    alert = db.query(Alert).get(alert_id)
    alert.deprecated = True
    alert.deprecate_on = datetime.now()

    db.flush()
    db.commit()

    return jsonify(alert.to_json())