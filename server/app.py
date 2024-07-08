"""
This is the main module of the application.
"""

# Standard library imports
import json
import logging
from datetime import datetime

# Third-party imports
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

# Local application imports
from models.plant import Plant, Genus, Type
from models.system import System, Light

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

# Base.metadata.drop_all(engine)
# Base.metadata.create_all(engine)

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
        type_id=new_plant_data["type_id"],
        system_id=new_plant_data["system_id"]
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

@app.route("/plants/water", methods=["POST"])
def water_plants():
    """
    Water the specified plants.
    """
    logger.info("Received request to water the specified plants")
    watering_ids = [int(id) for id in request.get_json()["ids"]]
    session = Session()
    plants = session.query(Plant).filter(Plant.id.in_(watering_ids)).all()
    now = datetime.now()
    for plant in plants:
        plant.watered_on = now
        plant.updated_on = now
    session.commit()
    session.close()

    return jsonify({"message": f"{len(plants)} Plants watered successfully"}), 201

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

    session = Session()
    types = session.query(Type).all()
    session.close()
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

@app.route("/system", methods=["GET"])
def get_systems():
    """
    Retrieve all systems from the database.
    """
    logger.info("Received request to retrieve all systems")

    db = Session()
    systems = db.query(System).all()
    db.close()
    # Transform systems to JSON format
    systems_json = [system.to_json() for system in systems]
    # Return JSON response
    return jsonify(systems_json)

def create_light_from_json(light):
    """
    Utiltity method to create multiple lights
    """
    return Light(
        name=light["name"],
        cost=light["cost"],
        system_id=light["system_id"]
    )



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
        humidity=new_system_json["humidity"],
        duration=new_system_json["duration"],
        distance=new_system_json["distance"],
        description=new_system_json["description"]
    )

    # Add the new system object to the session
    db = Session()
    db.add(new_system)
    db.commit()

    # Potentially create lights that were created alongside the system
    potentially_new_light = new_system_json["light"]
    if potentially_new_light is not None:
        logger.info("Attempting to create embedded lights from system request")
        potentially_new_light["system_id"] = new_system.id
        count = potentially_new_light["count"] if potentially_new_light["count"] else 1
        new_lights = [create_light_from_json(potentially_new_light) for i in range(count)]
        db.add(new_lights)
        db.commit()

    db.close()

    return jsonify({"message": "System added successfully"}), 201

@app.route("/light", methods=["GET"])
def get_light():
    """
    Retrieve all lights from the database.
    """
    logger.info("Received request to retrieve all lights")

    session = Session()
    lights = session.query(Light).all()
    session.close()
    # Transform lights to JSON format
    lights_json = [light.to_json() for light in lights]
    # Return JSON response
    return jsonify(lights_json)

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

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
