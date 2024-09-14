"""
Running webserver.
"""

import logging
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

from models import Base
from models.plant import Plant, PlantGenus, PlantGenusType, PlantSpecies
from models.system import System, Light
from models.alert import PlantAlert
from models.todo import Todo
from models.mix import Mix, Soil, SoilPart

from db import init_db
from db import Session

from logger import setup_logger
import logging

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)

# Initialize DB connection
init_db()

# Create Flask app
app = Flask(__name__)

from routes.system_routes import system_bp, light_bp
from routes.plant_routes import bp as plant_bp
from routes.todo_routes import bp as todo_bp
from routes.mix_routes import bp as mix_bp
from routes.stat_routes import bp as stat_bp
from routes.installable_model_routes import genus_types_bp, species_bp, soils_bp, genus_bp
from routes.alert_routes import bp as alert_bp
# from routes.hardware_routes import camera_bp, sensore_data_bp, live_bp

# Models
app.register_blueprint(system_bp)
app.register_blueprint(light_bp)
app.register_blueprint(plant_bp)
app.register_blueprint(todo_bp)
app.register_blueprint(mix_bp)
app.register_blueprint(stat_bp)
app.register_blueprint(alert_bp)

# Hardware Routes
# app.register_blueprint(camera_bp)
# app.register_blueprint(sensore_data_bp)
# app.register_blueprint(live_bp)

# Installables
app.register_blueprint(genus_types_bp)
app.register_blueprint(genus_bp)
app.register_blueprint(species_bp)
app.register_blueprint(soils_bp)

CORS(app)

ENVIRONMENT = os.getenv('ENVIRONMENT', 'docker')
USE_LOCAL_CAMERA = os.getenv('USE_LOCAL_CAMERA', 'false').lower() == 'true'

def discover_systems():
    session = Session()
    
    if USE_LOCAL_CAMERA:
        local_camera = session.query(System).filter_by(name='Local Camera').first()
        if not local_camera:
            local_camera = Camera(name='Local Camera', url='local', container_id='local')
            session.add(local_camera)
    # We'll get there...
    # if ENVIRONMENT == 'kubernetes':
    #     from kubernetes import client, config
    #     config.load_incluster_config()
    #     v1 = client.CoreV1Api()
    #     pods = v1.list_pod_for_all_namespaces(label_selector="app=pi-camera").items
        
    #     for pod in pods:
    #         pi_id = pod.spec.node_name
    #         pod_ip = pod.status.pod_ip
    #         url = f"http://{pod_ip}:5000"
            
    #         camera = session.query(Camera).filter_by(name=f"Pi Camera {pi_id}").first()
    #         if not camera:
    #             camera = Camera(name=f"Pi Camera {pi_id}", url=url, container_id=pod.metadata.uid)
    #             session.add(camera)
    #         else:
    #             camera.url = url
    #             camera.container_id = pod.metadata.uid
    
    elif ENVIRONMENT == 'docker':
        import docker
        client = docker.from_env()
        
        for container in client.containers.list():
            if container.name.startswith('pi-camera-'):
                pi_id = container.name.split('-')[-1]
                ip = container.attrs['NetworkSettings']['Networks']['multi-camera_default']['IPAddress']
                url = f"http://{ip}:5000"
                
                camera = session.query(Camera).filter_by(container_id=container.id).first()
                if not camera:
                    camera = Camera(name=f"Pi Camera {pi_id}", url=url, container_id=container.id)
                    session.add(camera)
                else:
                    camera.url = url
    
    session.commit()
    cameras = session.query(Camera).all()
    session.close()
    return cameras


@app.route("/meta/", methods=["GET"])
def get_meta():
    """
    Get meta data of the application.
    """
    logger.info("Received request to query the meta")
    db = Session()
    meta = {
        "alert_count" : db.query(PlantAlert).filter(PlantAlert.deprecated == False).count(),
        "todo_count" : db.query(Todo).filter(Todo.deprecated == False).count()
    }
    db.close()

    logger.info("Successfully generated meta data.")
    return jsonify(meta)

if __name__ == "__main__":

    # Run the Flask app
    app.run(debug=True)
