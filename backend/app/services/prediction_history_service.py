from pathlib import Path
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.prediction_history import PredictionHistory


def save_prediction_history(
    image_name,
    image_path,
    prediction_path,
    detections,
    district_name,
):
    db = SessionLocal()

    highest = max(
        [d["confidence"] for d in detections],
        default=0
    )

    history = PredictionHistory(
        image_name=image_name,
        image_path=image_path,
        prediction_path=prediction_path,
        total_detections=len(detections),
        highest_confidence=highest,
        district_name=district_name,
    )

    db.add(history)
    db.commit()
    db.refresh(history)

    print(f"✅ Prediction saved: {image_name}")

    db.close()
    return history


def get_prediction_history(limit: int = 20):
    db: Session = SessionLocal()

    try:
        history = (
            db.query(PredictionHistory)
            .order_by(PredictionHistory.created_at.desc())
            .limit(limit)
            .all()
        )

        data = []

        for item in history:
            upload_filename = Path(item.image_path).name
            prediction_filename = Path(item.prediction_path).name

            data.append({
                "id": str(item.id),
                "image_name": item.image_name,

                # ✅ Frontend-ready URLs
                "image_url": f"/static/uploads/{upload_filename}",
                "prediction_url": f"/static/predictions/{prediction_filename}",

                "district_name": item.district_name,
                "total_detections": item.total_detections,
                "highest_confidence": item.highest_confidence,
                "created_at": item.created_at
            })

        return data

    finally:
        db.close()