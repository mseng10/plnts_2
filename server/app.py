from colorama import init, Fore
from flask import Flask, request, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL
import json

# Initialize Colorama
init(autoreset=True)

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

# Example route to add a new plant
@app.route("/plants", methods=["POST"])
def add_plant():
    # Get JSON data from request
    new_plant = request.get_json()
    # Perform database operations here
    # Example: Add new plant to the database
    # session = Session()
    # session.add(new_plant)
    # session.commit()
    # session.close()
    # Return response
    return jsonify(new_plant), 201

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
