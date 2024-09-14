"""
Process dedicated to doing background processing on this application.
This creates alerts, manages connections to active systems, etc.
"""
import cv2

import time
import adafruit_dht


# Set up the camera
# camera = cv2.VideoCapture(0)  # Use 0 for the first camera

# Set up the DHT22 sensor
# dht_device = adafruit_dht.DHT22(board.D4)
# if dht_device == None:
#     dht_device = adafruit_dht.DHT22(pin.D4)

def generate_frames():
    try:
        camera = cv2.VideoCapture(0)  # Use 0 for the first camera
        if not camera.isOpened():
            logger.error("Failed to open camera")
            return

        while True:
            success, frame = camera.read()
            if not success:
                logger.error("Failed to read frame from camera")
                break
            
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                logger.error("Failed to encode frame")
                break
            
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    except Exception as e:
        logger.exception(f"Error in generate_frames: {str(e)}")
    
    finally:
        if camera.isOpened():
            camera.release()

def read_sensor(retries=5, delay_seconds=2):
    import board
    dht_device = adafruit_dht.DHT22(board.D4)
    if dht_device == None:
        dht_device = adafruit_dht.DHT22(pin.D4)

    if dht_device == None:
        logger.error("Could not establish connection to dht sensor")
    
    for _ in range(retries):
        try:
            return {
                "temperature": dht_device.temperature,
                "humidity": ht_device.humidity
            }
        except RuntimeError:
            # Reading doesn't always work! Just print an error and we'll try again
            print("Sensor read failure, retrying...")
            time.sleep(delay_seconds)
    
    return None, None
