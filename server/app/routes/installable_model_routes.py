from flask import Blueprint

from routes import GenericCRUD, APIBuilder
from models.plant import PlantGenusType, PlantGenus, PlantSpecies
from models.mix import Soil

genus_types_bp = Blueprint('genus_types', __name__)

genus_types_crud = GenericCRUD(PlantGenusType, PlantGenusType.schema)
genus_crud = GenericCRUD(PlantGenus, PlantGenus.schema)

APIBuilder.register_resource(genus_types_bp, 'genus_types', genus_types_crud, methods=["GET", "GET_MANY"])
APIBuilder.register_resource(genus_types_bp, 'genera', genus_crud, methods=["GET", "GET_MANY"])

species_bp = Blueprint('species', __name__)
species_crud = GenericCRUD(PlantSpecies, PlantSpecies.schema)
APIBuilder.register_resource(species_bp, 'species', species_crud, methods=["GET", "GET_MANY"])

genus_bp = Blueprint('genera', __name__)
genus_crud = GenericCRUD(PlantGenus, PlantGenus.schema)
APIBuilder.register_resource(genus_bp, 'genera', genus_crud, methods=["GET", "GET_MANY"])

soils_bp = Blueprint('soils', __name__)
soils_crud = GenericCRUD(Soil, Soil.schema)
APIBuilder.register_resource(soils_bp, 'soils', soils_crud, methods=["GET", "GET_MANY"])
