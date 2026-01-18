from flask import Blueprint, jsonify
from shared.db import Table
from routes import GenericCRUD, APIBuilder
from datetime import datetime
from shared.logger import logger

expense_bp = Blueprint("expense", __name__)
expense_crud = GenericCRUD(Table.EXPENSE)

APIBuilder.register_blueprint(
    expense_bp,
    "expense",
    expense_crud,
    ["GET", "GET_MANY", "POST", "DELETE", "PATCH"],
)


@APIBuilder.register_custom_route(
    expense_bp, "/expense/month/<string:month_str>/", methods=["GET"]
)
def get_expenses_by_month(month_str: str):
    """Get expenses for a specific month (YYYY-MM)."""
    logger.info(f"Received request to get expenses for month: {month_str}")
    try:
        # Parse the month string to get the start date
        start_of_month = datetime.strptime(month_str, "%Y-%m")

        # Calculate the start of the next month
        next_month = (start_of_month.replace(day=28) + datetime.timedelta(days=4)).replace(
            day=1
        )

        # Query for expenses within the month
        query = {"purchased_on": {"$gte": start_of_month, "$lt": next_month}}
        expenses = Table.EXPENSE.get_many(query)
        return jsonify([expense.model_dump(mode="json") for expense in expenses])
    except ValueError:
        return jsonify({"error": "Invalid month format. Use YYYY-MM."}), 400


budget_bp = Blueprint("budget", __name__)
budget_crud = GenericCRUD(Table.BUDGET)
APIBuilder.register_blueprint(
    budget_bp, "budget", budget_crud, ["GET", "GET_MANY", "POST", "DEPRECATE", "PATCH"]
)
