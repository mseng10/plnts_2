from flask import Blueprint, jsonify
from shared.db import Session
from shared.logger import logger

from models.plant import Plant
from models.alert import PlantAlert
from models.system import System, Light
from routes import GenericCRUD, APIBuilder

system_bp = Blueprint('systems', __name__)
system_crud = GenericCRUD(System, System.schema)
APIBuilder.register_resource(system_bp, 'systems', system_crud)

@APIBuilder.register_custom_route(system_bp, '/systems/<int:system_id>/plants/', ['GET'])
def get_systems_plants(system_id):
    """
    Get system's plants.
    """
    logger.info("Received request to get a system's plants")
    
    db = Session()
    plants = db.query(Plant).filter(Plant.system_id == system_id).all()
    db.close()

    return jsonify([Plant.schema.serialize(plant) for plant in plants])

@APIBuilder.register_custom_route(system_bp, "/systems/<int:system_id>/alerts/", ["GET"])
def get_systems_alerts(system_id):
    """
    Get system's alerts.
    """
    logger.info("Received request to get a system's alerts")
    
    db = Session()
    plant_alerts = db.query(PlantAlert).filter(PlantAlert.system_id == system_id).all()
    db.close()

    return jsonify([PlantAlert.schema.serialize(plant_alert) for plant_alert in plant_alerts])

@APIBuilder.register_custom_route(system_bp, "/systems/<int:system_id>/video_feed/", ["GET"])
def get_video_feed(system_id):
    session = Session()
    system = session.query(System).get(system_id)
    session.close()
    
    if not system:
        return "Invalid system ID", 400
    
    if system.container_id == 'local':
        return Response(generate_frames(),
                        mimetype='multipart/x-mixed-replace; boundary=frame')
    
    # Essentially a proxy
    def generate():
        resp = requests.get(f"{system.url}/video_feed", stream=True)
        for chunk in resp.iter_content(chunk_size=1024):
            yield chunk

    return Response(generate(), 
                    mimetype='multipart/x-mixed-replace; boundary=frame') 

@APIBuilder.register_custom_route(system_bp, "/systems/<int:system_id>/sensor_data/", ["GET"])
def get_sensor_data(system_id):
    session = Session()
    system = session.query(System).get(system_id)
    
    if not system:
        session.close()
        return "Invalid camera ID", 400
    
    try:
        if system.url == 'local':
            data = read_sensor()
        else:
            resp = requests.get(f"{system.url}/sensor_data")
            data = resp.json()
        
        system.last_temperature = data['temperature']
        system.last_humidity = data['humidity']
        system.updated_on = datetime.utcnow()
        
        session.commit()
        session.close()
        
        return jsonify(data)
    except Exception as e:
        session.close()
        return jsonify({"error": str(e)}), 500

light_bp = Blueprint('lights', __name__)
light_crud = GenericCRUD(Light, Light.schema)
APIBuilder.register_resource(light_bp, 'lights', light_crud, ["GET", "GET_MANY", "POST"])
