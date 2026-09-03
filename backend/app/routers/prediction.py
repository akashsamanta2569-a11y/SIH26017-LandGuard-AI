from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.schemas.prediction import (
    PredictionResponse,
    PredictionHistoryResponse,
)

from app.schemas.common import ErrorResponse
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from app.services.prediction_history_service import get_prediction_history
from app.services.prediction_service import run_prediction

router = APIRouter(
    prefix="/api/v1/predict",
    tags=["AI Prediction"]
)

ROOT = Path(__file__).resolve().parents[3]
PREDICTION_DIR = ROOT / "ai_model" / "predictions"


@router.post(
    "/image",
    response_model=PredictionResponse,
    responses={500: {"model": ErrorResponse}},
    summary="Run AI Detection on Uploaded Image",
    description="Uploads an image, performs YOLO detection, creates AI alerts, and saves prediction history."
)
def predict_image(file: UploadFile = File(...)):
    try:
        result = run_prediction(file)
        result["success"] = True
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "success": False,
                "message": "Prediction failed.",
                "error": str(e)
            }
        )


@router.get("/image/{filename}")
async def get_prediction_image(filename: str):

    image_path = PREDICTION_DIR / filename

    return FileResponse(image_path)

@router.get(
    "/history",
    response_model=list[PredictionHistoryResponse],
    summary="Prediction History Gallery"
)
def prediction_history(limit: int = 20):
    return get_prediction_history(limit)

    for item in records:
        response.append({
            "id": str(item.id),
            "image_name": item.image_name,
            "image_path": item.image_path,
            "prediction_path": item.prediction_path,
            "district_name": item.district_name,
            "total_detections": item.total_detections,
            "highest_confidence": item.highest_confidence,
            "created_at": item.created_at,
        })

    return response