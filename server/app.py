"""
Running webserver.
"""

import logging
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

from models import Base
from models.plant import Plant, PlantGenus, PlantGenusType, PlantSpecies
from models.system import System, Light
from models.alert import PlantAlert
from models.todo import Todo
from models.mix import Mix, Soil, SoilPart

from db import init_db
from db import Session

from logger import setup_logger
import logging

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)

# Initialize DB connection
init_db()

# Create Flask app
app = Flask(__name__)

from routes.system_routes import system_bp, light_bp
from routes.plant_routes import bp as plant_bp
from routes.todo_routes import bp as todo_bp
from routes.todo_routes import tasks_bp
from routes.mix_routes import bp as mix_bp
from routes.stat_routes import bp as stat_bp
from routes.installable_model_routes import genus_types_bp, species_bp, soils_bp, genus_bp
from routes.alert_routes import bp as alert_bp
# from routes.hardware_routes import camera_bp, sensore_data_bp, live_bp

# Models
app.register_blueprint(system_bp)
app.register_blueprint(light_bp)
app.register_blueprint(plant_bp)
app.register_blueprint(todo_bp)
app.register_blueprint(tasks_bp)
app.register_blueprint(mix_bp)
app.register_blueprint(stat_bp)
app.register_blueprint(alert_bp)

# Hardware Routes
# app.register_blueprint(camera_bp)
# app.register_blueprint(sensore_data_bp)
# app.register_blueprint(live_bp)

# Installables
app.register_blueprint(genus_types_bp)
app.register_blueprint(genus_bp)
app.register_blueprint(species_bp)
app.register_blueprint(soils_bp)

CORS(app)

@app.route("/meta/", methods=["GET"])
def get_meta():
    """
    Get meta data of the application.
    """
    logger.info("Received request to query the meta")
    db = Session()
    meta = {
        "alert_count" : db.query(PlantAlert).filter(PlantAlert.deprecated == False).count(),
        "todo_count" : db.query(Todo).filter(Todo.deprecated == False).count()
    }
    db.close()

    logger.info("Successfully generated meta data.")
    return jsonify(meta)

if __name__ == "__main__":

    # Run the Flask app
    app.run(debug=True)
