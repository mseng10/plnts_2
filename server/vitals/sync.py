"""
Process dedicated to doing background processing on this application.
This creates alerts, manages connections to active systems, etc.
"""
import time
from picamera import PiCamera
from gpiozero import MCP3008
import Adafruit_DHT

from logger import setup_logger
import logging

# Set up the camera
camera = PiCamera()
camera.resolution = (1024, 768)

# Set up the DHT22 sensor
DHT_SENSOR = Adafruit_DHT.DHT22
DHT_PIN = 4  # GPIO pin the DHT22 is connected to

def capture_image(filename):
    camera.start_preview()
    # Camera warm-up time
    time.sleep(2)
    camera.capture(filename)
    logger.info(f"Image captured: {filename}")

def read_dht22():
    humidity, temperature = Adafruit_DHT.read_retry(DHT_SENSOR, DHT_PIN)
    if humidity is not None and temperature is not None:
        logger.info(f"Temperature: {temperature:.1f}°C")
        logger.info(f"Humidity: {humidity:.1f}%")
    else:
        logger.info("Failed to retrieve data from DHT22 sensor")
    return humidity, temperature
