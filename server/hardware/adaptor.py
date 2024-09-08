"""
Process dedicated to doing background processing on this application.
This creates alerts, manages connections to active systems, etc.
"""
import cv2

import time
import Adafruit_DHT

from logger import logger

# Set up the camera
camera = cv2.VideoCapture(0)  # Use 0 for the first camera

# Set up the DHT22 sensor
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4

def generate_frames():
    """Output a camera feed as a jpg image."""
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def read_dht22():
    """Read the """
    logger.info("Attempting to read dht")
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    if humidity is not None and temperature is not None:
        logger.info(f"Temperature: {temperature:.1f}°C")
        logger.info(f"Humidity: {humidity:.1f}%")
    else:
        logger.error("Failed to retrieve data from DHT22 sensor")
    return humidity, temperature
