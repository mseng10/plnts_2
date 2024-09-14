"""
The purpose of running this api server. 
"""

import os

from flask import Flask, request, jsonify, Response
from flask_cors import CORS

from shared.adaptor import generate_frames, read_sensor

from shared.logger import setup_logger
import logging

logger = setup_logger(__name__, logging.DEBUG)

app = Flask(__name__)

@app.route('/video_feed')
def video_feed():
    logger.info("Received request to read local camera")
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/sensor_data')
def sensor_data():
    logger.info("Received request to read dht sensor")
    return jsonify(read_sensor())

CORS(app)

if __name__ == "__main__":

    # Run the Flask app
    app.run(debug=True)
