"""
Unit tests for app/background/background.py (background scheduler)
"""
import unittest
from unittest.mock import Mock, MagicMock, patch, call
from datetime import datetime, timedelta
import time

# Import the functions we're testing
from app.background.background import (
    manage_plant_alerts, 
    detect_plant_care_events,
    _has_alert_type,
    init_scheduler
)
from models.alert import AlertTypes
from models.plant import CareEventType


class TestManagePlantAlerts(unittest.TestCase):
    """Test cases for manage_plant_alerts background task"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.mock_brain = MagicMock()
        self.mock_brain.plant_alert_check_last_run = None
        self.mock_brain.update_plant_alert_check = MagicMock()
        self.mock_brain.id = "brain_id"
        
        # Mock plant data
        self.mock_plant = MagicMock()
        self.mock_plant.id = "plant_id_123"
        self.mock_plant.care_plan_id = "care_plan_id_456"
        self.mock_plant.watered_on = datetime.now() - timedelta(days=10)
        self.mock_plant.fertilized_on = datetime.now() - timedelta(days=20)
        self.mock_plant.potted_on = datetime.now() - timedelta(days=100)
        self.mock_plant.cleansed_on = datetime.now() - timedelta(days=15)
        
        # Mock care plan data
        self.mock_care_plan = MagicMock()
        self.mock_care_plan.id = "care_plan_id_456"
        self.mock_care_plan.watering = "7"  # days
        self.mock_care_plan.fertilizing = "14"  # days
        self.mock_care_plan.potting = "365"  # days
        self.mock_care_plan.cleaning = "10"  # days
    
    @patch('app.background.background.time')
    @patch('app.background.background.Table')
    @patch('app.background.background.Brain')
    def test_manage_plant_alerts_skip_recent_run(self, mock_brain_class, mock_table, mock_time):
        """Test that task skips when last run was less than 24 hours ago"""
        # Setup: last run was 12 hours ago
        recent_run = datetime.now() - timedelta(hours=12)
        self.mock_brain.plant_alert_check_last_run = recent_run
        mock_brain_class.get_brain.return_value = self.mock_brain
        
        manage_plant_alerts()
        
        # Should skip and not process any alerts
        mock_table.ALERT.get_many.assert_not_called()
        mock_table.PLANT.get_many.assert_not_called()
        self.mock_brain.update_plant_alert_check.assert_not_called()
    
    @patch('app.background.background.logger')
    @patch('app.background.background.time')
    @patch('app.background.background.Table')
    @patch('app.background.background.Brain')
    def test_manage_plant_alerts_first_run(self, mock_brain_class, mock_table, mock_time, mock_logger):
        """Test first run when no previous run exists"""
        # Setup: no previous run
        self.mock_brain.plant_alert_check_last_run = None
        mock_brain_class.get_brain.return_value = self.mock_brain
        mock_time.time.side_effect = [1000.0, 1010.5]  # start and end time
        
        # Setup table responses
        mock_table.ALERT.get_many.return_value = []  # No existing alerts
        mock_table.PLANT.get_many.return_value = [self.mock_plant]
        mock_table.CARE_PLAN.get_many.return_value = [self.mock_care_plan]
        mock_table.ALERT.create.return_value = "alert_id"
        mock_table.BRAIN.update.return_value = True
        
        manage_plant_alerts()
        
        # Should process plants and create alerts
        mock_table.ALERT.get_many.assert_called_once()
        mock_table.PLANT.get_many.assert_called_once()
        mock_table.CARE_PLAN.get_many.assert_called_once()
        
        # Should update brain with success
        self.mock_brain.update_plant_alert_check.assert_called_once_with(10.5, "success")
        mock_table.BRAIN.update.assert_called_once_with("brain_id", self.mock_brain)
    
    @patch('app.background.background.Alert')
    @patch('app.background.background.time')
    @patch('app.background.background.Table')
    @patch('app.background.background.Brain')
    def test_manage_plant_alerts_creates_overdue_alerts(self, mock_brain_class, mock_table, mock_time, mock_alert_class):
        """Test that overdue alerts are created"""
        # Setup: old run allows processing
        old_run = datetime.now() - timedelta(days=2)
        self.mock_brain.plant_alert_check_last_run = old_run
        mock_brain_class.get_brain.return_value = self.mock_brain
        mock_time.time.side_effect = [1000.0, 1005.0]
        
        # Setup table responses
        mock_table.ALERT.get_many.return_value = []
        mock_table.PLANT.get_many.return_value = [self.mock_plant]
        mock_table.CARE_PLAN.get_many.return_value = [self.mock_care_plan]
        
        # Mock alert creation
        mock_alert_instance = MagicMock()
        mock_alert_class.return_value = mock_alert_instance
        mock_table.ALERT.create.return_value = "new_alert_id"
        mock_table.BRAIN.update.return_value = True
        
        manage_plant_alerts()
        
        # Should create alerts for overdue care
        # Water (10 days ago, due every 7 days = 3 days overdue)
        # Fertilize (20 days ago, due every 14 days = 6 days overdue) 
        # Cleanse (15 days ago, due every 10 days = 5 days overdue)
        # Not potting (100 days ago, due every 365 days = not overdue)
        
        expected_calls = [
            call(model_id="plant_id_123", alert_type=AlertTypes.WATER),
            call(model_id="plant_id_123", alert_type=AlertTypes.FERTILIZE),
            call(model_id="plant_id_123", alert_type=AlertTypes.CLEANSE)
        ]
        mock_alert_class.assert_has_calls(expected_calls)
        self.assertEqual(mock_table.ALERT.create.call_count, 3)
    
    @patch('app.background.background.time')
    @patch('app.background.background.Table')
    @patch('app.background.background.Brain')
    def test_manage_plant_alerts_handles_exception(self, mock_brain_class, mock_table, mock_time):
        """Test error handling when exception occurs"""
        old_run = datetime.now() - timedelta(days=2)
        self.mock_brain.plant_alert_check_last_run = old_run
        mock_brain_class.get_brain.return_value = self.mock_brain
        mock_time.time.side_effect = [1000.0, 1005.0]
        
        # Setup exception
        mock_table.ALERT.get_many.side_effect = Exception("Database error")
        mock_table.BRAIN.update.return_value = True
        
        manage_plant_alerts()
        
        # Should update brain with failure status
        self.mock_brain.update_plant_alert_check.assert_called_once_with(5.0, "failed")
        mock_table.BRAIN.update.assert_called_once_with("brain_id", self.mock_brain)


class TestDetectPlantCareEvents(unittest.TestCase):
    """Test cases for detect_plant_care_events background task"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.mock_brain = MagicMock()
        self.mock_brain.plant_care_event_check_last_run = None
        self.mock_brain.update_plant_care_event_check = MagicMock()
        self.mock_brain.id = "brain_id"
        
        self.mock_plant = MagicMock()
        self.mock_plant.id = "plant_id_123"
        self.mock_plant.watered_on = datetime.now() - timedelta(minutes=30)  # 30 min ago
        self.mock_plant.fertilized_on = None
        self.mock_plant.potted_on = datetime.now() - timedelta(minutes=90)   # 1.5 hours ago
        self.mock_plant.cleansed_on = None
    
    @patch('app.background.background.time')
    @patch('app.background.background.Table')
    @patch('app.background.background.Brain')
    def test_detect_care_events_skip_recent_run(self, mock_brain_class, mock_table, mock_time):
        """Test that task skips when last run was less than 1 hour ago"""
        # Setup: last run was 30 minutes ago
        recent_run = datetime.now() - timedelta(minutes=30)
        self.mock_brain.plant_care_event_check_last_run = recent_run
        mock_brain_class.get_brain.return_value = self.mock_brain
        
        detect_plant_care_events()
        
        # Should skip processing
        mock_table.PLANT.get_many.assert_not_called()
        self.mock_brain.update_plant_care_event_check.assert_not_called()
    
    @patch('app.background.background.PlantCareEvent')
    @patch('app.background.background.time')
    @patch('app.background.background.Table')
    @patch('app.background.background.Brain')
    def test_detect_care_events_creates_events(self, mock_brain_class, mock_table, mock_time, mock_care_event_class):
        """Test that care events are created for new plant activities"""
        # Setup: last run was 2 hours ago
        last_run = datetime.now() - timedelta(hours=2)
        self.mock_brain.plant_care_event_check_last_run = last_run
        mock_brain_class.get_brain.return_value = self.mock_brain
        mock_time.time.side_effect = [1000.0, 1003.0]
        
        # Setup table responses
        mock_table.PLANT.get_many.return_value = [self.mock_plant]
        mock_table.PLANT_CARE_EVENT.get_many.return_value = []  # No existing events
        mock_table.PLANT_CARE_EVENT.create.return_value = "event_id"
        mock_table.BRAIN.update.return_value = True
        
        # Mock care event creation
        mock_event_instance = MagicMock()
        mock_care_event_class.return_value = mock_event_instance
        
        detect_plant_care_events()
        
        # Should create events for water and repot (both after last run time)
        expected_calls = [
            call(
                plant_id="plant_id_123",
                event_type=CareEventType.WATER,
                performed_on=self.mock_plant.watered_on,
                notes="Detected from plant water timestamp"
            ),
            call(
                plant_id="plant_id_123", 
                event_type=CareEventType.REPOT,
                performed_on=self.mock_plant.potted_on,
                notes="Detected from plant repot timestamp"
            )
        ]
        mock_care_event_class.assert_has_calls(expected_calls)
        self.assertEqual(mock_table.PLANT_CARE_EVENT.create.call_count, 2)
    
    @patch('app.background.background.time')
    @patch('app.background.background.Table')
    @patch('app.background.background.Brain')
    def test_detect_care_events_avoids_duplicates(self, mock_brain_class, mock_table, mock_time):
        """Test that duplicate events are not created"""
        last_run = datetime.now() - timedelta(hours=2)
        self.mock_brain.plant_care_event_check_last_run = last_run
        mock_brain_class.get_brain.return_value = self.mock_brain
        mock_time.time.side_effect = [1000.0, 1003.0]
        
        # Setup existing event that matches plant timestamp
        existing_event = MagicMock()
        existing_event.performed_on = self.mock_plant.watered_on
        
        mock_table.PLANT.get_many.return_value = [self.mock_plant]
        mock_table.PLANT_CARE_EVENT.get_many.return_value = [existing_event]
        mock_table.BRAIN.update.return_value = True
        
        detect_plant_care_events()
        
        # Should not create any events (duplicates detected)
        mock_table.PLANT_CARE_EVENT.create.assert_not_called()
        
        # Should still update brain
        self.mock_brain.update_plant_care_event_check.assert_called_once_with(3.0, "success")


class TestHasAlertType(unittest.TestCase):
    """Test cases for _has_alert_type helper function"""
    
    def test_has_alert_type_exists(self):
        """Test when plant has alert of specified type"""
        mock_alert = MagicMock()
        mock_alert.alert_type = AlertTypes.WATER
        
        plants_with_alerts = {"plant_123": mock_alert}
        
        result = _has_alert_type(plants_with_alerts, "plant_123", AlertTypes.WATER)
        self.assertTrue(result)
    
    def test_has_alert_type_different_type(self):
        """Test when plant has alert but of different type"""
        mock_alert = MagicMock()
        mock_alert.alert_type = AlertTypes.FERTILIZE
        
        plants_with_alerts = {"plant_123": mock_alert}
        
        result = _has_alert_type(plants_with_alerts, "plant_123", AlertTypes.WATER)
        self.assertFalse(result)
    
    def test_has_alert_type_no_alert(self):
        """Test when plant has no alerts"""
        plants_with_alerts = {}
        
        result = _has_alert_type(plants_with_alerts, "plant_123", AlertTypes.WATER)
        self.assertFalse(result)


class TestInitScheduler(unittest.TestCase):
    """Test cases for init_scheduler function"""
    
    @patch('app.background.background.logger')
    @patch('app.background.background.Brain')
    @patch('app.background.background.scheduler')
    def test_init_scheduler_success(self, mock_scheduler, mock_brain_class, mock_logger):
        """Test successful scheduler initialization"""
        mock_app = MagicMock()
        mock_brain = MagicMock()
        mock_brain.plant_alert_check_last_run = datetime.now()
        mock_brain.plant_care_event_check_last_run = None
        
        mock_brain_class.get_brain.return_value = mock_brain
        
        # Mock scheduler jobs
        mock_job = MagicMock()
        mock_job.name = "test_job"
        mock_job.trigger = "cron"
        mock_job.next_run_time = datetime.now()
        mock_scheduler.get_jobs.return_value = [mock_job]
        
        init_scheduler(mock_app)
        
        # Should initialize brain and scheduler
        mock_brain_class.get_brain.assert_called_once()
        mock_scheduler.init_app.assert_called_once_with(mock_app)
        mock_scheduler.start.assert_called_once()
        mock_logger.info.assert_called()
    
    @patch('app.background.background.logger')
    @patch('app.background.background.Brain')
    @patch('app.background.background.scheduler')
    def test_init_scheduler_brain_error(self, mock_scheduler, mock_brain_class, mock_logger):
        """Test scheduler initialization when Brain creation fails"""
        mock_app = MagicMock()
        mock_brain_class.get_brain.side_effect = Exception("Database connection failed")
        
        init_scheduler(mock_app)
        
        # Should log error but continue with scheduler init
        mock_logger.error.assert_called()
        mock_scheduler.init_app.assert_called_once_with(mock_app)
        mock_scheduler.start.assert_called_once()


if __name__ == '__main__':
    unittest.main(verbosity=2)