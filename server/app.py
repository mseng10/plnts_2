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

app.register_blueprint(system_bp)
app.register_blueprint(plant_bp)
app.register_blueprint(todo_bp)
app.register_blueprint(mix_bp)
app.register_blueprint(stat_bp)

CORS(app)

@app.route("/genus", methods=["GET"])
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

@app.route("/genus", methods=["POST"])
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

@app.route("/type", methods=["GET"])
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

@app.route("/type", methods=["POST"])
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

@app.route("/alert", methods=["GET"])
def get_alerts():
    """
    Retrieve all Plant alerts from the database.
    """
    logger.info("Received request to retrieve all plant alerts")

    db = Session()
    plnt_alerts = db.query(PlantAlert).all()
    db.close()
    return jsonify([plnt_alert.to_json() for plnt_alert in plnt_alerts])

@app.route("/alert/check", methods=["GET"])
def alert_check():
    """
    Get system's alerts.
    """
    # Log the request
    logger.info("Received request to get a system's alerts")
    
    db = Session()
    plant_alerts = db.query(PlantAlert).all()
    db.close()

    # Transform plant alerts to JSON format
    plant_alerts_json = [plant_alert.to_json() for plant_alert in plant_alerts]

    # Return JSON response
    return jsonify(plant_alerts_json)

@app.route("/alert/plant/<int:alert_id>/resolve", methods=["POST"])
def plant_alert_resolve(alert_id):
    """
    Resolves the plant alert.
    """
    # Log the request
    logger.info("Received request to resolve plant alert")
    db = Session()

    alert = db.query(PlantAlert).get(alert_id)
    alert.resolved = True
    alert.resolved_on = datetime.now()

    db.flush()
    db.commit()

    # Return JSON response
    return jsonify(alert.to_json())

@app.route("/soil", methods=["GET"])
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
