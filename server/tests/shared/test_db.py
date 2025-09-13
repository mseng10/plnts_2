"""
Comprehensive tests for the database module
"""

from bson import ObjectId

from models.plant import Plant, PlantGenus, PlantSpecies, PHASES
from models.system import System
from models.todo import Todo
from shared.test_utils import MongoTestCase, DatabaseTestMixin
from shared.db import Table, Query, get_db_config


class TestDatabaseConfiguration(MongoTestCase):
    """Test database configuration and initialization"""

    def test_database_initialization(self):
        """Test that database is properly initialized"""
        config = get_db_config()
        self.assertIsNotNone(config)
        self.assertEqual(config.db_name, "plnts_test")
        self.assertEqual(config.hist_db_name, "plnts_test_hist")

    def test_database_connections(self):
        """Test that we can connect to both main and history databases"""
        config = self.get_test_db_config()

        self.assertIsNotNone(config.client)
        config.client.admin.command("ping")

        self.assertIsNotNone(config.client_hist)
        config.client_hist.admin.command("ping")

    def test_database_names(self):
        """Test that database names are correctly set"""
        config = self.get_test_db_config()
        self.assertEqual(config.db.name, "plnts_test")
        self.assertEqual(config.hist.name, "plnts_test_hist")


class TestTableEnum(MongoTestCase, DatabaseTestMixin):
    """Test the Table enum functionality"""

    def test_create_and_get_one(self):
        """Test creating and retrieving a single document"""
        plant_data = {"phase": PHASES.ADULT, "cost": 25.50}

        plant = Plant.from_dict(plant_data)
        plant_id = Table.PLANT.create(plant)

        self.assertIsInstance(plant_id, ObjectId)

        retrieved_plant: Plant = Table.PLANT.get_one(str(plant_id))
        self.assertIsNotNone(retrieved_plant)
        self.assertEqual(retrieved_plant.cost, 25.50)

    def test_get_one_with_invalid_id(self):
        """Test getting a document with invalid ObjectId"""
        result = Table.PLANT.get_one("invalid_id")
        self.assertIsNone(result)

        result = Table.PLANT.get_one("123456789012345678901234")
        self.assertIsNone(result)

    def test_get_many(self):
        """Test retrieving multiple documents"""
        plants_data = [
            {"phase": PHASES.ADULT, "cost": 10.00, "size": 12},
            {"phase": PHASES.CUTTING, "cost": 20.00, "size": 8},
            {"phase": PHASES.SEED, "cost": 30.00, "size": 0},
        ]

        for data in plants_data:
            plant = Plant.from_dict(data)
            Table.PLANT.create(plant)

        all_plants = Table.PLANT.get_many()
        self.assertEqual(len(all_plants), 3)

        expensive_plants = Table.PLANT.get_many({"cost": {"$gte": 20}})
        self.assertEqual(len(expensive_plants), 2)

        limited_plants = Table.PLANT.get_many(limit=2)
        self.assertEqual(len(limited_plants), 2)

    def test_update(self):
        """Test updating a document"""
        plant = Plant.from_dict({"phase": PHASES.JUVY, "cost": 15.00})
        plant_id = Table.PLANT.create(plant)

        retrieved = Table.PLANT.get_one(str(plant_id))
        retrieved.phase = PHASES.ADULT
        retrieved.cost = 25.00

        success = Table.PLANT.update(str(plant_id), retrieved)
        self.assertTrue(success)

        updated = Table.PLANT.get_one(str(plant_id))
        self.assertEqual(updated.phase, PHASES.ADULT)
        self.assertEqual(updated.cost, 25.00)

    def test_upsert(self):
        """Test upserting a document"""
        new_id = ObjectId()

        plant = Plant.from_dict({"phase": PHASES.LEAF, "cost": 35.00})
        success = Table.PLANT.upsert(str(new_id), plant)
        self.assertTrue(success)

        retrieved = Table.PLANT.get_one(str(new_id))
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.phase, PHASES.LEAF)

        retrieved.cost = 45.00
        success = Table.PLANT.upsert(str(new_id), retrieved)
        self.assertTrue(success)

        updated = Table.PLANT.get_one(str(new_id))
        self.assertEqual(updated.cost, 45.00)

    def test_delete(self):
        """Test deleting a document"""
        plant = Plant.from_dict({"phase": PHASES.CUTTING, "cost": 10.00})
        plant_id = Table.PLANT.create(plant)

        self.assertIsNotNone(Table.PLANT.get_one(str(plant_id)))

        success = Table.PLANT.delete(str(plant_id))
        self.assertTrue(success)

        self.assertIsNone(Table.PLANT.get_one(str(plant_id)))

        success = Table.PLANT.delete(str(plant_id))
        self.assertFalse(success)

    def test_count(self):
        """Test counting documents"""
        self.assertEqual(Table.PLANT.count(), 0)

        for i in range(5):
            plant = Plant.from_dict({"phase": PHASES.ADULT, "cost": i * 10})
            Table.PLANT.create(plant)

        self.assertEqual(Table.PLANT.count(), 5)

        self.assertEqual(Table.PLANT.count({"cost": {"$gte": 20}}), 3)

    def test_banish(self):
        """Test banishing a document to history"""
        plant = Plant.from_dict({"phase": PHASES.ADULT, "cost": 50.00})
        plant_id = Table.PLANT.create(plant)

        success = Table.PLANT.banish(str(plant_id))
        self.assertTrue(success)

        self.assert_banished_correctly(Table.PLANT, plant_id)


class TestQuery(MongoTestCase):
    """Test the Query builder class"""

    def setUp(self):
        """Set up test data"""
        super().setUp()

        test_plants = [
            {"phase": PHASES.ADULT, "cost": 50.00, "location": "Window", "water_days": 7},
            {"phase": PHASES.CUTTING, "cost": 15.00, "location": "Shelf", "water_days": 14},
            {"phase": PHASES.JUVY, "cost": 25.00, "location": "Bathroom", "water_days": 3},
            {"phase": PHASES.ADULT, "cost": 35.00, "location": "Garden", "water_days": 2},
            {"phase": PHASES.LEAF, "cost": 10.00, "location": "Desk", "water_days": 10},
            {"phase": PHASES.SEED, "cost": 30.00, "location": "Window", "water_days": 4},
        ]

        for data in test_plants:
            plant = Plant.from_dict(data)
            Table.PLANT.create(plant)

    def test_filter_by(self):
        query = Query().filter_by(location="Window").build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 2)
        for plant in results:
            self.assertEqual(plant.location, "Window")

    def test_gt(self):
        query = Query().gt("cost", 30).build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 2)
        for plant in results:
            self.assertGreater(plant.cost, 30)

    def test_gte(self):
        query = Query().gte("cost", 30).build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 3)
        for plant in results:
            self.assertGreaterEqual(plant.cost, 30)

    def test_lt(self):
        query = Query().lt("water_days", 5).build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 3)
        for plant in results:
            self.assertLess(plant.water_days, 5)

    def test_lte(self):
        query = Query().lte("water_days", 4).build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 3)
        for plant in results:
            self.assertLessEqual(plant.water_days, 4)

    def test_in(self):
        query = Query().in_("location", ["Window", "Desk"]).build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 3)
        for plant in results:
            self.assertIn(plant.location, ["Window", "Desk"])

    def test_not_in(self):
        query = Query().not_in("location", ["Window", "Desk"]).build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 3)
        for plant in results:
            self.assertNotIn(plant.location, ["Window", "Desk"])

    def test_not_equal(self):
        query = Query().not_equal("location", "Window").build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 4)
        for plant in results:
            self.assertNotEqual(plant.location, "Window")

    def test_exists(self):
        plant = Plant.from_dict({"phase": PHASES.ADULT, "cost": 20.00})
        Table.PLANT.create(plant)

        query = Query().exists("location").build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 6)

        query = Query().exists("location", False).build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 1)

    def test_logical_and(self):
        query = (
            Query()
            .logical_and([{"cost": {"$gte": 25}}, {"water_days": {"$lte": 7}}])
            .build()
        )
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 4)

    def test_logical_or(self):
        query = (
            Query()
            .logical_or([{"cost": {"$gte": 40}}, {"water_days": {"$lte": 3}}])
            .build()
        )
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 3)

    def test_chained_conditions(self):
        query = Query().gte("cost", 20).lt("water_days", 10).build()
        results = Table.PLANT.get_many(query)
        self.assertEqual(len(results), 4)
        for plant in results:
            self.assertGreaterEqual(plant.cost, 20)
            self.assertLess(plant.water_days, 10)


class TestBanishAndHistory(MongoTestCase):

    def test_banish_moves_to_history(self):
        plant = Plant.from_dict({"phase": PHASES.ADULT, "cost": 100.00})
        plant_id = Table.PLANT.create(plant)

        self.assert_collection_count("plant", 1)
        self.assert_collection_count("plant", 0, use_history=True)

        success = Table.PLANT.banish(str(plant_id))
        self.assertTrue(success)

        self.assert_collection_count("plant", 0)
        self.assert_collection_count("plant", 1, use_history=True)

        hist_doc = self.assert_document_exists(
            "plant", {"_id": plant_id}, use_history=True
        )
        self.assertTrue(hist_doc["banished"])
        self.assertIsNotNone(hist_doc["banished_on"])

    def test_banish_nonexistent(self):
        fake_id = str(ObjectId())
        success = Table.PLANT.banish(fake_id)
        self.assertFalse(success)

    def test_multiple_banishments(self):
        ids = []
        for i in range(3):
            plant = Plant.from_dict({"phase": PHASES.ADULT})
            ids.append(Table.PLANT.create(plant))

        self.assert_collection_count("plant", 3)

        for plant_id in ids:
            Table.PLANT.banish(str(plant_id))

        self.assert_collection_count("plant", 0)
        self.assert_collection_count("plant", 3, use_history=True)