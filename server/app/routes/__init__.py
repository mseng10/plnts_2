from flask import Blueprint, request, jsonify
from typing import List, Callable, Type
from shared.logger import logger
from models import FlexibleModel
from enum import Enum

# @dataclass
# class FieldType:
#     """Configuration for each field stored on a model."""
#     read_only: bool = False
#     create_only: bool = False
#     internal_only: bool = False
#     nested: Optional['FieldType'] = None
#     nested_class: str = None
#     include_nested: bool = False
#     delete_with_parent: bool = False

# class Schema(Enum):

#     PLANT = {
#         '_id': FieldType(read_only=True),
#         'created_on': FieldType(read_only=True),
#         'updated_on': FieldType(read_only=True),
#         'cost': FieldType(),
#         'species_id': FieldType(),
#         'watered_on': FieldType(),
#         'watering': FieldType(),
#         'identity': FieldType(),
#         'phase': FieldType(),
#         'size': FieldType(),
#         'system_id': FieldType(),
#         'mix_id': FieldType(),
#         'deprecated': FieldType(),
#         'deprecated_on': FieldType(),
#         'deprecated_cause': FieldType()
#     }
#     PLANT_GENUS_TYPE = {
#         '_id': FieldType(read_only=True),
#         'created_on': FieldType(read_only=True),
#         'updated_on': FieldType(read_only=True),
#         'name': FieldType(read_only=True),
#         'common_name': FieldType(read_only=True),
#         'description': FieldType(read_only=True),
#         'genus_id': FieldType(read_only=True)
#     }
#     PLANT_GENUS = {
#         '_id': FieldType(read_only=True),
#         'created_on': FieldType(read_only=True),
#         'updated_on': FieldType(read_only=True),
#         'name': FieldType(read_only=True),
#         'common_name': FieldType(read_only=True),
#         'description': FieldType(read_only=True),
#         'watering': FieldType(),
#         'genus_type_id': FieldType(read_only=True)
#     }
#     SPECIES = {
#         '_id': FieldType(read_only=True),
#         'created_on': FieldType(read_only=True),
#         'updated_on': FieldType(read_only=True),
#         'name': FieldType(read_only=True),
#         'common_name': FieldType(read_only=True),
#         'description': FieldType(read_only=True),
#         'genus_id': FieldType(read_only=True)
#     }
#     TODO = {
#         '_id': FieldType(read_only=True),
#         'created_on': FieldType(read_only=True),
#         'updated_on': FieldType(read_only=True),
#         'due_on': FieldType(),
#         'name': FieldType(),
#         'description': FieldType(),
#         'tasks': FieldType(nested=True),
#         'deprecated': FieldType(),
#         'deprecated_on': FieldType(),
#         'deprecated_cause': FieldType(),
#         'tasks': FieldType(nested=True, nested_class='TASK')
#     }
#     TASK = {
#         'description': FieldType(),
#         'created_on': FieldType(read_only=True),
#         'updated_on': FieldType(read_only=True),
#     }
#     SOIL = {
#        '_id': FieldType(read_only=True),
#        'created_on': FieldType(read_only=True),
#        'name': FieldType(read_only=True),
#        'description': FieldType(read_only=True),
#        'group': FieldType(read_only=True)
#    }


#     """Standard model serializer with MongoDB support"""
#     def __init__(self, fields: Dict[str, FieldType]):
#         self.fields = fields

#     def serialize(self, obj, depth=0, include_nested=False) -> Dict[str, Any]:
#         if depth > 5:
#             return {}
        
#         result = {}
#         for k, v in self.fields.items():
#             if hasattr(obj, k):
#                 value = getattr(obj, k)
#                 # Handle ObjectId conversion
#                 if isinstance(value, ObjectId):
#                     result[k] = str(value)
#                 elif v.nested:
#                     nested_schema: Schema = getattr(Schema, v.nested)
#                     if isinstance(value, list):
#                         result[k] = [nested_schema.serialize(item, depth+1, include_nested) for item in value]
#                     elif value is not None:
#                         result[k] = nested_schema.serialize(value, depth+1, include_nested)
#                 elif not v.internal_only:
#                     result[k] = value
#         return result

#     def deserialize(self, data: Dict, is_create=False, depth=0) -> Dict[str, Any]:
#         if depth > 5:
#             return {}
        
#         result = {}
#         for k, v in data.items():
#             if k in self.fields:
#                 field_config = self.fields[k]
#                 if not field_config.read_only and (is_create or not field_config.create_only):
#                     if field_config.nested:
#                         nested_schema: Schema = getattr(Schema, v.nested)
#                         if isinstance(v, list):
#                             result[k] = [nested_schema.deserialize(item, is_create, depth+1) for item in v]
#                         elif v is not None:
#                             result[k] = nested_schema.deserialize(v, is_create, depth+1)
#                     elif not field_config.internal_only:
#                         result[k] = v
#         return result

class GenericCRUD:
    def __init__(self, model):
        self.model: Type[FlexibleModel] = model

    def get(self, id: str):        
        try:
            item = self.model.table.get_one(id) # Not a huge fan of this, maybe revisit
            if item is None:
                logger.error(f"Could not find {id}")
                return jsonify({"error": "Not found"}), 404
            data_model = self.model(**item)
            return jsonify(data_model.to_dict())
        except Exception as e:
            logger.error(f"Error in get: {str(e)}")
            return jsonify({"error": str(e)}), 500

    def get_many(self):
        try:
            items = self.model.table.get_many({})

            return jsonify([
               self.model(**item).to_dict()
                for item in items
            ])
        except Exception as e:
            logger.error(f"Error in get_many: {str(e)}")
            return jsonify({"error": str(e)}), 500

    def create(self):
        try:
            item = self.model(**request.json)
            result = self.model.table.create(item.to_dict())
            item._id = result

            return jsonify(item.to_dict()), 201

        except Exception as e:
            logger.error(f"Error in create: {str(e)}")
            return jsonify({"error": str(e)}), 400

    def update(self, id: str):
        try:
            item = self.model(**request.json)
            result = self.model.table.update(id, item.to_dict()) # should probably be to flattened json
            
            if not result:
                return jsonify({"error": "Not found"}), 404

            updated_item = self.model.table.get_one(id)
            return jsonify(self.model(**updated_item).to_dict())

        except Exception as e:
            logger.error(f"Error in update: {str(e)}")
            return jsonify({"error": str(e)}), 400

    def delete(self, id: str):
        try:
            # TODO: Double dipping here
            item = self.model.table.get_one(id)
            if not item:
                return jsonify({"error": "Not found"}), 404
            
            self.model.table.delete(id)
            return '', 204

        except Exception as e:
            logger.error(f"Error in delete: {str(e)}")
            return jsonify({"error": str(e)}), 500

    def delete_many(self):
        data = request.json
        ids = data.get('ids', [])

        if not ids:
            return jsonify({'error': 'No ids provided'}), 400

        try:            
            deleted_count = 0
            for id in ids:
                result = self.model.table.delete(id)
                if result:
                    deleted_count+=1
            return jsonify({
                'message': f'Successfully deleted {deleted_count} items'}), 200

        except Exception as e:
            logger.error(f"Error in delete_many: {str(e)}")
            return jsonify({'error': str(e)}), 500


class APIBuilder:
    @staticmethod
    def register_resource(
        blueprint: Blueprint, 
        resource_name: str, 
        crud: GenericCRUD,
        methods: List[str] = ['GET', 'GET_MANY', 'POST', 'PATCH', 'DELETE', 'DELETE_MANY']
    ):
        def create_wrapper(operation):
            if operation in ['get', 'update', 'delete']:
                def wrapper(id):
                    return getattr(crud, operation)(id)
            else:
                def wrapper():
                    return getattr(crud, operation)()
            wrapper.__name__ = f"{resource_name}_{operation}_wrapper"
            return wrapper

        if 'GET' in methods:
            blueprint.route(f'/{resource_name}/<id>/', methods=['GET'])(create_wrapper('get'))
        if 'GET_MANY' in methods:
            blueprint.route(f'/{resource_name}/', methods=['GET'])(create_wrapper('get_many'))
        if 'POST' in methods:
            blueprint.route(f'/{resource_name}/', methods=['POST'])(create_wrapper('create'))
        if 'PATCH' in methods:
            blueprint.route(f'/{resource_name}/<id>/', methods=['PATCH'])(create_wrapper('update'))
        if 'DELETE' in methods:
            blueprint.route(f'/{resource_name}/<id>/', methods=['DELETE'])(create_wrapper('delete'))
        if 'DELETE_MANY' in methods:
            blueprint.route(f'/{resource_name}/', methods=['DELETE'])(create_wrapper('delete_many'))

    @staticmethod
    def register_custom_route(blueprint: Blueprint, route: str, methods: List[str]):
        """Custom route on this bp."""
        def decorator(handler: Callable):
            blueprint.route(f'/{route}', methods=methods)(handler)
            return handler
        return decorator