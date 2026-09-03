from ultralytics import YOLO

print("Downloading YOLO model...")

YOLO("yolov8n.pt")

print("Done! Model downloaded.")