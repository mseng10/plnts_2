from flask import Blueprint

from shared.db import Table

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
