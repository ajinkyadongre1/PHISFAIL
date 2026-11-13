from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from backend.services.ai_investigator import ai_investigator

router = APIRouter(prefix="/api/investigator", tags=["AI Cybersecurity Investigator"])

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User prompt or security question")
    scan_context: Optional[Dict[str, Any]] = None

@router.post("/chat")
async def chat_with_investigator(payload: ChatRequest):
    response = await ai_investigator.chat(payload.message, scan_context=payload.scan_context)
    return response

