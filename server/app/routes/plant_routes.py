from flask import Blueprint, request, jsonify

from shared.db import Table, Query
from shared.logger import logger
from routes import GenericCRUD, APIBuilder, Schema

bp = Blueprint("plants", __name__)
plant_crud = GenericCRUD(Table.PLANT, Schema.PLANT)
APIBuilder.register_blueprint(
    bp, "plants", plant_crud, ["GET", "GET_MANY", "POST", "PATCH", "BANISH"]
)

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


genus_types_bp = Blueprint("genus_types", __name__)
genus_types_crud = GenericCRUD(Table.GENUS_TYPE, Schema.PLANT_GENUS_TYPE)
APIBuilder.register_blueprint(
    genus_types_bp, "genus_types", genus_types_crud, methods=["GET", "GET_MANY"]
)

species_bp = Blueprint("species", __name__)
species_crud = GenericCRUD(Table.SPECIES, Schema.SPECIES)
APIBuilder.register_blueprint(
    species_bp, "species", species_crud, methods=["GET", "GET_MANY"]
)


@APIBuilder.register_custom_route(species_bp, "/species/all/", methods=["POST"])
def create_all():
    """
    Get system's lights.
    """
    logger.info("Received request to create all")

    data = request.json
    species = data["species"]
    genus = data["genus"]
    genus_type = data["genus_type"]

    if genus_type is not None:
        logger.info("Creating Plant Genus Type")
        genus_type = Schema.PLANT_GENUS_TYPE.create(genus_type)

    if genus is not None:
        logger.info("Create Plant Genus")
        genus["genus_type_id"] = genus_type.id
        genus = Schema.PLANT_GENUS.create(genus)

    if species is not None:
        logger.info("Creating plant species")
        species["genus_id"] = genus.id
        species = Schema.SPECIES.create(species)

    return jsonify({"species": species, "genus": genus, "genus_type": genus_type})


genus_bp = Blueprint("genera", __name__)
genus_crud = GenericCRUD(Table.GENUS, Schema.PLANT_GENUS)
APIBuilder.register_blueprint(
    genus_bp, "genera", genus_crud, methods=["GET", "GET_MANY"]
)

care_plan_bp = Blueprint("care_plans", __name__)
care_plan_crud = GenericCRUD(Table.CARE_PLAN, Schema.CARE_PLAN)
APIBuilder.register_blueprint(
    care_plan_bp, "care_plans", care_plan_crud, methods=["GET", "GET_MANY", "POST", "PATCH", "BANISH"]
)
