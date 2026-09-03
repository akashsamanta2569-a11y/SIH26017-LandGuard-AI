from pathlib import Path
from uuid import uuid4
import shutil

import cv2
from ultralytics import YOLO

from app.services.gis_lookup_service import find_district
from app.services.alert_service import create_ai_alert
from app.services.prediction_history_service import save_prediction_history

ROOT = Path(__file__).resolve().parents[3]

UPLOAD_DIR = ROOT / "ai_model" / "uploads"
PREDICTION_DIR = ROOT / "ai_model" / "predictions"
MODEL_PATH = ROOT / "ai_model" / "weights" / "landguard_yolo.pt"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
PREDICTION_DIR.mkdir(parents=True, exist_ok=True)

model = YOLO(str(MODEL_PATH))


def run_prediction(file):

    filename = f"{uuid4()}_{file.filename}"

    upload_path = UPLOAD_DIR / filename
    prediction_path = PREDICTION_DIR / filename

    # Save uploaded image
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = cv2.imread(str(upload_path))

    results = model(str(upload_path), conf=0.35)

    detections = []
    highest_confidence = 0
    district_detected = None

    # Temporary coordinates (Barasat)
    latitude = 22.7228
    longitude = 88.4811

    district = find_district(latitude, longitude)

    for result in results:

        names = result.names

        for box in result.boxes:

            cls = int(box.cls[0])
            confidence = float(box.conf[0])
            highest_confidence = max(highest_confidence, confidence)
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            class_name = names[cls]

            detections.append({
                "class_name": class_name,
                "confidence": round(confidence, 3),
                "bbox": [x1, y1, x2, y2]
            })

            # Draw bounding box
            cv2.rectangle(image, (x1, y1), (x2, y2), (0,255,0), 2)

            cv2.putText(
                image,
                f"{class_name} {confidence:.2f}",
                (x1, y1-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0,255,0),
                2
            )

            # --------------------------
            # AI ALERT CREATION
            # --------------------------
            if district:
                district_detected = district
                create_ai_alert(
                    district_name=district,
                    latitude=latitude,
                    longitude=longitude,
                    alert_type=class_name,
                    confidence=confidence
                )

    cv2.imwrite(str(prediction_path), image)
    save_prediction_history(
        image_name=filename,
        image_path=str(upload_path),
        prediction_path=str(prediction_path),
        detections=detections,
        district_name=district
    )
    return {
    "success": True,
    "message": "Prediction completed successfully.",

    "filename": filename,

    "image_url": f"/static/uploads/{filename}",
    "prediction_url": f"/static/predictions/{filename}",

    "district_name": district_detected,
    "highest_confidence": round(highest_confidence, 3),

    "total_detections": len(detections),
    "detections": detections
}

