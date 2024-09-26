"""
Adaptor server.
"""
import os
import logging

from flask import Flask, request, jsonify, Response
from flask_cors import CORS

from shared.adaptor import generate_frames, read_sensor
from shared.logger import setup_logger

logger = setup_logger(__name__, logging.DEBUG)

app = Flask(__name__)

@app.route('/video_feed')
def video_feed():
    """
    Return this server's camera (defaulting to single camera support for now).
    """
    logger.info("Received request to read local camera")
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/sensor_data')
def sensor_data():
    """
    Return this server's dht sensor data (defaulting to single dht support for now).
    """
    logger.info("Received request to read local dht sensor")
    return jsonify(read_sensor())

CORS(app)

if __name__ == "__main__":

    # Run the Flask app
    app.run(debug=True)
