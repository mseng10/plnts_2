# from colorama import init, Fore
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL
import json
import logging
from models.plant import Plant, Base  # Importing the Plant model

# Initialize Colorama
# init(autoreset=True)

# Load database configuration from JSON file
with open("db.json") as json_data_file:
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
#TODO: Temp, remove when all is working
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
    # Get JSON data from request
    new_plant_data = request.get_json()
    # Create a new Plant object
    new_plant = Plant(
        cost=new_plant_data["cost"],
        size=new_plant_data["size"],
        watering=new_plant_data["watering"],
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
    # Log the request
    logger.info("Received request to retrieve all plants")
    session = Session()
    plants = session.query(Plant).all()
    session.close()
    # Transform plants to JSON format
    plants_json = [{"id": plant.id, "cost": plant.cost, "size": plant.size, "watering": plant.watering} for plant in plants]
    # Return JSON response
    return jsonify(plants_json)

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
