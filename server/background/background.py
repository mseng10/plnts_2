"""
Process dedicated to doing background processing on this application.
This creates alerts, manages connections to active systems, etc.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL

from models.model import Base
from models.plant import Plant, Genus, Type
from models.system import System, Light
from models.alert import PlantAlert, Todo
from models.background.background import Ba

from db import init_db
from db import Session

from logger import setup_logger
import logging


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

init_db()

def create_plant_alert():
    """
    Create different plant alerts. Right now just supports creating watering alerts.
    """
    db = Session()

    existing_plant_alrts = db.query(PlantAlert).filter(PlantAlert.deprecated == False).all()
    existing_plant_alrts_map = {}
    for existing_plant_alert in existing_plant_alrts:
        existing_plant_alrts_map[existing_plant_alert.plant_id] = existing_plant_alert

    existing_plants = session.query(Plant).filter(Plant.deprecated == False).all()
    now = datetime.now()
    for plant in existing_plants:
        end_date = plant.watered_on + datetime.timedelta(days=float(plant.watering))
        if end_date < datetime.now() and existing_plant_alrts_map.get(plant.id) is None:
            new_plant_alert = PlantAlert(
                plant_id = plant.id,
                system_id = plant.system_id,
                plant_alert_type = "water"
            )
            # Create the alert in the db
            db.add(new_plant_alert)
            existing_plant_alrts[new_plant_alert.plant_id] = new_plant_alert

    db.commit()
    db.close()

def main():
    create_plant_alert()


if __name__ == "__main__":
    while True:
        logger.info("Starting background processing.")
        main()