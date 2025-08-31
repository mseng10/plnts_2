"""
Unit tests for shared/db.py
"""
import unittest
from unittest.mock import Mock, MagicMock, patch
import pytest
from datetime import datetime
from bson import ObjectId

# Import the classes we're testing
from shared.db import Table, Query
from models.plant import Plant
from models.app import Brain


class TestTable(unittest.TestCase):
    """Test cases for Table enum and methods"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.mock_db = MagicMock()
        self.mock_collection = MagicMock()
        self.mock_db.__getitem__.return_value = self.mock_collection
        
        # Mock the Plant model
        self.mock_plant_data = {
            "_id": ObjectId("507f1f77bcf86cd799439011"),
            "created_on": datetime.now(),
            "updated_on": datetime.now(),
            "cost": 25,
            "phase": "Adult",
            "size": 12,
            "watered_on": datetime.now(),
            "banished": False
        }
    
    @patch('shared.db.DB')
    def test_count(self, mock_db):
        """Test count method"""
        mock_db.__getitem__.return_value.count_documents.return_value = 5
        
        result = Table.PLANT.count({"banished": False})
        
        self.assertEqual(result, 5)
        mock_db["plant"].count_documents.assert_called_once_with({"banished": False})
    
    @patch('shared.db.DB')
    def test_create(self, mock_db):
        """Test create method"""
        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = ObjectId("507f1f77bcf86cd799439011")
        mock_db.__getitem__.return_value.insert_one.return_value = mock_insert_result
        
        mock_plant = MagicMock()
        mock_plant.to_dict.return_value = self.mock_plant_data
        
        result = Table.PLANT.create(mock_plant)
        
        self.assertEqual(result, ObjectId("507f1f77bcf86cd799439011"))
        mock_db["plant"].insert_one.assert_called_once_with(self.mock_plant_data)
    
    @patch('shared.db.DB')
    @patch('models.plant.Plant.model_validate')
    def test_get_one_exists(self, mock_validate, mock_db):
        """Test get_one when document exists"""
        mock_db.__getitem__.return_value.find_one.return_value = self.mock_plant_data
        mock_plant = MagicMock()
        mock_validate.return_value = mock_plant
        
        result = Table.PLANT.get_one("507f1f77bcf86cd799439011")
        
        self.assertEqual(result, mock_plant)
        mock_db["plant"].find_one.assert_called_once_with({"_id": ObjectId("507f1f77bcf86cd799439011")})
        mock_validate.assert_called_once_with(self.mock_plant_data)
    
    @patch('shared.db.DB')
    def test_get_one_not_exists(self, mock_db):
        """Test get_one when document doesn't exist"""
        mock_db.__getitem__.return_value.find_one.return_value = None
        
        result = Table.PLANT.get_one("507f1f77bcf86cd799439011")
        
        self.assertIsNone(result)
    
    @patch('shared.db.DB')
    @patch('models.plant.Plant.model_validate')
    def test_get_many(self, mock_validate, mock_db):
        """Test get_many method"""
        mock_cursor = MagicMock()
        mock_cursor.limit.return_value = [self.mock_plant_data, self.mock_plant_data]
        mock_db.__getitem__.return_value.find.return_value = mock_cursor
        
        mock_plant = MagicMock()
        mock_validate.return_value = mock_plant
        
        result = Table.PLANT.get_many({"banished": False}, limit=50)
        
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0], mock_plant)
        mock_db["plant"].find.assert_called_once_with({"banished": False})
        mock_cursor.limit.assert_called_once_with(50)
    
    @patch('shared.db.DB')
    def test_update(self, mock_db):
        """Test update method"""
        mock_update_result = MagicMock()
        mock_update_result.modified_count = 1
        mock_db.__getitem__.return_value.update_one.return_value = mock_update_result
        
        mock_plant = MagicMock()
        mock_plant.to_dict.return_value = self.mock_plant_data.copy()
        
        result = Table.PLANT.update("507f1f77bcf86cd799439011", mock_plant)
        
        self.assertTrue(result)
        expected_set_data = self.mock_plant_data.copy()
        del expected_set_data["_id"]
        mock_db["plant"].update_one.assert_called_once_with(
            {"_id": ObjectId("507f1f77bcf86cd799439011")},
            {"$set": expected_set_data}
        )
    
    @patch('shared.db.DB')
    def test_update_no_changes(self, mock_db):
        """Test update method when no documents are modified"""
        mock_update_result = MagicMock()
        mock_update_result.modified_count = 0
        mock_db.__getitem__.return_value.update_one.return_value = mock_update_result
        
        mock_plant = MagicMock()
        mock_plant.to_dict.return_value = self.mock_plant_data.copy()
        
        result = Table.PLANT.update("507f1f77bcf86cd799439011", mock_plant)
        
        self.assertFalse(result)
    
    @patch('shared.db.DB')
    def test_delete(self, mock_db):
        """Test delete method"""
        mock_delete_result = MagicMock()
        mock_delete_result.deleted_count = 1
        mock_db.__getitem__.return_value.delete_one.return_value = mock_delete_result
        
        result = Table.PLANT.delete("507f1f77bcf86cd799439011")
        
        self.assertTrue(result)
        mock_db["plant"].delete_one.assert_called_once_with({"_id": ObjectId("507f1f77bcf86cd799439011")})
    
    @patch('shared.db.HIST')
    @patch('shared.db.DB')
    def test_banish(self, mock_db, mock_hist):
        """Test banish method"""
        # Setup mocks
        mock_plant = MagicMock()
        mock_plant.banish = MagicMock()
        mock_plant.to_dict.return_value = self.mock_plant_data
        
        # Mock get_one to return our plant
        with patch.object(Table.PLANT, 'get_one', return_value=mock_plant):
            # Mock delete to return True
            with patch.object(Table.PLANT, 'delete', return_value=True):
                # Mock history insert
                mock_insert_result = MagicMock()
                mock_insert_result.inserted_id = ObjectId("507f1f77bcf86cd799439012")
                mock_hist.__getitem__.return_value.insert_one.return_value = mock_insert_result
                
                result = Table.PLANT.banish("507f1f77bcf86cd799439011")
                
                self.assertTrue(result)
                mock_plant.banish.assert_called_once()
                mock_hist["plant"].insert_one.assert_called_once_with(self.mock_plant_data)
    
    @patch('shared.db.DB')
    def test_banish_item_not_found(self, mock_db):
        """Test banish when item doesn't exist"""
        with patch.object(Table.PLANT, 'get_one', return_value=None):
            result = Table.PLANT.banish("507f1f77bcf86cd799439011")
            self.assertFalse(result)


class TestQuery(unittest.TestCase):
    """Test cases for Query builder"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.query = Query()
    
    def test_filter_by(self):
        """Test filter_by method"""
        result = self.query.filter_by(name="Test Plant", banished=False).build()
        expected = {"name": "Test Plant", "banished": False}
        self.assertEqual(result, expected)
    
    def test_gt(self):
        """Test greater than condition"""
        result = self.query.gt("size", 10).build()
        expected = {"size": {"$gt": 10}}
        self.assertEqual(result, expected)
    
    def test_gte(self):
        """Test greater than or equal condition"""
        result = self.query.gte("cost", 25).build()
        expected = {"cost": {"$gte": 25}}
        self.assertEqual(result, expected)
    
    def test_lt(self):
        """Test less than condition"""
        result = self.query.lt("size", 5).build()
        expected = {"size": {"$lt": 5}}
        self.assertEqual(result, expected)
    
    def test_lte(self):
        """Test less than or equal condition"""
        result = self.query.lte("cost", 100).build()
        expected = {"cost": {"$lte": 100}}
        self.assertEqual(result, expected)
    
    def test_in(self):
        """Test in condition"""
        result = self.query.in_("phase", ["Adult", "Juvy"]).build()
        expected = {"phase": {"$in": ["Adult", "Juvy"]}}
        self.assertEqual(result, expected)
    
    def test_not_in(self):
        """Test not in condition"""
        result = self.query.not_in("phase", ["Seed"]).build()
        expected = {"phase": {"$nin": ["Seed"]}}
        self.assertEqual(result, expected)
    
    def test_not_equal(self):
        """Test not equal condition"""
        result = self.query.not_equal("banished", True).build()
        expected = {"banished": {"$ne": True}}
        self.assertEqual(result, expected)
    
    def test_exists(self):
        """Test exists condition"""
        result = self.query.exists("care_plan_id").build()
        expected = {"care_plan_id": {"$exists": True}}
        self.assertEqual(result, expected)
    
    def test_exists_false(self):
        """Test exists false condition"""
        result = self.query.exists("care_plan_id", False).build()
        expected = {"care_plan_id": {"$exists": False}}
        self.assertEqual(result, expected)
    
    def test_logical_and(self):
        """Test logical AND"""
        queries = [{"size": {"$gt": 5}}, {"cost": {"$lt": 50}}]
        result = self.query.logical_and(queries).build()
        expected = {"$and": queries}
        self.assertEqual(result, expected)
    
    def test_logical_or(self):
        """Test logical OR"""
        queries = [{"phase": "Adult"}, {"size": {"$gt": 10}}]
        result = self.query.logical_or(queries).build()
        expected = {"$or": queries}
        self.assertEqual(result, expected)
    
    def test_chained_conditions(self):
        """Test chaining multiple conditions on same field"""
        result = self.query.gte("size", 5).lte("size", 20).build()
        expected = {"size": {"$gte": 5, "$lte": 20}}
        self.assertEqual(result, expected)
    
    def test_complex_query(self):
        """Test complex query with multiple fields and conditions"""
        result = (self.query
                 .filter_by(banished=False)
                 .gt("cost", 10)
                 .lt("cost", 100)
                 .in_("phase", ["Adult", "Juvy"])
                 .build())
        
        expected = {
            "banished": False,
            "cost": {"$gt": 10, "$lt": 100},
            "phase": {"$in": ["Adult", "Juvy"]}
        }
        self.assertEqual(result, expected)


class TestTableEnum(unittest.TestCase):
    """Test Table enum properties"""
    
    def test_table_properties(self):
        """Test that Table enum has correct properties"""
        self.assertEqual(Table.PLANT.table_name, "plant")
        self.assertEqual(Table.PLANT.model_class, Plant)
        
        self.assertEqual(Table.BRAIN.table_name, "brain")
        self.assertEqual(Table.BRAIN.model_class, Brain)
    
    def test_all_tables_have_properties(self):
        """Test that all table entries have required properties"""
        for table in Table:
            self.assertIsInstance(table.table_name, str)
            self.assertTrue(hasattr(table.model_class, 'model_validate'))


if __name__ == '__main__':
    # Run the tests
    unittest.main(verbosity=2)