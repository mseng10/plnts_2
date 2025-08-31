"""
This module handles background tasks for the application using APScheduler.
"""
from datetime import datetime, timedelta
from typing import List, Dict
from flask import Flask
from flask_apscheduler import APScheduler
from models.plant import Plant, CarePlan
from models.alert import Alert, AlertTypes
from shared.db import Table
from shared.logger import logger

# Initialize the scheduler
scheduler: APScheduler = APScheduler()


@scheduler.task("cron", id="manage_plant_alerts_job", hour=23)
def manage_plant_alerts() -> None:
    """
    Cron job to create watering alerts for plants that are due.
    This job runs daily at 23:00 to check for plants that need care.
    """
    logger.info("Running manage_plant_alerts job...")

    try:
        # Fetch all existing alerts to avoid creating duplicates
        existing_alerts: List[Alert] = Table.ALERT.get_many()
        plants_with_alerts: Dict[str, Alert] = {
            str(alert.model_id): alert for alert in existing_alerts
        }

        # Fetch all plants and care plans
        plants: List[Plant] = Table.PLANT.get_many()
        care_plans_list: List[CarePlan] = Table.CARE_PLAN.get_many()
        care_plans: Dict[str, CarePlan] = {str(cp.id): cp for cp in care_plans_list}

        now = datetime.now()
        alerts_created_count = 0

        for plant in plants:
            plant_id_str = str(plant.id)
            care_plan: CarePlan = (
                care_plans.get(str(plant.care_plan_id)) if plant.care_plan_id else None
            )

            if care_plan is None:
                continue

            try:
                # Check for watering alert
                if not _has_alert_type(
                    plants_with_alerts, plant_id_str, AlertTypes.WATER
                ):
                    if care_plan.watering and plant.watered_on:
                        water_due_date = plant.watered_on + timedelta(
                            days=float(care_plan.watering)
                        )
                        if water_due_date < now:
                            new_alert = Alert(
                                model_id=plant.id, alert_type=AlertTypes.WATER
                            )
                            Table.ALERT.create(new_alert)
                            alerts_created_count += 1
                            logger.info(
                                f"Created watering alert for plant: ID: {plant.id}"
                            )

                # Check for fertilize alert
                if not _has_alert_type(
                    plants_with_alerts, plant_id_str, AlertTypes.FERTILIZE
                ):
                    if care_plan.fertilizing and plant.fertilized_on:
                        fertilize_due_date = plant.fertilized_on + timedelta(
                            days=float(care_plan.fertilizing)
                        )
                        if fertilize_due_date < now:
                            new_alert = Alert(
                                model_id=plant.id, alert_type=AlertTypes.FERTILIZE
                            )
                            Table.ALERT.create(new_alert)
                            alerts_created_count += 1
                            logger.info(
                                f"Created fertilize alert for plant: ID: {plant.id}"
                            )

                # Check for repot alert
                if not _has_alert_type(
                    plants_with_alerts, plant_id_str, AlertTypes.REPOT
                ):
                    if care_plan.potting and plant.potted_on:
                        potting_due_date = plant.potted_on + timedelta(
                            days=float(care_plan.potting)
                        )
                        if potting_due_date < now:
                            new_alert = Alert(
                                model_id=plant.id, alert_type=AlertTypes.REPOT
                            )
                            Table.ALERT.create(new_alert)
                            alerts_created_count += 1
                            logger.info(
                                f"Created repot alert for plant: ID: {plant.id}"
                            )

                # Check for cleanse alert
                if not _has_alert_type(
                    plants_with_alerts, plant_id_str, AlertTypes.CLEANSE
                ):
                    if care_plan.cleaning and plant.cleansed_on:
                        cleaning_due_date = plant.cleansed_on + timedelta(
                            days=float(care_plan.cleaning)
                        )
                        if cleaning_due_date < now:
                            new_alert = Alert(
                                model_id=plant.id, alert_type=AlertTypes.CLEANSE
                            )
                            Table.ALERT.create(new_alert)
                            alerts_created_count += 1
                            logger.info(
                                f"Created cleanse alert for plant: ID: {plant.id}"
                            )

            except (ValueError, TypeError) as e:
                logger.warning(
                    f"Could not process care schedule for plant ID: {plant.id}. Error: {e}"
                )

        logger.info(
            f"Finished manage_plant_alerts job. Created {alerts_created_count} new alerts."
        )

    except Exception as e:
        logger.exception(f"An error occurred during the manage_plant_alerts job: {e}")


def _has_alert_type(
    plants_with_alerts: Dict[str, Alert], plant_id: str, alert_type: AlertTypes
) -> bool:
    """Check if plant already has an alert of the specified type."""
    return (
        plant_id in plants_with_alerts
        and plants_with_alerts[plant_id].alert_type == alert_type
    )


def init_scheduler(app: Flask) -> None:
    """Initializes and starts the APScheduler."""
    scheduler.init_app(app)
    scheduler.start()
    logger.info("APScheduler initialized and started with the following jobs:")
    for job in scheduler.get_jobs():
        logger.info(
            f"-> Job: {job.name}, Trigger: {job.trigger}, Next run: {job.next_run_time}"
        )
