"""
This module handles background tasks for the application using APScheduler.
"""
from datetime import datetime, timedelta
from typing import List

from flask import Flask
from flask_apscheduler import APScheduler

from models.plant import Plant, CarePlan
from models.alert import Alert, AlertTypes
from shared.db import Table
from shared.logger import logger

# Initialize the scheduler
scheduler: APScheduler = APScheduler()


@scheduler.task("cron", id="manage_plant_alerts_job", minute="*")
def manage_plant_alerts() -> None:
    """
    Cron job to create watering alerts for plants that are due.
    This job runs every minute to check for plants that need watering.
    """
    logger.info("Running manage_plant_alerts job...")
    try:
        # Fetch all existing watering alerts to avoid creating duplicates
        existing_alerts: List[Alert] = Table.ALERT.get_many(
            {"alert_type": AlertTypes.WATER.value}
        )
        plants_with_alerts = {alert.model_id for alert in existing_alerts}

        # Fetch all plants
        plants: List[Plant] = Table.PLANT.get_many()
        care_plans: List[CarePlan] = Table.CARE_PLAN.get_many()
        
        now = datetime.now()
        alerts_created_count = 0

        for plant in plants:
            # Skip if the plant already has a watering alert or has no watering schedule
            if plant.id in plants_with_alerts or not all(
                [plant.watered_on, plant.watering]
            ):
                continue

            try:
                due_date = plant.watered_on + timedelta(days=float(plant.watering))
                if due_date < now:
                    new_alert = Alert(
                        model_id=plant.id, alert_type=AlertTypes.WATER.value
                    )
                    Table.ALERT.create(new_alert)
                    alerts_created_count += 1
                    logger.info(
                        f"Created watering alert for plant: {plant.name} (ID: {plant.id})"
                    )
            except (ValueError, TypeError) as e:
                logger.warning(
                    f"Could not process watering schedule for plant {plant.name} (ID: {plant.id}). Error: {e}"
                )

        logger.info(
            f"Finished manage_plant_alerts job. Created {alerts_created_count} new alerts."
        )
    except Exception as e:
        logger.exception(f"An error occurred during the manage_plant_alerts job: {e}")


def init_scheduler(app: Flask) -> None:
    """Initializes and starts the APScheduler."""
    scheduler.init_app(app)
    scheduler.start()
    logger.info("APScheduler initialized and started with the following jobs:")
    for job in scheduler.get_jobs():
        logger.info(
            f"-> Job: {job.name}, Trigger: {job.trigger}, Next run: {job.next_run_time}"
        )
