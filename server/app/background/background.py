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
        existing_alerts: List[Alert] = Table.ALERT.get_many()
        plants_with_alerts = {alert.model_id: alert for alert in existing_alerts}

        # Fetch all plants
        plants: List[Plant] = Table.PLANT.get_many()
        care_plans: List[CarePlan] = {care_plan.id: care_plan for care_plan in Table.CARE_PLAN.get_many()}
        
        now = datetime.now()
        alerts_created_count = 0

        for plant in plants:
            care_plan: CarePlan = care_plans.get(plant.care_plan_id)
            if care_plan is None:
                continue

            try:
                if not(plant.id in plants_with_alerts and plants_with_alerts[plant.id].alert_type == AlertTypes.WATER.value):
                    water_due_date = plant.watered_on + timedelta(days=float(care_plan.watering))
                    if water_due_date < now:
                        new_alert = Alert(
                            model_id=plant.id, alert_type=AlertTypes.WATER.value
                        )
                        Table.ALERT.create(new_alert)
                        alerts_created_count += 1
                        logger.info(
                            f"Created watering alert for plant: ID: {plant.id}"
                        )

                if not(plant.id in plants_with_alerts and plants_with_alerts[plant.id].alert_type == AlertTypes.FERTILIZE.value):
                    fertilize_due_date = plant.fertilized_on + timedelta(days=float(care_plan.fertilizing))
                    if fertilize_due_date < now:
                        new_alert = Alert(
                            model_id=plant.id, alert_type=AlertTypes.FERTILIZE.value
                        )
                        Table.ALERT.create(new_alert)
                        alerts_created_count += 1
                        logger.info(
                            f"Created fertilize alert for plant: ID: {plant.id}"
                        )

                if not(plant.id in plants_with_alerts and plants_with_alerts[plant.id].alert_type == AlertTypes.REPOT.value):
                    potting_due_date = plant.potted_on + timedelta(days=float(care_plan.potting))
                    if potting_due_date < now:
                        new_alert = Alert(
                            model_id=plant.id, alert_type=AlertTypes.REPOT.value
                        )
                        Table.ALERT.create(new_alert)
                        alerts_created_count += 1
                        logger.info(
                            f"Created repot alert for plant: ID: {plant.id}"
                        )

                if not(plant.id in plants_with_alerts and plants_with_alerts[plant.id].alert_type == AlertTypes.CLEANSE.value):
                    cleaning_due_date = plant.cleansed_on + timedelta(days=float(care_plan.cleaning))
                    if cleaning_due_date < now:
                        new_alert = Alert(
                            model_id=plant.id, alert_type=AlertTypes.CLEANSE.value
                        )
                        Table.ALERT.create(new_alert)
                        alerts_created_count += 1
                        logger.info(
                            f"Created cleanse alert for plant: ID: {plant.id}"
                        )
                        
            except (ValueError, TypeError) as e:
                logger.warning(
                    f"Could not process watering schedule for plant ID: {plant.id}. Error: {e}"
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
