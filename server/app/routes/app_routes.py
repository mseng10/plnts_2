from flask import Blueprint, jsonify, request
from shared.db import Table
from shared.logger import logger

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
    meta = {
        "alert_count": Table.ALERT.count(),
        "todo_count": Table.TODO.count(),
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
