from flask import Blueprint, request, jsonify
from sqlalchemy.orm import sessionmaker, declarative_base, joinedload, contains_eager
from typing import Type, List, Callable, Any, Dict, Optional

from shared.db import Session
from shared.logger import logger

from models import ModelConfig


class GenericCRUD:
    def __init__(self, model, config: ModelConfig):
        self.model = model
        self.config = config

    def get(self, id: Any):
        include_nested = request.args.get('include_nested', 'false').lower() == 'true'
        with Session() as sess:
            query = sess.query(self.model)
            if include_nested:
                for field, config in self.config.fields.items():
                    if config.nested and config.include_nested:
                        relationship_attr = getattr(self.model, field)
                        query = query.options(joinedload(relationship_attr))
            item = query.get(id)
            if item is None:
                return jsonify({"error": "Not found"}), 404
            return jsonify(self.config.serialize(item, include_nested=include_nested))

    def get_many(self):
        include_nested = request.args.get('include_nested', 'false').lower() == 'true'

        with Session() as sess:
            query = sess.query(self.model)

            print(query)

            if include_nested:
                for field, config in self.config.fields.items():
                    if config.nested and config.include_nested:
                        relationship_attr = getattr(self.model, field)
                        query = query.outerjoin(relationship_attr).options(contains_eager(relationship_attr))

            for field, config in self.config.fields.items():
                if field in request.args:
                    query = query.filter(getattr(self.model, field) == request.args[field])

            items = query.all()
            print(f"matttt - {len(items)}")
            ret = [self.config.serialize(item, include_nested=include_nested) for item in items]
            return jsonify(ret)

    def create(self):
        try:
            # Deserialize the input data
            data = self.config.deserialize(request.json, is_create=True)
            
            with Session() as sess:
                # Create the main object
                item = self.model()
                
                nested_creations = []
                for key, value in data.items():
                    if key in self.config.fields:
                        field_config = self.config.fields[key]
                        if field_config.nested:
                            nested_creations.append((field_config, value))
                        else:
                            setattr(item, key, value)
                
                sess.add(item)
                sess.commit()
                for field_config, nested_creation in nested_creations:
                    if isinstance(nested_creation, list):
                        # Handle list of nested objects
                        for nested_data in value:
                            nested_item = field_config.nested_class()
                            for nested_key, nested_value in nested_data.items():
                                setattr(nested_item, nested_key, nested_value)
                            setattr(nested_item, field_config.nested_identifier, item.id)
                            sess.add(nested_item)
                    elif isinstance(nested_creation, dict):
                        nested_item = field_config.nested_class()
                        for nested_key, nested_value in nested_creation.items():
                            setattr(nested_item, nested_key, nested_value)
                        setattr(nested_item, field_config.nested_identifier, item.id)
                        sess.add(nested_item)


                sess.commit()
                
                # Refresh the item to ensure all relationships are loaded
                sess.refresh(item)
                
                return jsonify(self.config.serialize(item, include_nested=True)), 201
        except Exception as e:
            print(f"Error in create: {str(e)}")
            return jsonify({"error": str(e)}), 400

    def update(self, id: Any):
        with Session() as sess:
            item = sess.query(self.model).get(id)
            if item is None:
                return jsonify({"error": "Not found"}), 404
            try:
                update_data = self.model.from_request(request)
                for key, value in self.config.deserialize(self.config.serialize(update_data)).items():
                    setattr(item, key, value)
                sess.commit()
                return jsonify(self.config.serialize(item))
            except Exception as e:
                sess.rollback()
                return jsonify({"error": str(e)}), 400

    def delete(self, id: Any):
        with Session() as sess:
            item = sess.query(self.model).get(id)
            if item is None:
                return jsonify({"error": "Not found"}), 404

            # Handle nested deletions
            for field_name, field_config in self.config.fields.items():
                if field_config.nested and field_config.delete_with_parent:
                    nested_items = getattr(item, field_name)
                    if nested_items is not None:
                        if isinstance(nested_items, list):
                            for nested_item in nested_items:
                                sess.delete(nested_item)
                        else:
                            sess.delete(nested_items)

            sess.delete(item)
            sess.commit()
            return '', 204

    def delete_many(self, ids: List[Any], cause: str):
        with Session() as sess:
            deleted_count = 0
            for id in ids:
                item = sess.query(self.model).get(id)
                if item is None:
                    logger.info(f"Could not find {self.model} with id: {id}")
                    continue  # Skip if item not found

                # Handle nested deletions
                for field_name, field_config in self.config.fields.items():
                    if field_config.nested and field_config.delete_with_parent:
                        nested_items = getattr(item, field_name)
                        if nested_items is not None:
                            if isinstance(nested_items, list):
                                for nested_item in nested_items:
                                    sess.delete(nested_item)
                            else:
                                sess.delete(nested_items)

                sess.delete(item)
                deleted_count += 1

            sess.commit()
        return deleted_count

    def delete_many(self):
        data = request.json
        ids = data.get('ids', [])
        cause = data.get('cause', '')

        if not ids:
            return jsonify({'error': 'No ids provided'}), 400
        
        if not cause:
            logger.info("No cause specified for delete many")

        try:
            model_instance = YourModelClass()  # Replace with your actual model instance
            deleted_count = model_instance.delete_many(ids, cause)
            return jsonify({'message': f'Successfully deleted {deleted_count} items', 'cause': cause}), 200
        except Exception as e:
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
            blueprint.route(f'/{resource_name}/<int:id>/', methods=['GET'])(create_wrapper('get'))
        if 'GET_MANY' in methods:
            blueprint.route(f'/{resource_name}/', methods=['GET'])(create_wrapper('get_many'))
        if 'POST' in methods:
            blueprint.route(f'/{resource_name}/', methods=['POST'])(create_wrapper('create'))
        if 'PATCH' in methods:
            blueprint.route(f'/{resource_name}/<int:id>/', methods=['PATCH'])(create_wrapper('update'))
        if 'DELETE' in methods:
            blueprint.route(f'/{resource_name}/<int:id>/', methods=['DELETE'])(create_wrapper('delete'))
        if 'DELETE_MANY' in methods:
            blueprint.route(f'/{resource_name}/<int:id>/', methods=['DELETE'])(create_wrapper('delete_many'))

    @staticmethod
    def register_custom_route(blueprint: Blueprint, route: str, methods: List[str]):
        """ Custom route on this bp. """
        def decorator(handler: Callable):
            blueprint.route(f'/{route}', methods=methods)(handler)
            return handler
        
        # This allows the method to be used both as a decorator and a regular method
        return decorator
