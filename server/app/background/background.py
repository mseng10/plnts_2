"""
This module handles background tasks for the application using APScheduler.
"""
import time
from datetime import datetime, timedelta
from typing import List, Dict
from flask import Flask
from flask_apscheduler import APScheduler
from models.plant import Plant, CarePlan, PlantCareEvent, CareEventType
from models.alert import Alert, AlertTypes
from models.app import Brain
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

    # Check if 24 hours have passed since last run
    brain = Brain.get_brain()
    if brain.plant_alert_check_last_run:
        hours_since_last = (
            datetime.now() - brain.plant_alert_check_last_run
        ).total_seconds() / 3600
        if hours_since_last < 24:
            logger.info(
                f"Skipping plant alerts job - only {hours_since_last:.1f} hours since last run"
            )
            return

    start_time = time.time()

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

        # Update brain with successful completion
        duration = time.time() - start_time
        brain.update_plant_alert_check(duration, "success")
        Table.BRAIN.update(str(brain.id), brain)

    except Exception as e:
        logger.exception(f"An error occurred during the manage_plant_alerts job: {e}")

        # Update brain with failure status
        duration = time.time() - start_time
        brain.update_plant_alert_check(duration, "failed")
        Table.BRAIN.update(str(brain.id), brain)


@scheduler.task("interval", id="detect_plant_care_events_job", hours=1)
def detect_plant_care_events() -> None:
    """
    Hourly job to detect care events by comparing plant timestamps against last recorded events.
    Creates new care events when timestamps indicate care has occurred.
    """
    logger.info("Running detect_plant_care_events job...")

    # Check if 1 hour has passed since last run
    brain = Brain.get_brain()
    if brain.plant_care_event_check_last_run:
        hours_since_last = (
            datetime.now() - brain.plant_care_event_check_last_run
        ).total_seconds() / 3600
        if hours_since_last < 1:
            logger.info(
                f"Skipping care event detection - only {hours_since_last*60:.1f} minutes since last run"
            )
            return

    start_time = time.time()

    try:
        # Get all active plants
        plants: List[Plant] = Table.PLANT.get_many({"banished": False})
        events_created = 0
        last_run_time = brain.plant_care_event_check_last_run

        for plant in plants:
            # Check each care type
            care_checks = [
                (CareEventType.WATER, plant.watered_on),
                (CareEventType.FERTILIZE, plant.fertilized_on),
                (CareEventType.REPOT, plant.potted_on),
                (CareEventType.CLEANSE, plant.cleansed_on),
            ]

            for event_type, plant_timestamp in care_checks:
                if plant_timestamp is None:
                    continue

                # Only create event if plant timestamp is after last run time
                should_create_event = (
                    last_run_time is None or plant_timestamp > last_run_time
                )

                if should_create_event:
                    # Check if we already have an event for this timestamp to avoid duplicates
                    existing_events = Table.PLANT_CARE_EVENT.get_many(
                        {
                            "plant_id": plant.id,
                            "event_type": event_type,
                            "performed_on": plant_timestamp,
                        }
                    )

                    if not existing_events:
                        new_event = PlantCareEvent(
                            plant_id=plant.id,
                            event_type=event_type,
                            performed_on=plant_timestamp,
                            notes=f"Detected from plant {event_type.value.lower()} timestamp",
                        )

                        Table.PLANT_CARE_EVENT.create(new_event)
                        events_created += 1
                        logger.info(
                            f"Created {event_type.value} event for plant {plant.id} at {plant_timestamp}"
                        )

        logger.info(
            f"Care event detection completed. Created {events_created} new events."
        )

        # Update brain with successful completion
        duration = time.time() - start_time
        brain.update_plant_care_event_check(duration, "success")
        Table.BRAIN.update(str(brain.id), brain)

    except Exception as e:
        logger.exception(f"An error occurred during care event detection: {e}")

        # Update brain with failure status
        duration = time.time() - start_time
        brain.update_plant_care_event_check(duration, "failed")
        Table.BRAIN.update(str(brain.id), brain)


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
