from flask import Blueprint, jsonify, request
from db import Session
from logger import logger

from models.mix import Mix

bp = Blueprint('mixes', __name__, url_prefix='/mixes')

@bp.route("/", methods=["GET"])
def get_mixes():
    """
    Retrieve all mixes from the database.
    """
    logger.info("Received request to retrieve all mixes")

    db = Session()
    mixes = db.query(Mix).all()
    db.close()

    mixes_json = [mix.to_json() for mix in mixes]
    
    logger.info("Succesfully queried all mixes")
    return jsonify(mixes_json)

@bp.route("/", methods=["POST"])
def create_mix():
    """
    Create a new mix and add it to the database.
    """
    logger.info("Attempting to create mix")

    db = Session()

    new_mix_json = request.get_json()
    
    # Create the mix
    new_mix = Mix(
        name=new_mix_json["name"],
        description=new_mix_json["description"],
        experimental=new_mix_json["experimental"]
    )
    db.add(new_mix)
    db.flush()

    # Create the mix-soil join tables
    for soil_id, parts in new_mix_json["soils"].items():
        soil = db.query(Soil).get(int(soil_id))
        if soil:
            association = mix_soil_association.insert().values(
                mix_id=new_mix.id,
                soil_id=soil.id,
                parts=int(parts)
            )
            db.execute(association)
    db.commit()
    db.close()

    return jsonify({"message": "Mix added successfully"}), 201

@bp.route("/<int:mix_id>/deprecate", methods=["POST"])
def deprecate_mix(mix_id):
    """
    Deprecate the specified system.
    """
    logger.info("Received request to deprecate the specified mix")

    db = Session()

    mix = db.query(Mix).get(mix_id)
    mix.deprecated = True
    mix.deprecated_on = datetime.now()
    # mix.deprecated_cause = ""
    
    db.commit()
    db.close()

    return jsonify({"message": f"Mix deprecated:("}), 201