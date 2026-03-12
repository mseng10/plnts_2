from flask import Blueprint
from shared.db import Table
from routes import GenericCRUD, APIBuilder

inventory_bp = Blueprint("inventory", __name__)
inventory_type_bp = Blueprint("inventory_type", __name__)

# Register CRUD endpoints for Inventory Items
# Endpoints: GET /inventory/, POST /inventory/, GET /inventory/<id>/, etc.
APIBuilder.register_blueprint(
    inventory_bp, "inventory", GenericCRUD(Table.INVENTORY_ITEM)
)

# Register CRUD endpoints for Inventory Types
# Endpoints: GET /inventory_types/, POST /inventory_types/, etc.
APIBuilder.register_blueprint(
    inventory_type_bp, "inventory_types", GenericCRUD(Table.INVENTORY_TYPE)
)