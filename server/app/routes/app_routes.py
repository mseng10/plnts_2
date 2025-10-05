from flask import Blueprint, jsonify, request
from shared.db import Table
from shared.logger import logger
from datetime import datetime

# import nbformat
# from nbconvert import HTMLExporter

bp = Blueprint("app", __name__, url_prefix="/")


@bp.route("/health/", methods=["GET"])
def health():
    """Return health for app."""
    logger.info("Received request to check the health endpoint")
    # TODO: Check mongo health
    return jsonify({"status": "healthy"})


@bp.route("/meta/", methods=["GET"])
def get_meta():
    """Get meta data of the application."""
    logger.info("Received request to query the meta")

    # Calculate remaining budget for the current month
    now = datetime.now()
    current_month_str = now.strftime("%Y-%m")
    budget_doc = Table.BUDGET.get_many({"month": current_month_str, "deprecated": False})
    current_budget = budget_doc[0].budget if budget_doc else 0

    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    expenses = Table.EXPENSE.get_many({"purchased_on": {"$gte": start_of_month}})
    total_spent = sum(expense.cost for expense in expenses)
    remaining_budget = current_budget - total_spent

    # Calculate total tasks
    todos = Table.TODO.get_many()
    task_count = sum(len(todo.tasks) for todo in todos)

    meta = {
        "alert_count": Table.ALERT.count(),
        "task_count": task_count,
        "remaining_budget": remaining_budget,
        "total_plants": Table.PLANT.count(),
    }

    logger.info("Successfully generated meta data.")
    return jsonify(meta)


# @bp.route("/notebook/", methods=["GET"])
# def get_notebook():
#     """Get the jupyter notebook for this."""
#     # Read the notebook
#     with open("notebook", "r", encoding="utf-8") as f:
#         notebook_content = nbformat.read(f, as_version=4)

#     # Convert the notebook to HTML
#     html_exporter = HTMLExporter()
#     html_exporter.template_name = "classic"
#     (body, _) = html_exporter.from_notebook_node(notebook_content)

#     # Serve the HTML
#     return body
