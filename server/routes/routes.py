from flask import Blueprint, request, jsonify
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, joinedload, contains_eager
from typing import Type, List, Callable, Any, Dict, Optional

from db import Session
from logger import logger

from models.model import ModelConfig


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
            item = self.model.from_request(request)
            with Session() as sess:
                sess.add(item)
                sess.commit()
                return jsonify(self.config.serialize(item)), 201
        except Exception as e:
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
    def register_custom_route(blueprint: Blueprint, route: str, methods: List[str], handler: Callable):
        blueprint.route(f'/{route}', methods=methods)(handler)
