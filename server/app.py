# from colorama import init, Fore
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL
import json
import logging

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
    new_plant = request.get_json()
    # Log the request
    logger.info("Received request to add a new plant: %s", new_plant)
    # Perform database operations here
    # Example: Add new plant to the database
    # session = Session()
    # session.add(new_plant)
    # session.commit()
    # session.close()
    # Return response
    return jsonify(new_plant), 201

# Example route to get all plants
@app.route("/plants", methods=["GET"])
def get_plants():
    # Log the request
    logger.info("Received request to retrieve all plants")
    print("HELLO")
    # Perform database query to retrieve all plants
    # Example: Query all plants from the database
    # session = Session()
    # plants = session.query(Plant).all()
    # session.close()
    # Transform plants to JSON format
    # Example: Convert plants to JSON format
    # plants_json = [plant.to_json() for plant in plants]
    # Return JSON response
    return jsonify([{"gangser": "asdfasdf"}])  # Placeholder response

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
