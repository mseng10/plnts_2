"""
This is the main module of the application.
"""

import logging
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL
from sqlalchemy import func

from models.plant import Plant, Genus, Type, Base
from models.system import System, Light
from models.alert import PlantAlert, Todo
from models.mix import Mix, Soil, mix_soil_association

from db import init_db
from db import Session

from logger import setup_logger
import logging

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)

init_db()

# Create Flask app
app = Flask(__name__)

from routes.system_routes import bp as system_bp
from routes.plant_routes import bp as plant_bp
from routes.todo_routes import bp as todo_bp
from routes.mix_routes import bp as mix_bp
from routes.stat_routes import bp as stat_bp
from routes.installable_model_routes import types_bp, genuses_bp, soils_bp

app.register_blueprint(system_bp)
app.register_blueprint(plant_bp)
app.register_blueprint(todo_bp)
app.register_blueprint(mix_bp)
app.register_blueprint(stat_bp)

app.register_blueprint(types_bp)
app.register_blueprint(genuses_bp)
app.register_blueprint(soils_bp)


CORS(app)

def create_light_from_json(light):
    """
    Utiltity method to create multiple lights
    """
    return Light(
        name=light["name"],
        cost=light["cost"],
        system_id=light["system_id"]
    )

@app.route("/light", methods=["GET"])
def get_light():
    """
    Retrieve all lights from the database.
    """
    logger.info("Received request to retrieve all lights")

    db = Session()
    lights = db.query(Light).all()
    db.close()
    return jsonify([light.to_json() for light in lights])

@app.route("/light", methods=["POST"])
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

@app.route("/meta", methods=["GET"])
def get_meta():
    """
    Get meta data of the application.
    """
    logger.info("Received request to query the meta")
    db = Session()
    meta = {
        "alert_count" : db.query(PlantAlert).filter(PlantAlert.resolved == False).count(),
        "todo_count" : db.query(Todo).filter(Todo.resolved == False).count()
    }
    db.close()

    logger.info("Successfully generated meta data.")
    return jsonify(meta)

if __name__ == "__main__":

    # Run the Flask app
    app.run(debug=True)
