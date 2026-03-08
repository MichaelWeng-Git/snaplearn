from fastapi import APIRouter, HTTPException, UploadFile

from models.schemas import AnalyzeResponse
from services.openai_service import analyze_image, generate_recommendations

router = APIRouter(prefix="/api")

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, WebP, GIF.",
        )

    image_bytes = await file.read()

    if len(image_bytes) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10 MB.")

    try:
        analysis = analyze_image(image_bytes, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI vision analysis failed: {e}")

    if analysis.confidence < 0.3:
        raise HTTPException(
            status_code=422,
            detail="Could not confidently identify educational content in this image. Please try a clearer photo.",
        )

    try:
        recommendations = generate_recommendations(analysis)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI recommendation generation failed: {e}")

    return AnalyzeResponse(
        **analysis.model_dump(),
        **recommendations.model_dump(),
    )
