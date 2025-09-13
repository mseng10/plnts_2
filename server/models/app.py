from datetime import datetime
from typing import Optional
from models import FlexibleModel
from enum import Enum


class STATUS(Enum):
    SUCCESS = "success"
    FAILED = "failed"
    NEVER_RAN = "never_ran"


class Brain(FlexibleModel):
    """Singleton model tracking background process execution times."""

    plant_alert_check_last_run: Optional[datetime] = None
    plant_alert_check_duration_seconds: Optional[float] = None
    plant_alert_check_status: STATUS = STATUS.NEVER_RAN

    plant_care_event_check_last_run: Optional[datetime] = None
    plant_care_event_check_duration_seconds: Optional[float] = None
    plant_care_event_check_status: STATUS = STATUS.NEVER_RAN

    @classmethod
    def get_brain(cls) -> "Brain":
        """Get the single Brain instance, create if doesn't exist."""
        from shared.db import Table

        brains = Table.BRAIN.get_many({}, limit=1)
        if brains:
            return brains[0]
        else:
            # Create the singleton Brain
            brain = cls()
            brain.id = Table.BRAIN.create(brain)
            return brain

    def update_plant_alert_check(
        self, duration_seconds: Optional[float] = None, status: STATUS = STATUS.SUCCESS
    ):
        """Update plant alert check tracking."""
        self.plant_alert_check_last_run = datetime.now()
        self.plant_alert_check_duration_seconds = duration_seconds
        self.plant_alert_check_status = status
        self.updated_on = datetime.now()

    def update_plant_care_event_check(
        self, duration_seconds: Optional[float] = None, status: STATUS = STATUS.SUCCESS
    ):
        """Update plant care event check tracking."""
        self.plant_care_event_check_last_run = datetime.now()
        self.plant_care_event_check_duration_seconds = duration_seconds
        self.plant_care_event_check_status = status
        self.updated_on = datetime.now()
