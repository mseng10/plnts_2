from colorama import init, Fore
from flask import Flask, request, abort
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL
import json

with open("db.json") as json_data_file:
    db_config = json.load(json_data_file)

url = URL.create(
    drivername=db_config["drivername"],
    username=db_config["username"],
    password=db_config["password"],
    host=db_config["host"],
    database=db_config["database"],
    port=db_config["port"],
)

engine = create_engine(url)
connection = engine.connect()
Session = sessionmaker(bind=engine)

init(autoreset=True)
app = Flask(__name__)

@app.route("/plants", methods=["POST"])
def add_plant():
    new_plant = request.get_json()
    new_plant["id"] = len(plants) + 1
    plants.append(new_plant)
    return jsonify(new_plant), 201

from cli import create, stats, update, water, archive
