from datetime import datetime
from typing import Optional
from pydantic import Field
from models import FlexibleModel


class Brain(FlexibleModel):
    """Singleton model tracking background process execution times."""

    plant_alert_check_last_run: Optional[datetime] = None
    plant_alert_check_duration_seconds: Optional[float] = None
    plant_alert_check_status: str = "never_run"

    plant_care_event_check_last_run: Optional[datetime] = None
    plant_care_event_check_duration_seconds: Optional[float] = None
    plant_care_event_check_status: str = "never_run"

    created_on: datetime = Field(default_factory=datetime.now)
    updated_on: datetime = Field(default_factory=datetime.now)

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
        self, duration_seconds: Optional[float] = None, status: str = "success"
    ):
        """Update plant alert check tracking."""
        self.plant_alert_check_last_run = datetime.now()
        self.plant_alert_check_duration_seconds = duration_seconds
        self.plant_alert_check_status = status
        self.updated_on = datetime.now()

    def update_plant_care_event_check(
        self, duration_seconds: Optional[float] = None, status: str = "success"
    ):
        """Update plant care event check tracking."""
        self.plant_care_event_check_last_run = datetime.now()
        self.plant_care_event_check_duration_seconds = duration_seconds
        self.plant_care_event_check_status = status
        self.updated_on = datetime.now()
