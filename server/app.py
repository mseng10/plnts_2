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
from models.plant import Plant, Genus, Type, Base
from models.system import System, Light
from models.alert import PlantAlert, Todo

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
def create_plant():
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
        system_id=new_plant_data["system_id"],
        watering=new_plant_data["watering"]
    )
    # Add the new plant object to the session
    session = Session()
    session.add(new_plant)
    session.commit()
    session.close()
    # Return response
    return jsonify({"message": "Plant added successfully"}), 201

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

@app.route("/plants/kill", methods=["POST"])
def kill_plants():
    """
    Kill the specified plants.
    """
    logger.info("Received request to kill the specified plants")

    kill_ids = [int(id) for id in request.get_json()["ids"]]
    cause = request.get_json()["cause"]

    session = Session()
    plants = session.query(Plant).filter(Plant.id.in_(watering_ids)).all()
    now = datetime.now()
    for plant in plants:
        plant.dead = True
        plant.dead_on = datetime.now()
        plant.dead_cause = cause
    
    session.commit()
    session.close()

    return jsonify({"message": f"{len(plants)} Plants killed successfully:("}), 201


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

@app.route("/alert", methods=["GET"])
def get_alerts():
    """
    Retrieve all Plant alerts from the database.
    """
    logger.info("Received request to retrieve all plant alerts")

    db = Session()
    plnt_alerts = db.query(PlantAlert).all()
    db.close()
    # Transform plant alerts to JSON format
    plnt_alerts_json = [plnt_alert.to_json() for plnt_alert in plnt_alerts]
    # Return JSON response
    return jsonify(plnt_alerts_json)

@app.route("/todo", methods=["GET"])
def get_todo():
    """
    Retrieve all todos from the database.
    """
    logger.info("Received request to retrieve all todos")

    db = Session()
    todos = db.query(Todo).all()
    db.close()
    # Transform plant alerts to JSON format
    todos_json = [todo.to_json() for todo in todos if todo.resolved is False]
    # Return JSON response
    return jsonify(todos_json)

@app.route("/todo", methods=["POST"])
def create_todo():
    """
    Create a new TODO and add it to the database.
    """
    logger.info("Attempting to create TODO")

    new_todo_data = request.get_json()

    # Create a new Todo object
    new_todo = Todo(
        description=new_todo_data["description"],
        name=new_todo_data["name"]
    )

    # Add the new TODO object to the session
    db = Session()
    db.add(new_todo)
    db.commit()
    db.close()

    return jsonify({"message": "TODO added successfully"}), 201

@app.route("/alert/check", methods=["GET"])
def alert_check():
    """
    Retrieve all alerts from the database.
    TODO: Comvert to runnable background processor
    """
    logger.info("Received request to run all alert scans")

    session = Session()
    existing_plant_alrts = session.query(PlantAlert).all()
    existing_plant_alrts_map = {}
    for existing_plant_alert in existing_plant_alrts:
        existing_plant_alrts_map[existing_plant_alert.id] = existing_plant_alert

    existing_plants = session.query(Plant).all()
    for plant in existing_plants:
        end_date = plant.watered_on + datetime.timedelta(days=plant.watering)
        if end_date < datetime.now() and existing_plant_alrts_map.get(plant.id) is None:
            new_plant_alert = PlantAlert(
                plant_id = plant.id,
                system_id = plant.system_id
            )
            # Create the alert in the db
            session.add(new_plant_alert)
            # Save it to return to the server
            existing_plant_alrts.appned(new_plant_alert)

    session.commit()
    session.close()

    alerts_json = [existing_plant_alrt.to_json() for existing_plant_alrt in existing_plant_alrts]

    # Return JSON response
    return jsonify(alerts_json)

@app.route("/todo/<int:todo_id>/resolve", methods=["POST"])
def todo_resolve(todo_id):
    """
    Resolves the todo.
    """
    # Log the request
    logger.info("Received request to resolve todo")
    session = Session()

    todo = session.query(Todo).get(todo_id)
    todo.resolved = True
    todo.resolved_on = datetime.now()

    session.flush()
    session.commit()

    # Return JSON response
    return jsonify(todo.to_json())

@app.route("/alert/plant/<int:alert_id>/resolve", methods=["POST"])
def plant_alert_resolve(alert_id):
    """
    Resolves the plant alert.
    """
    # Log the request
    logger.info("Received request to resolve plant alert")
    session = Session()

    alert = session.query(PlantAlert).get(alert_id)
    alert.resolved = True
    alert.resolved_on = datetime.now()

    session.flush()
    session.commit()

    # Return JSON response
    return jsonify(alert.to_json())

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
