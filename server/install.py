"""
Process dedicated to doing background processing on this application.
This creates alerts, manages connections to active systems, etc.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

from models.plant import PlantGenusType, PlantGenus, PlantSpecies
from models.mix import Soil

from concurrent.futures import ThreadPoolExecutor, as_completed

from db import init_db
from db import Session

from logger import setup_logger
import logging

import numpy as np

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

init_db()

num_threads = 5

def create_model(model_path, model_class):
    """
    Create the provided model from the data path.
    """
    logger.info(f"Beginning to create model {model_class}")

    db = Session()

    existing_model_count = db.query(Soil).count()
    if existing_model_count > 0:
        logger.error(f"Models already exist for {model_class}, exiting.")
        return

    with open(model_path, 'r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        for model in model_class.from_numpy(np.array(list(reader))):
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
        ("data/installable/soils/soils.csv", Soil)
        ("data/installable/plants/genera.csv", PlantGenus)
        ("data/installable/plants/genus_types.csv", PlantGenusType)
        ("data/installable/plants/species.csv", PlantSpecies)
    ]

    # Each model creator has it's own thread.
    with ThreadPoolExecutor(max_workers=num_threads) as executor:
        futures = [executor.submit(create_model, model_path, model_class) for model_path, model_class in models_to_create]
        
        # Wait for all creations to complete
        for future in as_completed(futures):
            result = future.result()

    logger.info("All models have been created.")


def main():
    create_all_models()

if __name__ == "__main__":
    logger.info("Initializing installation processing.")
    main()
    logger.info("Successfully completed installation process.")