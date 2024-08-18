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
CORS(app)

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
        watering=new_plant_data["watering"],
        phase = new_plant_data["phase"],
        mix_id = new_genus_data["mix_id"]
    )
    # Add the new plant object to the session
    db = Session()
    db.add(new_plant)
    db.commit()
    db.close()
    # Return response
    return jsonify({"message": "Plant added successfully"}), 201

@app.route("/plants", methods=["GET"])
def get_plants():
    """
    Retrieve all plants from the database.
    """
    # Log the request
    logger.info("Received request to retrieve all plants")
    db = Session()
    plants = db.query(Plant).all()
    db.close()
    # Transform plants to JSON format
    plants_json = [plant.to_json() for plant in plants]
    # Return JSON response
    return jsonify(plants_json)

@app.route("/plants/<int:plant_id>", methods=["PATCH"])
def get_plant(plant_id):
    """
    Query the specific plant.
    """
    # Log the request
    logger.info("Received request to query the plant")
    db = Session()
    plant = db.query(Plant).get(plant_id)
    session.close()

    # Return JSON response
    return jsonify(plant.to_json())

@app.route("/plants/<int:plant_id>", methods=["PATCH"])
def update_plant(plant_id):
    """
    Query the specific plant.
    """
    # Log the request
    logger.info("Received request to query the plant")

    changes = request.get_json()

    db = Session()
    plant = db.query(Plant).get(plant_id)

    plant.cost = changes["cost"]
    plant.size = change["size"]
    plant.genus_id = change["genus_id"]
    plant.type_id=change["type_id"],
    plant.system_id=change["system_id"],
    plant.watering=change["watering"],
    plant.phase = change["phase"]
    plant.updated_on = datetime.now

    db.flush()
    db.commit()

    # Return JSON response
    return jsonify(plant.to_json())

@app.route("/todo/<int:todo_id>", methods=["PATCH"])
def update_todo(todo_id):
    """
    Query the specific todo.
    """
    # Log the request
    logger.info(f"Received request to patch todo {todo_id}")

    changes = request.get_json()

    db = Session()
    todo = db.query(Todo).get(todo_id)

    todo.name = changes["name"]
    todo.description = changes["description"]
    todo.due_on = changes["due_on"]

    db.flush()
    db.commit()

    # Return JSON response
    return jsonify(todo.to_json())

@app.route("/todo/<int:todo_id>", methods=["GET"])
def get_todo(todo_id):
    """
    Query the specific todo.
    """
    # Log the request
    logger.info("Received request to query the todo")
    db = Session()
    todo = db.query(Todo).get(todo_id)
    db.close()

    # Return JSON response
    return jsonify(todo.to_json())

@app.route("/plants/water", methods=["POST"])
def water_plants():
    """
    Water the specified plants.
    """
    logger.info("Received request to water the specified plants")
    watering_ids = [int(id) for id in request.get_json()["ids"]]
    db = Session()
    plants = db.query(Plant).filter(Plant.id.in_(watering_ids)).all()
    now = datetime.now()
    for plant in plants:
        plant.watered_on = now
        plant.updated_on = now
    db.commit()
    db.close()

    return jsonify({"message": f"{len(plants)} Plants watered successfully"}), 201

@app.route("/plants/deprecate", methods=["POST"])
def deprecate_plants():
    """
    Deprecate the specified plants.
    """
    logger.info("Received request to deprecate the specified plants")

    deprecate_ids = [int(id) for id in request.get_json()["ids"]]
    cause = request.get_json()["cause"]

    db = Session()
    plants = db.query(Plant).filter(Plant.id.in_(watering_ids)).all()
    now = datetime.now()
    for plant in plants:
        plant.deprecated = True
        plant.deprecated_on = datetime.now()
        plant.deprecated_cause = cause
    
    db.commit()
    db.close()

    return jsonify({"message": f"{len(plants)} Plants deprecated successfully:("}), 201

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
        count = potentially_new_light["count"] if potentially_new_light["count"] else 1
        logger.info(f"Attempting to create {count} embedded lights from system request")
        
        potentially_new_light["system_id"] = new_system.id
        new_lights = [create_light_from_json(potentially_new_light) for i in range(count)]
        db.add_all(new_lights)
        db.commit()

    db.close()

    return jsonify({"message": "System added successfully"}), 201

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

@app.route("/todo", methods=["GET"])
def get_todos():
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
        name=new_todo_data["name"],
        due_on=new_todo_data["due_on"]
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

@app.route("/todo/<int:todo_id>/resolve", methods=["POST"])
def todo_resolve(todo_id):
    """
    Resolves the todo.
    """
    # Log the request
    logger.info("Received request to resolve todo")
    db = Session()

    todo = db.query(Todo).get(todo_id)
    todo.resolved = True
    todo.resolved_on = datetime.now()

    db.flush()
    db.commit()

    # Return JSON response
    return jsonify(todo.to_json())

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

@app.route("/system/<int:system_id>/plants", methods=["GET"])
def get_systems_plants(system_id):
    """
    Get system's plants.
    """
    # Log the request
    logger.info("Received request to get a system's plants")
    
    db = Session()
    plants = db.query(Plant).filter(Plant.system_id == system_id).all()
    db.close()

    # Transform plant alerts to JSON format
    plants_json = [plant.to_json() for plant in plants]

    # Return JSON response
    return jsonify(plants_json)

@app.route("/system/<int:system_id>/plants", methods=["GET"])
def get_systems_alerts(system_id):
    """
    Get system's alerts.
    """
    # Log the request
    logger.info("Received request to get a system's alerts")
    
    db = Session()
    plant_alerts = db.query(PlantAlert).filter(Plant.system_id == system_id).all()
    db.close()

    # Transform plant alerts to JSON format
    plant_alerts_json = [plant_alert.to_json() for plant_alert in plant_alerts]

    # Return JSON response
    return jsonify(plant_alerts_json)

@app.route("/system/<int:system_id>", methods=["PATCH"])
def update_system(system_id):
    """
    Query the specific system.
    """
    # Log the request
    logger.info(f"Received request to patch system {system_id}")

    changes = request.get_json()

    db = Session()
    system = db.query(System).get(system_id)

    system.name=changes["name"],
    system.temperature=changes["temperature"],
    system.humidity=changes["humidity"],
    system.duration=changes["duration"],
    system.distance=changes["distance"],
    system.description=changes["description"]

    db.flush()
    db.commit()

    # Return JSON response
    return jsonify(system.to_json())

@app.route("/system/<int:system_id>", methods=["GET"])
def get_system(system_id):
    """
    Query the specific system.
    """
    # Log the request
    logger.info("Received request to query the system")
    db = Session()
    system = db.query(System).get(system_id)
    db.close()

    # Return JSON response
    return jsonify(system.to_json())

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

    # Return JSON response
    return jsonify(meta)

@app.route("/system/<int:system_id>/deprecate", methods=["POST"])
def system_deprecate(system_id):
    """
    Deprecate the specified system.
    """
    logger.info("Received request to deprecate the specified plants")
    db = Session()

    system = db.query(System).get(system_id)

    system.deprecated = True
    system.deprecated_on = datetime.now()
    system.deprecated_cause = "User Deletion"
    
    db.commit()
    db.close()

    return jsonify({"message": f"{len(systems)} Systems deprecated successfully:("}), 201

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

@app.route("/mix", methods=["GET"])
def get_mixes():
    """
    Retrieve all mixes from the database.
    """
    logger.info("Received request to retrieve all mixes")

    db = Session()
    mixes = db.query(Mix).all()
    db.close()

    mixes_json = [mix.to_json() for mix in mixes]
    
    logger.info("Succesfully queried all mixes")
    return jsonify(mixes_json)

@app.route("/mix", methods=["POST"])
def create_mix():
    """
    Create a new mix and add it to the database.
    """
    logger.info("Attempting to create mix")

    db = Session()

    new_mix_json = request.get_json()
    
    # Create the mix
    new_mix = Mix(
        name=new_mix_json["name"],
        description=new_mix_json["description"],
        experimental=new_mix_json["experimental"]
    )
    db.add(new_mix)
    db.flush()

    # Create the mix-soil join tables
    for soil_id, parts in new_mix_json["soils"].items():
        soil = db.query(Soil).get(int(soil_id))
        if soil:
            association = mix_soil_association.insert().values(
                mix_id=new_mix.id,
                soil_id=soil.id,
                parts=int(parts)
            )
            db.execute(association)
    db.commit()
    db.close()

    return jsonify({"message": "Mix added successfully"}), 201

@app.route("/mix/<int:mix_id>/deprecate", methods=["POST"])
def deprecate_mix(mix_id):
    """
    Deprecate the specified system.
    """
    logger.info("Received request to deprecate the specified mix")

    db = Session()

    mix = db.query(Mix).get(mix_id)
    mix.deprecated = True
    mix.deprecated_on = datetime.now()
    # mix.deprecated_cause = ""
    
    db.commit()
    db.close()

    return jsonify({"message": f"Mix deprecated:("}), 201

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
