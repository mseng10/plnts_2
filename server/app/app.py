"""
Running webserver.
"""

import logging
import sys
import os
import asyncio

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, jsonify
from flask_cors import CORS

from shared.logger import setup_logger
from shared.discover import discover_systems

# Create a logger for this specific module
logger = setup_logger(__name__, logging.DEBUG)

# Probably abstract this out to a Role class and have this be in the master role class
# Maybe put this into the installable?
discover_systems()

# Create Flask app
app = Flask(__name__)
app.config["DEBUG"] = True


from routes.system_routes import system_bp, light_bp
from routes.plant_routes import bp as plant_bp, genus_bp, genus_types_bp, species_bp
from routes.todo_routes import bp as todo_bp
from routes.mix_routes import mixes_bp, soils_bp
from routes.stat_routes import bp as stat_bp
from routes.alert_routes import bp as alert_bp
from routes.app_routes import bp as app_bp
from routes.chat_routes import chat_bp
from routes.expense_routes import expense_bp, budget_bp

from background.background import init_scheduler


app.register_blueprint(system_bp)
app.register_blueprint(light_bp)
app.register_blueprint(plant_bp)
app.register_blueprint(todo_bp)
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
    asyncio.run(app.run(host="0.0.0.0", port=8002, debug=True))
