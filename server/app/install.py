"""
Process dedicated to installing static data (e.g. genuses, species, etc).
Could eventually see this moving to cloud.
"""
import sys
import os
from typing import Type, List, Tuple

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.plant import PlantGenusType, PlantGenus, PlantSpecies
from models.mix import Soil
from models import FlexibleModel
from shared.db import DB, Table
from shared.logger import setup_logger
import logging

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)


def create_model(model_path: str, table: Table):
    """Create the provided model from the data path."""
    logger.info(f"Beginning to create model {table.table_name}")

    # Load models from CSV and insert them
    models: List[FlexibleModel] = table.model_class.from_csv(model_path)

    if models:
        for doc in models:
            table.upsert(str(doc.id), doc)
        logger.info(
            f"Successfully upserted {len(models)} documents for {table.table_name}"
        )
    else:
        logger.error(f"No documents to create for {table.table_name}")


def create_all_models():
    """Create all of our packaged models on installation."""
    logger.info("Beginning to upsert models.")

    models_to_create: List[Tuple[str, Table]] = [
        ("../data/installable/soils/soils.csv", Table.SOIL),
        ("../data/installable/plants/genus_types.csv", Table.GENUS_TYPE),
        ("../data/installable/plants/genera.csv", Table.GENUS),
        ("../data/installable/plants/species.csv", Table.SPECIES),
    ]

    for model_path, table in models_to_create:
        create_model(model_path, table)

    logger.info("All models have been created.")


def install():
    """Initialize the database with required data"""
    logger.info("Installation starting")
    create_all_models()
    logger.info("Installation complete")


if __name__ == "__main__":
    install()
