"""
Reusable MongoDB test utility using the updated database module
Supports both testcontainers and real MongoDB instance for testing
"""

import unittest
import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import time
import shared.db
from testcontainers.mongodb import MongoDbContainer


class MongoTestCase(unittest.TestCase):
    """Base test class that provides MongoDB testing with multiple strategies"""

    @classmethod
    def setUpClass(cls):
        """Set up MongoDB for testing using available methods"""
        cls.mongo_container = None
        cls.using_container = False

        # Try to use testcontainers first
        try:
            cls.mongo_container = MongoDbContainer("mongo:5.0")
            cls.mongo_container.start()
            cls.mongo_url = cls.mongo_container.get_connection_url()
            cls.using_container = True
            print(f"Using testcontainer MongoDB at {cls.mongo_url}")
        except Exception as e:
            print(f"Testcontainer failed, falling back to existing MongoDB: {e}")
            cls.mongo_container = None

            # Fallback to existing MongoDB instance
            test_url = os.getenv(
                "MONGODB_TEST_URL", "mongodb://admin:password123@localhost:27017"
            )

            try:
                # Test if we can connect to existing MongoDB
                test_client = MongoClient(test_url, serverSelectionTimeoutMS=2000)
                test_client.admin.command("ping")
                test_client.close()
                cls.mongo_url = test_url
                print(f"Using existing MongoDB at {cls.mongo_url}")
            except (ConnectionFailure, Exception) as e:
                raise unittest.SkipTest(
                    f"No MongoDB available for testing. Install Docker for testcontainers or start MongoDB locally. Error: {e}"
                )

        # Initialize the database configuration with test settings
        cls.db_config = shared.db.initialize_database(
            mongodb_url=cls.mongo_url,
            mongodb_url_hist=cls.mongo_url,  # Use same instance for history
            db_name="plnts_test",
            hist_db_name="plnts_test_hist",
        )

        # Wait a moment for setup to complete
        time.sleep(0.5)

        # Test the connection
        try:
            cls.db_config.client.admin.command("ping")
            print(f"Successfully connected to test MongoDB")
        except Exception as e:
            print(f"Failed to connect to test MongoDB: {e}")
            raise

    @classmethod
    def tearDownClass(cls):
        """Clean up MongoDB connections and containers"""
        # Close database connections
        if hasattr(cls, "db_config") and cls.db_config:
            cls.db_config.close_connections()

        # Stop container if we started one
        if cls.using_container and cls.mongo_container:
            try:
                cls.mongo_container.stop()
            except Exception as e:
                print(f"Error stopping container: {e}")

    def setUp(self):
        """Clear database before each test"""
        # Clear main database collections
        for collection_name in self.db_config.db.list_collection_names():
            self.db_config.db.drop_collection(collection_name)

        # Clear history database collections
        for collection_name in self.db_config.hist.list_collection_names():
            self.db_config.hist.drop_collection(collection_name)

    def get_collection_data(self, collection_name, use_history=False):
        """
        Helper to get all data from a collection

        Args:
            collection_name: Name of the collection
            use_history: If True, get data from history database
        """
        db = self.db_config.hist if use_history else self.db_config.db
        return list(db[collection_name].find({}))

    def assert_collection_count(
        self, collection_name, expected_count, use_history=False
    ):
        """
        Helper to assert collection document count

        Args:
            collection_name: Name of the collection
            expected_count: Expected number of documents
            use_history: If True, check history database
        """
        db = self.db_config.hist if use_history else self.db_config.db
        actual_count = db[collection_name].count_documents({})
        db_type = "history" if use_history else "main"
        self.assertEqual(
            actual_count,
            expected_count,
            f"Expected {expected_count} documents in {db_type}.{collection_name}, found {actual_count}",
        )

    def assert_document_exists(self, collection_name, query, use_history=False):
        """
        Helper to assert a document exists in collection

        Args:
            collection_name: Name of the collection
            query: MongoDB query dictionary
            use_history: If True, search in history database
        """
        db = self.db_config.hist if use_history else self.db_config.db
        doc = db[collection_name].find_one(query)
        db_type = "history" if use_history else "main"
        self.assertIsNotNone(
            doc, f"Document matching {query} not found in {db_type}.{collection_name}"
        )
        return doc

    def assert_document_not_exists(self, collection_name, query, use_history=False):
        """
        Helper to assert a document does not exist in collection

        Args:
            collection_name: Name of the collection
            query: MongoDB query dictionary
            use_history: If True, search in history database
        """
        db = self.db_config.hist if use_history else self.db_config.db
        doc = db[collection_name].find_one(query)
        db_type = "history" if use_history else "main"
        self.assertIsNone(
            doc,
            f"Document matching {query} unexpectedly found in {db_type}.{collection_name}",
        )

    def get_test_db_config(self):
        """
        Get the current test database configuration

        Returns:
            DatabaseConfig: The test database configuration
        """
        return self.db_config

    def create_test_data_with_table(self, table_enum, data_dict):
        """
        Helper to create test data using Table enum

        Args:
            table_enum: A Table enum value (e.g., Table.PLANT)
            data_dict: Dictionary of data to create the model

        Returns:
            ObjectId: The inserted document's ID
        """
        model_instance = table_enum.model_class.from_dict(data_dict)
        return table_enum.create(model_instance)

    def get_test_data_with_table(self, table_enum, object_id):
        """
        Helper to retrieve test data using Table enum

        Args:
            table_enum: A Table enum value (e.g., Table.PLANT)
            object_id: The ObjectId or string ID to retrieve

        Returns:
            FlexibleModel: The retrieved model instance or None
        """
        return table_enum.get_one(str(object_id))

    def assert_banished_correctly(self, table_enum, object_id):
        """
        Assert that an object was banished correctly (removed from main, added to history)

        Args:
            table_enum: Table enum to check
            object_id: ID of the banished object
        """
        # Should not exist in main database
        main_doc = table_enum.get_one(str(object_id))
        self.assertIsNone(
            main_doc, f"Document {object_id} still exists in main database"
        )

        # Should exist in history database
        hist_doc = self.assert_document_exists(
            table_enum.table_name,
            {"_id": shared.db.ObjectId(str(object_id))},
            use_history=True,
        )

        # Should have banished fields set
        self.assertTrue(
            hist_doc.get("banished", False), "Document not marked as banished"
        )
        self.assertIsNotNone(
            hist_doc.get("banished_on"), "Document missing banished_on timestamp"
        )

        return hist_doc


class DatabaseTestMixin:
    """Mixin class providing additional database testing utilities"""

    def assert_model_fields_equal(self, model1, model2, exclude_fields=None):
        """
        Assert that two model instances have equal field values

        Args:
            model1: First model instance
            model2: Second model instance
            exclude_fields: List of field names to exclude from comparison
        """
        exclude_fields = exclude_fields or ["id", "created_on", "updated_on"]

        dict1 = model1.to_dict()
        dict2 = model2.to_dict()

        for field in exclude_fields:
            dict1.pop(field, None)
            dict2.pop(field, None)

        self.assertEqual(dict1, dict2, "Model instances are not equal")


class MongoTestCaseWithoutContainer(unittest.TestCase):
    """
    Alternative test base class that only uses existing MongoDB instance.
    Useful for CI/CD environments where Docker might not be available.
    """

    @classmethod
    def setUpClass(cls):
        """Set up MongoDB connection to existing instance only"""
        # Get MongoDB URL from environment or use default
        test_url = os.getenv(
            "MONGODB_TEST_URL", "mongodb://admin:password123@localhost:27017"
        )

        try:
            # Test if we can connect to existing MongoDB
            test_client = MongoClient(test_url, serverSelectionTimeoutMS=2000)
            test_client.admin.command("ping")
            test_client.close()
            cls.mongo_url = test_url
            print(f"Using existing MongoDB at {cls.mongo_url}")
        except (ConnectionFailure, Exception) as e:
            raise unittest.SkipTest(
                f"No MongoDB available for testing. Please start MongoDB locally. Error: {e}"
            )

        # Initialize the database configuration with test settings
        cls.db_config = shared.db.initialize_database(
            mongodb_url=cls.mongo_url,
            mongodb_url_hist=cls.mongo_url,  # Use same instance for history
            db_name="plnts_test",
            hist_db_name="plnts_test_hist",
        )

        # Test the connection
        try:
            cls.db_config.client.admin.command("ping")
            print(f"Successfully connected to test MongoDB")
        except Exception as e:
            print(f"Failed to connect to test MongoDB: {e}")
            raise

    @classmethod
    def tearDownClass(cls):
        """Clean up MongoDB connections"""
        if hasattr(cls, "db_config") and cls.db_config:
            cls.db_config.close_connections()

    def setUp(self):
        """Clear database before each test"""
        # Clear main database collections
        for collection_name in self.db_config.db.list_collection_names():
            self.db_config.db.drop_collection(collection_name)

        # Clear history database collections
        for collection_name in self.db_config.hist.list_collection_names():
            self.db_config.hist.drop_collection(collection_name)

    # Include all the same helper methods from MongoTestCase
    def get_collection_data(self, collection_name, use_history=False):
        """Helper to get all data from a collection"""
        db = self.db_config.hist if use_history else self.db_config.db
        return list(db[collection_name].find({}))

    def assert_collection_count(
        self, collection_name, expected_count, use_history=False
    ):
        """Helper to assert collection document count"""
        db = self.db_config.hist if use_history else self.db_config.db
        actual_count = db[collection_name].count_documents({})
        db_type = "history" if use_history else "main"
        self.assertEqual(
            actual_count,
            expected_count,
            f"Expected {expected_count} documents in {db_type}.{collection_name}, found {actual_count}",
        )

    def assert_document_exists(self, collection_name, query, use_history=False):
        """Helper to assert a document exists in collection"""
        db = self.db_config.hist if use_history else self.db_config.db
        doc = db[collection_name].find_one(query)
        db_type = "history" if use_history else "main"
        self.assertIsNotNone(
            doc, f"Document matching {query} not found in {db_type}.{collection_name}"
        )
        return doc

    def assert_document_not_exists(self, collection_name, query, use_history=False):
        """Helper to assert a document does not exist in collection"""
        db = self.db_config.hist if use_history else self.db_config.db
        doc = db[collection_name].find_one(query)
        db_type = "history" if use_history else "main"
        self.assertIsNone(
            doc,
            f"Document matching {query} unexpectedly found in {db_type}.{collection_name}",
        )

    def get_test_db_config(self):
        """Get the current test database configuration"""
        return self.db_config

    def create_test_data_with_table(self, table_enum, data_dict):
        """Helper to create test data using Table enum"""
        model_instance = table_enum.model_class.from_dict(data_dict)
        return table_enum.create(model_instance)

    def get_test_data_with_table(self, table_enum, object_id):
        """Helper to retrieve test data using Table enum"""
        return table_enum.get_one(str(object_id))

    def assert_banished_correctly(self, table_enum, object_id):
        """Assert that an object was banished correctly"""
        main_doc = table_enum.get_one(str(object_id))
        self.assertIsNone(
            main_doc, f"Document {object_id} still exists in main database"
        )

        hist_doc = self.assert_document_exists(
            table_enum.table_name,
            {"_id": shared.db.ObjectId(str(object_id))},
            use_history=True,
        )

        self.assertTrue(
            hist_doc.get("banished", False), "Document not marked as banished"
        )
        self.assertIsNotNone(
            hist_doc.get("banished_on"), "Document missing banished_on timestamp"
        )

        return hist_doc
