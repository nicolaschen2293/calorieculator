from ultralytics import YOLO
import cv2

# Load pre-trained YOLO model
model = YOLO('yolov8n.pt')  # Replace with food-specific model if needed

def process_image(image_path):
    img = cv2.imread(image_path)
    results = model.predict(img)
    recognized_food = [result.names for result in results]
    return recognized_food