"""
Process dedicated to doing background processing on this application.
This creates alerts, manages connections to active systems, etc.
"""
from datetime import datetime
import logging

from models.plant import Plant
from models.alert import PlantAlert

from shared.db import init_db, Session
from shared.logger import setup_logger

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)

# Initialize DB connection
init_db()

def create_plant_alert():
    """
    Create different plant alerts. Right now just supports creating watering alerts.
    """
    session = Session()

    existing_plant_alrts = session.query(PlantAlert).filter(PlantAlert.deprecated == False).all()
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
            session.add(new_plant_alert)
            existing_plant_alrts[new_plant_alert.plant_id] = new_plant_alert

    session.commit()
    session.close()

def main():
    create_plant_alert()

if __name__ == "__main__":
    logger.info("Starting background processing.")
    while True:
        main()