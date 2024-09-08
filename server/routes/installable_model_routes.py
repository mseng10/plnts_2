from flask import Blueprint, jsonify, request
from db import Session
from logger import logger
from routes import GenericCRUD, APIBuilder

from models.plant import Genus, Type
from models.mix import Soil

types_bp = Blueprint('types', __name__)
type_crud = GenericCRUD(Type, Type.schema)
APIBuilder.register_resource(types_bp, 'types', type_crud, methods=["GET", "GET_MANY", "POST"])

genuses_bp = Blueprint('genuses', __name__)
genus_crud = GenericCRUD(Genus, Genus.schema)
APIBuilder.register_resource(genuses_bp, 'genuses', genus_crud, methods=["GET", "GET_MANY", "POST"])

soils_bp = Blueprint('soils', __name__)
soils_crud = GenericCRUD(Soil, Soil.schema)
APIBuilder.register_resource(soils_bp, 'soils', soils_crud, methods=["GET", "GET_MANY", "POST"])
