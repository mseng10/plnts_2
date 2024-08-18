"""
Process dedicated to doing background processing on this application.
This creates alerts, manages connections to active systems, etc.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

# from models.plant import Plant, Genus, Type, Base
# from models.system import System, Light
from models.mix import SoilMatter, Todo

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

    existing_model_count = session.query(model_class).count()
    if existing_model_count > 0:
        logger.error(f"Models already exist for {model_class}, exiting.")
        return

    model_data = np.genfromtxt(model_path, delimiter=',', dtype=None, encoding=None, names=True)
    for model in model_data:
        db.add(model_class.from_json(model))

    db.commit()
    db.close()

    logger.info(f"Successfully created model {model_class}")


def create_all_models():
    """
    Create all of our packaged models on installation.
    """
    logger.info("Beginning to create model.")

    models_to_create = [
        ("data/soils/soil_matters.csv", SoilMatter)
        # Genus,Type
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