"""
Running webserver.
"""
from typing import List
import logging
import sys
import os
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_apscheduler import APScheduler

from models.plant import Plant
from models.alert import Alert, AlertTypes

from shared.db import Table

from shared.logger import setup_logger
from shared.discover import discover_systems

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)

# Probably abstract this out to a Role class and have this be in the master role class
# Maybe put this into the installable?
discover_systems()

# Create Flask app
app = Flask(__name__)
app.config['DEBUG'] = True

from routes.system_routes import system_bp, light_bp
from routes.plant_routes import bp as plant_bp
from routes.todo_routes import bp as todo_bp
from routes.mix_routes import bp as mix_bp
from routes.stat_routes import bp as stat_bp
from routes.installable_model_routes import (
    soils_bp,
    genus_types_bp,
    species_bp,
    genus_bp,
)
from routes.alert_routes import bp as alert_bp

# Models
app.register_blueprint(system_bp)
app.register_blueprint(light_bp)
app.register_blueprint(plant_bp)
app.register_blueprint(todo_bp)
app.register_blueprint(mix_bp)
app.register_blueprint(stat_bp)
app.register_blueprint(alert_bp)

# Installables
app.register_blueprint(genus_types_bp)
app.register_blueprint(genus_bp)
app.register_blueprint(species_bp)
app.register_blueprint(soils_bp)

CORS(app)


@app.route("/meta/", methods=["GET"])
def get_meta():
    """
    Get meta data of the application.
    """
    logger.info("Received request to query the meta")

    meta = {
        "alert_count": Table.ALERT.count({"deprecated": False}),
        "todo_count": Table.TODO.count({"deprecated": False}),
    }

    logger.info("Successfully generated meta data.")
    return jsonify(meta)


@app.route("/notebook/", methods=["GET"])
def get_notebook():
    """
    Get the jupyter notebook for this.
    """
    # Read the notebook
    with open("notebook", "r", encoding="utf-8") as f:
        notebook_content = nbformat.read(f, as_version=4)

    # Convert the notebook to HTML
    html_exporter = HTMLExporter()
    html_exporter.template_name = "classic"
    (body, _) = html_exporter.from_notebook_node(notebook_content)

    # Serve the HTML
    return body


# Print details of the running endpoints
logger.debug("------------------------------------------------------------")
logger.debug("Printing all available endpoints for this api server:")
for rule in app.url_map.iter_rules():
    methods = ",".join(sorted(rule.methods))
    arguments = ",".join(sorted(rule.arguments))
    logger.debug(f"Endpoint: {rule.endpoint}")
    logger.debug(f"    URL: {rule}")
    logger.debug(f"    Methods: {methods}")
    logger.debug(f"    Arguments: {arguments}")
    logger.debug("---")

logger.debug("------------------------------------------------------------")

scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


@scheduler.task("cron", id="nightly", minute="*")
def manage_plant_alerts():
    """
    Create different plant alerts. Right now just supports creating watering alerts.
    """

    existing_plant_alrts: Alert = Table.ALERT.get_many()
    existing_plant_alrts_map = {}
    for existing_plant_alert in existing_plant_alrts:
        existing_plant_alrts_map[existing_plant_alert.plant_id] = existing_plant_alert

    existing_plants: List[Plant] = Table.PLANT.get_many(
        {"deprecated": False}
    )  # Sure...
    now = datetime.now()
    for plant in existing_plants:
        end_date = plant.watered_on + timedelta(days=float(plant.watering))
        if end_date < now and existing_plant_alrts_map.get(plant.id) is None:
            new_plant_alert:Alert = Alert(model_id=plant.id, alert_type=AlertTypes.WATER.value)
            # Create the alert in the db
            Table.ALERT.create(new_plant_alert)
            existing_plant_alrts_map[new_plant_alert.model_id] = new_plant_alert


logger.debug("------------------------------------------------------------")
logger.debug("Printing all available cron jobs for this api server:")
for job in scheduler.get_jobs():
    logger.debug(
        f"Job: {job.name}, Trigger: {job.trigger}, Next run: {job.next_run_time}"
    )
logger.debug("------------------------------------------------------------")

if __name__ == "__main__":
    # Run the Flask app
    app.run(host="0.0.0.0", port=8002)

    # app.run(debug=True)
