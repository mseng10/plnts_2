from flask import Blueprint, request, jsonify
from typing import List, Callable, Type, Dict, Optional, Any
from shared.logger import logger
from models import FlexibleModel, DeprecatableMixin
from enum import Enum
from dataclasses import dataclass
from bson import ObjectId
from shared.db import Table


@dataclass
class SchemaField:
    """Configuration for each field stored on a model."""

    read_only: bool = False
    internal_only: bool = False
    nested: Optional["SchemaField"] = None
    nested_schema: str = None
    nested_class: object = None


class Schema(Enum):
    PLANT = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "cost": SchemaField(),
        "species_id": SchemaField(),
        "watered_on": SchemaField(),
        "watering": SchemaField(),
        "identity": SchemaField(),
        "phase": SchemaField(),
        "size": SchemaField(),
        "system_id": SchemaField(),
        "mix_id": SchemaField(),
        "deprecated": SchemaField(),
        "deprecated_on": SchemaField(),
        "deprecated_cause": SchemaField(),
        "batch": SchemaField(),
        "batch_count": SchemaField(),
    }
    PLANT_GENUS_TYPE = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "name": SchemaField(read_only=True),
        "common_name": SchemaField(read_only=True),
        "description": SchemaField(read_only=True),
        "genus_id": SchemaField(read_only=True),
    }
    PLANT_GENUS = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "name": SchemaField(read_only=True),
        "common_name": SchemaField(read_only=True),
        "description": SchemaField(read_only=True),
        "watering": SchemaField(),
        "genus_type_id": SchemaField(read_only=True),
    }
    SPECIES = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "name": SchemaField(read_only=True),
        "common_name": SchemaField(read_only=True),
        "description": SchemaField(read_only=True),
        "genus_id": SchemaField(read_only=True),
    }
    TODO = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "due_on": SchemaField(),
        "name": SchemaField(),
        "description": SchemaField(),
        "tasks": SchemaField(nested=True),
        "deprecated": SchemaField(),
        "deprecated_on": SchemaField(),
        "deprecated_cause": SchemaField(),
        "tasks": SchemaField(nested=True, nested_schema="TASK"),
    }
    TASK = {
        "id": SchemaField(read_only=True),
        "description": SchemaField(),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "resolved": SchemaField(),
        "resolved_on": SchemaField(),
    }
    SOIL = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "name": SchemaField(read_only=True),
        "description": SchemaField(read_only=True),
        "group": SchemaField(read_only=True),
    }
    LIGHT = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "name": SchemaField(),
        "cost": SchemaField(),
        "system_id": SchemaField(),
        "deprecated": SchemaField(),
        "deprecated_on": SchemaField(),
        "deprecated_cause": SchemaField(),
    }
    SYSTEM = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "last_humidity": SchemaField(read_only=True),
        "last_temperature": SchemaField(read_only=True),
        "container_id": SchemaField(internal_only=True),
        "is_local": SchemaField(internal_only=True),
        "url": SchemaField(internal_only=True),
        "name": SchemaField(),
        "description": SchemaField(),
        "target_humidity": SchemaField(),
        "target_temperature": SchemaField(),
        "duration": SchemaField(),
        "distance": SchemaField(),
        "deprecated": SchemaField(),
        "deprecated_on": SchemaField(),
        "deprecated_cause": SchemaField(),
    }
    ALERT = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "alert_type": SchemaField(read_only=True),
        "model_id": SchemaField(read_only=True),
    }
    MIX = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "name": SchemaField(),
        "description": SchemaField(),
        "experimental": SchemaField(),
        "soil_parts": SchemaField(nested=True, nested_schema="SOIL_PART"),
        "deprecated": SchemaField(),
        "deprecated_on": SchemaField(),
        "deprecated_cause": SchemaField(),
    }
    SOIL_PART = {
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "soil_id": SchemaField(),
        "parts": SchemaField(),
        "id": SchemaField(read_only=True),
    }
    EXPENSE = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "deprecated": SchemaField(),
        "deprecated_on": SchemaField(),
        "deprecated_cause": SchemaField(),
        "cost": SchemaField(),
        "name": SchemaField(),
        "category": SchemaField()
    }
    BUDGET = {
        "id": SchemaField(read_only=True),
        "created_on": SchemaField(read_only=True),
        "updated_on": SchemaField(read_only=True),
        "deprecated": SchemaField(),
        "deprecated_on": SchemaField(),
        "deprecated_cause": SchemaField(),
        "budget": SchemaField(),
        "month": SchemaField()
    }

    """Standard model serializer with MongoDB support"""

    def __init__(self, fields: Dict[str, SchemaField]):
        self.fields = fields

    def read(self, obj: FlexibleModel, depth=0) -> Dict[str, Any]:
        """Read a flexible model and serialize it for the client."""
        if depth > 5:
            return {}

        result = {}
        for k, v in self.fields.items():
            if hasattr(obj, k):
                value = getattr(obj, k)
                if isinstance(value, ObjectId):
                    result[k] = str(value)
                elif v.nested:
                    nested_schema: Schema = getattr(Schema, v.nested_schema)
                    if isinstance(value, list):
                        result[k] = [
                            nested_schema.read(item, depth + 1) for item in value
                        ]
                    elif value is not None:
                        result[k] = nested_schema.read(value, depth + 1)
                elif not v.internal_only:
                    result[k] = value
        return result

    def patch(self, model: FlexibleModel, data: Dict[str, Any], depth=0):
        """Patch a flexible model with json data from another."""
        if depth > 5:
            return model

        for field_name, new_value in data.items():
            if field_name not in self.fields:
                continue

            field_config: SchemaField = self.fields[field_name]
            if field_config.nested and not field_config.internal_only:
                nested_schema: Schema = getattr(Schema, field_config.nested_schema)

                if isinstance(new_value, list):
                    # Handle list of nested objects
                    current_value = getattr(model, field_name, [])
                    setattr(
                        model,
                        field_name,
                        [
                            (
                                nested_schema.patch(current_item, new_item, depth + 1)
                                if current_item is not None
                                else nested_schema.patch(None, new_item, depth + 1)
                            )
                            for current_item, new_item in zip(current_value, new_value)
                        ],
                    )
                elif new_value is not None:
                    # Handle single nested object
                    current_value = getattr(model, field_name)
                    setattr(
                        model,
                        field_name,
                        (
                            nested_schema.patch(current_value, new_value, depth + 1)
                            if current_value is not None
                            else nested_schema.patch(None, new_value, depth + 1)
                        ),
                    )
            elif not field_config.internal_only:
                new_value_formatted = new_value
                if isinstance(new_value_formatted, ObjectId):
                    new_value_formatted = str(new_value_formatted)

                setattr(model, field_name, new_value_formatted)

    def create(self, model_clazz: Type[FlexibleModel], data: Dict[str, Any]):
        """Create a model from json from the client."""
        return model_clazz(**data)


class GenericCRUD:
    def __init__(self, table: Table, schema: Schema):
        self.table: Table = table
        self.schema: Schema = schema

    def get(self, id: str):
        try:
            item = self.table.get_one(id)  # Not a huge fan of this, maybe revisit
            if item is None:
                logger.error(f"Could not find {id}")
                return jsonify({"error": "Not found"}), 404

            return jsonify(self.schema.read(item))
        except Exception as e:
            logger.error(f"Error in get: {str(e)}")
            return jsonify({"error": str(e)}), 500

    def get_many(self):
        try:
            items = self.table.get_many()
            return jsonify([self.schema.read(item) for item in items])
        except Exception as e:
            logger.error(f"Error in get_many: {str(e)}")
            return jsonify({"error": str(e)}), 500

    def create(self):
        try:
            item: FlexibleModel = self.schema.create(
                self.table.model_class, request.json
            )

            result = self.table.create(item)
            item.id = result

            return jsonify(self.schema.read(item)), 201

        except Exception as e:
            logger.error(f"Error in create: {str(e)}")
            return jsonify({"error": str(e)}), 400

    def update(self, id: str):
        try:
            db_model = self.table.get_one(id)
            if not db_model:
                return jsonify({"error": "Not found"}), 404

            self.schema.patch(db_model, request.json)

            if not self.table.update(id, db_model):
                return jsonify({"error": str("")}), 400

            return self.schema.read(db_model)

        except Exception as e:
            logger.error(f"Error in update: {str(e)}")
            return jsonify({"error": str(e)}), 400

    def delete(self, id: str):
        try:
            # TODO: Double dipping here
            item = self.table.get_one(id)
            if not item:
                return jsonify({"error": "Not found"}), 404

            self.table.delete(id)
            return "", 204

        except Exception as e:
            logger.error(f"Error in delete: {str(e)}")
            return jsonify({"error": str(e)}), 500

    def banish(self, id: str):
        try:
            item = self.table.get_one(id)
            if not item:
                return jsonify({"error": "Not found"}), 404

            if not self.table.banish(id):
                return jsonify({"error": "Unknown, fix it"}), 404
            return "", 201

        except Exception as e:
            logger.error(f"Error in delete: {str(e)}")
            return jsonify({"error": str(e)}), 500

    def deprecate(self):
        try:
            item = self.table.get_one(id)
            if not item:
                return jsonify({"error": "Not found"}), 404
            elif not isinstance(item, DeprecatableMixin):
                return jsonify({"error": "Not found"}), 400

            item.deprecate()

            self.table.deprecate(item)  # Yes an update
            return "", 201

        except Exception as e:
            logger.error(f"Error in delete: {str(e)}")
            return jsonify({"error": str(e)}), 500


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
            if operation in ["get", "update", "delete", "banish"]:

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
            blueprint.route(f"/{resource_name}/<id>/", methods=["DELETE"])(
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
