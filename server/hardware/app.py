"""
Running hardware server.
"""

import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from hardware.adaptor import generate_frames, read_dht22

from db import init_db

from logger import setup_logger

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
    humidity, temperature = read_dht22()
    return jsonify({
        'temperature': temperature,
        'humidity': humidity,
        'pi_id': os.environ.get('PI_ID', 'unknown')
    })

CORS(app)

if __name__ == "__main__":

    # Run the Flask app
    app.run(debug=True)
