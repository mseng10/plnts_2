from flask import Blueprint, jsonify, request

from shared.db import Table
from shared.logger import logger

from bson import ObjectId

from routes import GenericCRUD, APIBuilder, Schema

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
        genus_type = Schema.PLANT_GENUS_TYPE.create(genus_type)

    if genus is not None:
        genus["genus_type_id"] = genus_type.id
        genus = Schema.PLANT_GENUS.create(genus)

    if species is not None:
        species["genus_id"] = genus.id
        species = Schema.SPECIES.create(species)

    return jsonify({"species": species, "genus": genus, "genus_type": genus_type})


genus_bp = Blueprint("genera", __name__)
genus_crud = GenericCRUD(Table.GENUS, Schema.PLANT_GENUS)
APIBuilder.register_blueprint(
    genus_bp, "genera", genus_crud, methods=["GET", "GET_MANY"]
)

soils_bp = Blueprint("soils", __name__)
soils_crud = GenericCRUD(Table.SOIL, Schema.SOIL)
APIBuilder.register_blueprint(
    soils_bp, "soils", soils_crud, methods=["GET", "GET_MANY"]
)
