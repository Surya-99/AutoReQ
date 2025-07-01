from fastapi import APIRouter
from app.models.transcript import TranscriptRequest
from app.services.groq_client import get_llm_response
from app.services.ppt_generator import generate_ppt_from_content

router = APIRouter()

@router.post("/analyze/")
def analyze_transcript(data: TranscriptRequest):
    key_points = get_llm_response(data.content, data.custom_prompt)
    ppt_path = generate_ppt_from_content(key_points, filename="generated_from_json")
    return {
        "message": "Analysis complete",
        "key_points": key_points,
        "ppt_file": ppt_path
    }
