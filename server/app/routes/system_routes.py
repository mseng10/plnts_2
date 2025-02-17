from flask import Blueprint, jsonify
from shared.logger import logger

from shared.db import Table
from bson import ObjectId

from routes import GenericCRUD, APIBuilder, Schema

system_bp = Blueprint("systems", __name__)
system_crud = GenericCRUD(Table.SYSTEM, Schema.SYSTEM)
APIBuilder.register_blueprint(
    system_bp, "systems", system_crud, ["GET", "GET_MANY", "POST", "PATCH", "BANISH"]
)


@APIBuilder.register_custom_route(
    system_bp, "/systems/<string:id>/plants/", methods=["GET"]
)
def get_systems_plants(id):
    """
    Get system's plants.
    """
    logger.info("Received request to get a system's plants")

    plants = Table.PLANT.get_many({"system_id": ObjectId(id)})

    return jsonify([Schema.PLANT.read(plant) for plant in plants])


@APIBuilder.register_custom_route(
    system_bp, "/systems/<string:id>/alerts/", methods=["GET"]
)
def get_systems_alerts(id):
    """
    Get system's alerts.
    """
    logger.info("Received request to get a system's alerts")

    alerts = Table.ALERT.get_many({"model_id": ObjectId(id)})

    return jsonify([Schema.ALERT.read(alert) for alert in alerts])

@APIBuilder.register_custom_route(
    system_bp, "/systems/<string:id>/lights/", methods=["GET"]
)
def get_systems_lights(id):
    """
    Get system's lights.
    """
    logger.info("Received request to get a system's alerts")

    lights = Table.LIGHT.get_many({"system_id": ObjectId(id)})

    return jsonify([Schema.LIGHT.read(light) for light in lights])

# @APIBuilder.register_custom_route(
#     system_bp, "/systems/<string:id>/lights/<string:light_id>/", methods=["POST"]
# )
# def resync_light(id, light_id):
#     """
#     Get system's lights.
#     """
#     logger.info("Received request to get a system's alerts")

#     light = Table.LIGHT.get_one(light_id)

#     return jsonify([Schema.LIGHT.read(light) for light in lights])

# @APIBuilder.register_custom_route(system_bp, "/systems/<int:system_id>/video_feed/", ["GET"])
# def get_video_feed(system_id):
#     session = Session()
#     system = session.query(System).get(system_id)
#     session.close()

#     if not system:
#         return "Invalid system ID", 400

#     if system.container_id == 'local':
#         return Response(generate_frames(),
#                         mimetype='multipart/x-mixed-replace; boundary=frame')

#     # Essentially a proxy
#     def generate():
#         resp = requests.get(f"{system.url}/video_feed", stream=True)
#         for chunk in resp.iter_content(chunk_size=1024):
#             yield chunk

#     return Response(generate(),
#                     mimetype='multipart/x-mixed-replace; boundary=frame')

# @APIBuilder.register_custom_route(system_bp, "/systems/<int:system_id>/sensor_data/", ["GET"])
# def get_sensor_data(system_id):
#     session = Session()
#     system = session.query(System).get(system_id)

#     if not system:
#         session.close()
#         return "Invalid camera ID", 400

#     try:
#         if system.url == 'local':
#             data = read_sensor()
#         else:
#             resp = requests.get(f"{system.url}/sensor_data")
#             data = resp.json()

#         system.last_temperature = data['temperature']
#         system.last_humidity = data['humidity']
#         system.updated_on = datetime.utcnow()

#         session.commit()
#         session.close()

#         return jsonify(data)
#     except Exception as e:
#         session.close()
#         return jsonify({"error": str(e)}), 500

light_bp = Blueprint("lights", __name__)
light_crud = GenericCRUD(Table.LIGHT, Schema.LIGHT)
APIBuilder.register_blueprint(
    light_bp, "lights", light_crud, ["GET", "GET_MANY", "POST", "BANISH"]
)
