from flask import Blueprint, jsonify, request

from shared.db import Table
from routes import GenericCRUD, APIBuilder, Schema

bp = Blueprint('plants', __name__)
plant_crud = GenericCRUD(Table.PLANT, Schema.PLANT)
APIBuilder.register_blueprint(bp, 'plants', plant_crud)

# @APIBuilder.register_custom_route(bp, 'deprecate/', ['GET'])
# def deprecate_plants():
#     """
#     Deprecate the specified plants.
#     """
#     logger.info("Received request to deprecate the specified plants")

#     deprecate_ids = [int(id) for id in request.get_json()["ids"]]
#     cause = request.get_json()["cause"]

#     db = Session()
#     plants = db.query(Plant).filter(Plant.id.in_(watering_ids)).all()
#     now = datetime.now()
#     for plant in plants:
#         plant.deprecated = True
#         plant.deprecated_on = datetime.now()
#         plant.deprecated_cause = cause
    
#     db.commit()
#     db.close()

#     return jsonify({"message": f"{len(plants)} Plants deprecated successfully:("}), 201

# @APIBuilder.register_custom_route(bp, "water/", ["POST"])
# def water_plants():
#     """
#     Water the specified plants.
#     """
#     logger.info("Received request to water the specified plants")
#     watering_ids = [int(id) for id in request.get_json()["ids"]]
#     db = Session()
#     plants = db.query(Plant).filter(Plant.id.in_(watering_ids)).all()
#     now = datetime.now()
#     for plant in plants:
#         plant.watered_on = now
#         plant.updated_on = now
#     db.commit()
#     db.close()

#     return jsonify({"message": f"{len(plants)} Plants watered successfully"}), 201
