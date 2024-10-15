"""
Process dedicated to installing static data (e.g. genuses, species, etc).
Could eventually see this moving to cloud.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.plant import PlantGenusType, PlantGenus, PlantSpecies
from models.mix import Soil

from shared.db import init_db
from shared.db import Session

from shared.logger import setup_logger
import logging

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)

init_db()

num_threads = 5

def create_model(model_path, model_class):
    """
    Create the provided model from the data path.
    """
    logger.info(f"Beginning to create model {model_class}")

    db = Session()

    existing_model_count = db.query(model_class).count()
    if existing_model_count > 0:
        # NOTE: Probably make this more flexible in the future, but rn, just 1 time install (e.g. no rolling upgrades - upgrade.py?)
        logger.error(f"Models already exist for {model_class}, exiting.")
        return

    for model in model_class.from_csv(model_path):
        db.add(model)

    db.commit()
    db.close()

    logger.info(f"Successfully created model {model_class}")


def create_all_models():
    """
    Create all of our packaged models on installation.
    """
    logger.info("Beginning to create model.")

    models_to_create = [
        ("data/installable/soils/soils.csv", Soil),
        ("data/installable/plants/genus_types.csv", PlantGenusType),
        ("data/installable/plants/genera.csv", PlantGenus),
        ("data/installable/plants/species.csv", PlantSpecies),
    ]

    for model_path, model_class in models_to_create:
        create_model(model_path, model_class)

    logger.info("All models have been created.")


def main():
    create_all_models()

if __name__ == "__main__":
    logger.info("Initializing installation processing.")
    main()
    logger.info("Successfully completed installation process.")