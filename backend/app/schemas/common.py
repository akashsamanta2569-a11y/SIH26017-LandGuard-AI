from pydantic import BaseModel


class ErrorResponse(BaseModel):
    success: bool = False
    message: str
    error: str | None = None


class SuccessResponse(BaseModel):
    success: bool = True
    message: str