from flask import Blueprint, jsonify, request
from shared.db import Session
from shared.logger import logger

from models.system import System, Light
from routes import GenericCRUD, APIBuilder

system_bp = Blueprint('systems', __name__)
system_crud = GenericCRUD(System, System.schema)
APIBuilder.register_resource(system_bp, 'systems', system_crud)

@APIBuilder.register_custom_route(system_bp, '<int:system_id>/plants/', ['GET'])
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

@APIBuilder.register_custom_route(system_bp, "<int:system_id>/alerts/", ["GET"])
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

@APIBuilder.register_custom_route(system_bp, "<int:system_id/video_feed/", ["GET"])
def get_video_feed(system_id):
    session = Session()
    system = session.query(System).get(system_id)
    session.close()
    
    if not system:
        return "Invalid adaptor ID", 400
    
    if system.url == 'local':
        return Response(generate_frames(),
                        mimetype='multipart/x-mixed-replace; boundary=frame')
    
    # Essentially a proxy
    def generate():
        resp = requests.get(f"{system.url}/video_feed", stream=True)
        for chunk in resp.iter_content(chunk_size=1024):
            yield chunk

    return Response(generate(), 
                    mimetype='multipart/x-mixed-replace; boundary=frame') 

@APIBuilder.register_custom_route(system_bp, "<int:system_id/sensor_data/", ["GET"])
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

# TODO: Fix when I have more strength
# # Potentially create lights that were created alongside the system
# potentially_new_light = new_system_json["light"]
# if potentially_new_light is not None:
#     count = potentially_new_light["count"] if potentially_new_light["count"] else 1
#     logger.info(f"Attempting to create {count} embedded lights from system request")
    
#     potentially_new_light["system_id"] = new_system.id
#     new_lights = [create_light_from_json(potentially_new_light) for i in range(count)]
#     db.add_all(new_lights)
#     db.commit()

# db.close()

# def create_light_from_json(light):
#     """
#     Utiltity method to create multiple lights
#     """
#     return Light(
#         name=light["name"],
#         cost=light["cost"],
#         system_id=light["system_id"]
#     )
