from flask import Blueprint

from shared.db import Table
from routes import GenericCRUD, APIBuilder, Schema

expense_bp = Blueprint("expense", __name__)
expense_crud = GenericCRUD(Table.EXPENSE, Schema.EXPENSE)
APIBuilder.register_blueprint(
    expense_bp,
    "expense",
    expense_crud,
    ["GET", "GET_MANY", "POST", "DELETE", "PATCH"],
)

budget_bp = Blueprint("budget", __name__)
budget_crud = GenericCRUD(Table.BUDGET, Schema.BUDGET)
APIBuilder.register_blueprint(
    budget_bp, "budget", budget_crud, ["GET", "GET_MANY", "POST", "DEPRECATE", "PATCH"]
)
