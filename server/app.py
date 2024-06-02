"""
This is the main module of the application.
"""

# Standard library imports
import json
import logging

# Third-party imports
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

# Local application imports
from models.plant import Plant, Genus, Base
from models.system import System

# Load database configuration from JSON file
with open("db.json", encoding="utf-8") as json_data_file:
    db_config = json.load(json_data_file)

# Create SQLAlchemy engine
url = URL.create(
    drivername=db_config["drivername"],
    username=db_config["username"],
    password=db_config["password"],
    host=db_config["host"],
    database=db_config["database"],
    port=db_config["port"],
)
engine = create_engine(url)
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)

# Create Flask app
app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route("/plants", methods=["POST"])
def add_plant():
    """
    Add a new plant to the database.
    """
    logger.info("Attempting to create plant")
    # Get JSON data from request
    new_plant_data = request.get_json()
    # Create a new Plant object
    new_plant = Plant(
        cost=new_plant_data["cost"],
        size=new_plant_data["size"],
        genus_id=new_plant_data["genus_id"],
        system_id=new_plant_data["system_id"],
        name=new_plant_data["name"]
    )
    # Add the new plant object to the session
    session = Session()
    session.add(new_plant)
    session.commit()
    session.close()
    # Return response
    return jsonify({"message": "Plant added successfully"}), 201


# Example route to get all plants
@app.route("/plants", methods=["GET"])
def get_plants():
    """
    Retrieve all plants from the database.
    """
    # Log the request
    logger.info("Received request to retrieve all plants")
    session = Session()
    plants = session.query(Plant).all()
    session.close()
    # Transform plants to JSON format
    plants_json = [plant.to_json() for plant in plants]
    # Return JSON response
    return jsonify(plants_json)


@app.route("/genus", methods=["GET"])
def get_genuses():
    """
    Retrieve all genuses from the database.
    """
    logger.info("Received request to retrieve all plant genuses")

    session = Session()
    genuses = session.query(Genus).all()
    session.close()
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
    new_genus = Genus(
        name=new_genus_data["name"], watering=new_genus_data["watering"]
    )

    # Add the new genus object to the session
    db = Session()
    db.add(new_genus)
    db.commit()
    db.close()

    return jsonify({"message": "Genus added successfully"}), 201


@app.route("/system", methods=["GET"])
def get_systems():
    """
    Retrieve all systems from the database.
    """
    logger.info("Received request to retrieve all systems")

    session = Session()
    systems = session.query(System).all()
    session.close()
    # Transform systems to JSON format
    systems_json = [system.to_json() for system in systems]
    # Return JSON response
    return jsonify(systems_json)

@app.route("/system", methods=["POST"])
def create_system():
    """
    Create a new system and add it to the database.
    """
    logger.info("Attempting to create system")

    new_system_json = request.get_json()

    # Create a new System object
    new_system = System(
        name=new_system_json["name"], 
        temperature=new_system_json["temperature"],
        humidity=new_system_json["humidity"]
    )

    # Add the new system object to the session
    db = Session()
    db.add(new_system)
    db.commit()
    db.close()

    return jsonify({"message": "System added successfully"}), 201

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
