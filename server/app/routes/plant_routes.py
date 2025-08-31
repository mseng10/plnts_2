from flask import Blueprint, request, jsonify
from models.plant import Plant, PlantGenusType, PlantGenus, PlantSpecies
from shared.db import Table, Query
from shared.logger import logger
from routes import GenericCRUD, APIBuilder

bp = Blueprint("plants", __name__)
plant_crud = GenericCRUD(Table.PLANT)
APIBuilder.register_blueprint(
    bp, "plants", plant_crud, ["GET", "GET_MANY", "POST", "PATCH", "BANISH"]
)

genus_types_bp = Blueprint("genus_types", __name__)
genus_types_crud = GenericCRUD(Table.GENUS_TYPE)
APIBuilder.register_blueprint(
    genus_types_bp, "genus_types", genus_types_crud, methods=["GET", "GET_MANY"]
)

species_bp = Blueprint("species", __name__)
species_crud = GenericCRUD(Table.SPECIES)
APIBuilder.register_blueprint(
    species_bp, "species", species_crud, methods=["GET", "GET_MANY"]
)

@APIBuilder.register_custom_route(species_bp, "/species/all/", methods=["POST"])
def create_all():
    """Create species with genus and genus_type hierarchy."""
    logger.info("Received request to create all")
    data = request.json
    species_data = data.get("species")
    genus_data = data.get("genus")
    genus_type_data = data.get("genus_type")
    
    result = {}
    
    if genus_type_data is not None:
        logger.info("Creating Plant Genus Type")
        genus_type = PlantGenusType.model_validate(genus_type_data)
        genus_type_id = Table.GENUS_TYPE.create(genus_type)
        genus_type.id = genus_type_id
        result["genus_type"] = genus_type.model_dump(mode='json')
    
    if genus_data is not None:
        logger.info("Create Plant Genus")
        if genus_type_data is not None:
            genus_data["genus_type_id"] = genus_type_id
        genus = PlantGenus.model_validate(genus_data)
        genus_id = Table.GENUS.create(genus)
        genus.id = genus_id
        result["genus"] = genus.model_dump(mode='json')
    
    if species_data is not None:
        logger.info("Creating plant species")
        if genus_data is not None:
            species_data["genus_id"] = genus_id
        species = PlantSpecies.model_validate(species_data)
        species_id = Table.SPECIES.create(species)
        species.id = species_id
        result["species"] = species.model_dump(mode='json')
    
    return jsonify(result)

genus_bp = Blueprint("genera", __name__)
genus_crud = GenericCRUD(Table.GENUS)
APIBuilder.register_blueprint(
    genus_bp, "genera", genus_crud, methods=["GET", "GET_MANY"]
)

care_plan_bp = Blueprint("care_plans", __name__)
care_plan_crud = GenericCRUD(Table.CARE_PLAN)
APIBuilder.register_blueprint(
    care_plan_bp, "care_plans", care_plan_crud, methods=["GET", "GET_MANY", "POST", "PATCH", "BANISH"]
)