from flask import Blueprint, request, jsonify
from sqlalchemy.orm import sessionmaker, declarative_base, joinedload, contains_eager
from typing import Type, List, Callable, Any, Dict, Optional

from db import Session
from logger import logger

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
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        sort_by = request.args.get('sort_by', 'id')
        sort_order = request.args.get('sort_order', 'asc')
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
                if config.filterable and field in request.args:
                    query = query.filter(getattr(self.model, field) == request.args[field])

            if sort_by in self.config.fields and self.config.fields[sort_by].sortable:
                column = getattr(self.model, sort_by)
                if sort_order == 'desc':
                    column = column.desc()
                query = query.order_by(column)

            total = query.count()
            items = query.offset((page - 1) * per_page).limit(per_page).all()
            return jsonify({
                'items': [self.config.serialize(item, include_nested=include_nested) for item in items],
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page
            })

    def create(self):
        try:
            # Deserialize the input data
            data = self.config.deserialize(request.json, is_create=True)
            
            with Session() as sess:
                # Create the main object
                item = self.model()
                
                for key, value in data.items():
                    if key in self.config.fields:
                        field_config = self.config.fields[key]
                        if field_config.nested:
                            if isinstance(value, list):
                                # Handle list of nested objects
                                nested_items = []
                                for nested_data in value:
                                    nested_item = field_config.nested.model()
                                    for nested_key, nested_value in nested_data.items():
                                        setattr(nested_item, nested_key, nested_value)
                                    nested_items.append(nested_item)
                                setattr(item, key, nested_items)
                            elif isinstance(value, dict):
                                # Handle single nested object
                                nested_item = field_config.nested.model()
                                for nested_key, nested_value in value.items():
                                    setattr(nested_item, nested_key, nested_value)
                                setattr(item, key, nested_item)
                        else:
                            setattr(item, key, value)
                
                sess.add(item)
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

class APIBuilder:
    @staticmethod
    def register_resource(
        blueprint: Blueprint, 
        resource_name: str, 
        crud: GenericCRUD,
        methods: List[str] = ['GET', 'GET_MANY', 'POST', 'PATCH', 'DELETE']
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

    @staticmethod
    def register_custom_route(blueprint: Blueprint, route: str, methods: List[str]):
        def decorator(handler: Callable):
            blueprint.route(f'/{route}', methods=methods)(handler)
            return handler
        
        # This allows the method to be used both as a decorator and a regular method
        return decorator
