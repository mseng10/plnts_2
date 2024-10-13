import cv2

def test_camera():
    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        print("Failed to open camera")
        return
    
    ret, frame = camera.read()
    if not ret:
        print("Failed to capture frame")
    else:
        cv2.imwrite("test_frame.jpg", frame)
        print("Frame captured and saved as test_frame.jpg")
    
    camera.release()

if __name__ == "__main__":
    test_camera()