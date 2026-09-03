from pathlib import Path
from ultralytics import YOLO

# Project root -> SIH26017-LandGuard-AI
ROOT = Path(__file__).resolve().parent.parent

MODEL_PATH = ROOT / "ai_model" / "weights" / "landguard_yolo.pt"

print("📦 Loading model from:")
print(MODEL_PATH)

# Load YOLO model
model = YOLO(str(MODEL_PATH))

print("\n✅ Model loaded successfully!")
print(f"Total classes: {len(model.names)}")

print("\nFirst 10 classes:")
for i in range(min(10, len(model.names))):
    print(f"{i}: {model.names[i]}")