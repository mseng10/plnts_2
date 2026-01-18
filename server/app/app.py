"""
Running webserver.
"""

import logging
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, jsonify
from flask_cors import CORS

from shared.logger import setup_logger
from shared.db import initialize_database

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.config["DEBUG"] = True


from routes.system_routes import system_bp, light_bp
from routes.plant_routes import (
    bp as plant_bp,
    genus_bp,
    genus_types_bp,
    species_bp,
    care_plan_bp,
)
from routes.todo_routes import todos_bp, goals_bp
from routes.mix_routes import mixes_bp, soils_bp
from routes.stat_routes import bp as stat_bp
from routes.alert_routes import bp as alert_bp
from routes.app_routes import bp as app_bp
from routes.chat_routes import chat_bp
from routes.expense_routes import expense_bp, budget_bp
from background.background import init_scheduler
from install import install

# Get MongoDB URLs from environment with fallbacks
mongodb_url = os.getenv(
    "MONGODB_URL",
    "mongodb://admin:password@mongo:27017/plnts?authSource=admin"
)
mongodb_url_hist = os.getenv(
    "MONGODB_URL_HIST",
    "mongodb://admin:password@mongo:27017/plnts_hist?authSource=admin"
)

logger.info(f"Connecting to MongoDB at: {mongodb_url.replace('password', '****')}")
logger.info(f"Connecting to MongoDB History at: {mongodb_url_hist.replace('password', '****')}")

# Initialize database connections
try:
    initialize_database(
        mongodb_url=mongodb_url,
        mongodb_url_hist=mongodb_url_hist,
        db_name="plnts",
        hist_db_name="plnts_hist",
    )
    logger.info("Database initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database: {e}")
    raise

# Run installation tasks
try:
    install()
    logger.info("Installation completed successfully")
except Exception as e:
    logger.error(f"Installation failed: {e}")
    raise

# Register blueprints
app.register_blueprint(system_bp)
app.register_blueprint(light_bp)
app.register_blueprint(plant_bp)
app.register_blueprint(todos_bp)
app.register_blueprint(goals_bp)
app.register_blueprint(mixes_bp)
app.register_blueprint(stat_bp)
app.register_blueprint(alert_bp)
app.register_blueprint(chat_bp)
app.register_blueprint(genus_types_bp)
app.register_blueprint(genus_bp)
app.register_blueprint(species_bp)
app.register_blueprint(soils_bp)
app.register_blueprint(app_bp)
app.register_blueprint(expense_bp)
app.register_blueprint(budget_bp)
app.register_blueprint(care_plan_bp)

# Enable CORS
CORS(app)

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

# Initialize and start the background scheduler
init_scheduler(app)

if __name__ == "__main__":
    # Note: When running with gunicorn, this block won't be executed
    app.run(host="0.0.0.0", port=5000, debug=True)