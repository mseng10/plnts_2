from flask import Blueprint, request, jsonify
from typing import List, Callable, Type
from shared.db import Table
from shared.logger import logger
from models import FlexibleModel
from pydantic import ValidationError

# The custom PyObjectId class is no longer needed, as the new FlexibleModel
# has built-in ObjectId handling.

# The SCHEMA_REGISTRY is no longer needed. We will use the model class
# directly from the `Table` object (e.g., table.model_class).

# Read-only fields that should be excluded during create/update operations.
# Note: Pydantic offers more advanced ways to handle this (e.g., private fields),
# but this explicit filtering approach is clear and effective.
READ_ONLY_FIELDS = {"id", "created_at", "updated_at", "created_on", "updated_on"}

# Internal fields that should not be exposed to clients.
INTERNAL_FIELDS = {"container_id", "is_local", "url"}


class GenericCRUD:
    def __init__(self, table: "Table"):
        # The specific model class (e.g., User, Product) is now derived
        # directly from the `table` object.
        self.table: "Table" = table
        self.model_class: Type[FlexibleModel] = table.model_class

    def _filter_request_data(self, data: dict) -> dict:
        """Removes read-only and internal fields from incoming request data."""
        return {
            k: v
            for k, v in data.items()
            if k not in READ_ONLY_FIELDS and k not in INTERNAL_FIELDS
        }

    def get(self, id: str):
        """Fetches a single document by its ID."""
        try:
            item = self.table.get_one(id)
            if item is None:
                logger.warning(f"{self.model_class.__name__} with id '{id}' not found.")
                return jsonify({"error": "Not found"}), 404

            # The item from the DB is already a Pydantic model instance.
            # We serialize it directly to a JSON response.
            return jsonify(item.model_dump(mode="json"))

        except Exception as e:
            logger.error(f"Error in get({id}): {str(e)}")
            return jsonify({"error": "An internal error occurred"}), 500

    def get_many(self):
        """Fetches multiple documents."""
        try:
            items = self.table.get_many()
            # Serialize the list of model instances directly.
            return jsonify([item.model_dump(mode="json") for item in items])

        except Exception as e:
            logger.error(f"Error in get_many: {str(e)}")
            return jsonify({"error": "An internal error occurred"}), 500

    def create(self):
        """Creates a new document from request data."""
        try:
            # Use the model's built-in `from_request` classmethod.
            # This handles getting JSON/form data and initial parsing.
            item = self.model_class.from_request(request)

            # Filter out protected fields before saving.
            # We operate on the model's dict representation.
            item_dict = self._filter_request_data(item.to_dict())

            # Re-create the model instance from the filtered data to ensure
            # no protected fields are passed to the database layer.
            item_to_create = self.model_class.from_dict(item_dict)

            inserted_id = self.table.create(item_to_create)
            item_to_create.id = inserted_id

            return jsonify(item_to_create.model_dump(mode="json")), 201

        except ValidationError as e:
            logger.error(f"Validation error during create: {e.errors()}")
            return jsonify({"error": "Validation error", "details": e.errors()}), 400
        except Exception as e:
            logger.error(f"Error in create: {str(e)}")
            return jsonify({"error": "An internal error occurred"}), 500

    def update(self, id: str):
        """Updates an existing document."""
        try:
            update_data = request.get_json(silent=True) or request.form.to_dict()
            if not update_data:
                return jsonify({"error": "No JSON data provided"}), 400

            db_item = self.table.get_one(id)
            if not db_item:
                return jsonify({"error": "Not found"}), 404

            # Filter the incoming update data to remove protected fields.
            filtered_data = self._filter_request_data(update_data)

            # Use `model_copy` with `update` to create a new, validated instance
            # with the changes applied. This is a safe way to update.
            updated_item = db_item.model_copy(update=filtered_data)

            if not self.table.update(id, updated_item):
                return jsonify({"error": "Update failed"}), 400

            return jsonify(updated_item.model_dump(mode="json"))

        except ValidationError as e:
            logger.error(f"Validation error during update: {e.errors()}")
            return jsonify({"error": "Validation error", "details": e.errors()}), 400
        except Exception as e:
            logger.error(f"Error in update: {str(e)}")
            return jsonify({"error": "An internal error occurred"}), 500

    def delete(self, id: str):
        """Deletes a document."""
        try:
            if not self.table.get_one(id):
                return jsonify({"error": "Not found"}), 404

            self.table.delete(id)
            return "", 204

        except Exception as e:
            logger.error(f"Error in delete({id}): {str(e)}")
            return jsonify({"error": "An internal error occurred"}), 500

    # ... The banish and deprecate methods remain largely the same ...
    def banish(self, id: str):
        try:
            if not self.table.get_one(id):
                return jsonify({"error": "Not found"}), 404

            if not self.table.banish(id):
                return jsonify({"error": "Banish operation failed"}), 500
            return "", 204

        except Exception as e:
            logger.error(f"Error in banish({id}): {str(e)}")
            return jsonify({"error": "An internal error occurred"}), 500

    def deprecate(self, id: str):
        try:
            item = self.table.get_one(id)
            if not item:
                return jsonify({"error": "Not found"}), 404

            item.deprecate()

            if not self.table.update(id, item):
                return jsonify({"error": "Deprecation update failed"}), 500
            return "", 204

        except Exception as e:
            logger.error(f"Error in deprecate({id}): {str(e)}")
            return jsonify({"error": "An internal error occurred"}), 500


# The APIBuilder class does not require any changes, as the method signatures
# in GenericCRUD have been preserved.
class APIBuilder:
    @staticmethod
    def register_blueprint(
        blueprint: Blueprint,
        resource_name: str,
        crud: GenericCRUD,
        methods: List[str] = [
            "GET",
            "GET_MANY",
            "POST",
            "PATCH",
            "DELETE",
            "DELETE_MANY",
            "BANISH",
        ],
    ):
        def create_wrapper(operation):
            if operation in ["get", "update", "delete", "banish", "deprecate"]:

                def wrapper(id):
                    return getattr(crud, operation)(id)

            else:

                def wrapper():
                    return getattr(crud, operation)()

            wrapper.__name__ = f"{resource_name}_{operation}_wrapper"
            return wrapper

        if "GET" in methods:
            blueprint.route(f"/{resource_name}/<id>/", methods=["GET"])(
                create_wrapper("get")
            )
        if "GET_MANY" in methods:
            blueprint.route(f"/{resource_name}/", methods=["GET"])(
                create_wrapper("get_many")
            )
        if "POST" in methods:
            blueprint.route(f"/{resource_name}/", methods=["POST"])(
                create_wrapper("create")
            )
        if "PATCH" in methods:
            blueprint.route(f"/{resource_name}/<id>/", methods=["PATCH"])(
                create_wrapper("update")
            )
        if "DELETE" in methods:
            blueprint.route(f"/{resource_name}/<id>/", methods=["DELETE"])(
                create_wrapper("delete")
            )
        if "DEPRECATE" in methods:
            blueprint.route(f"/{resource_name}/<id>/deprecate/", methods=["POST"])(
                create_wrapper("deprecate")
            )
        if "BANISH" in methods:
            blueprint.route(f"/{resource_name}/<id>/banish/", methods=["DELETE"])(
                create_wrapper("banish")
            )
        if "DELETE_MANY" in methods:
            blueprint.route(f"/{resource_name}/", methods=["DELETE"])(
                create_wrapper("delete_many")
            )

    @staticmethod
    def register_custom_route(blueprint: Blueprint, route: str, methods: List[str]):
        """Custom route on this bp."""

        def decorator(handler: Callable):
            blueprint.route(route, methods=methods)(handler)
            return handler

        return decorator
