from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from backend.services.sms_analyzer import sms_analyzer
from backend.services.url_analyzer import url_analyzer
from backend.database.db_service import db_service

router = APIRouter(prefix="/api/sms", tags=["SMS & Message Scam Detector"])

class SMSScanRequest(BaseModel):
    message: str = Field(..., min_length=5, max_length=10000, description="SMS or OCR text content")
    scan_source: Optional[str] = "sms" # 'sms' or 'screenshot'

@router.post("/scan")
async def scan_sms(payload: SMSScanRequest):
    if not payload.message or len(payload.message.strip()) < 5:
        raise HTTPException(status_code=400, detail="Message content too short to analyze.")

    analysis = sms_analyzer.analyze(payload.message)

    # If message contains URLs, analyze the first primary URL too
    extracted_urls = analysis.get("extracted_urls", [])
    url_details = []
    if extracted_urls:
        for u in extracted_urls[:2]:
            try:
                u_res = await url_analyzer.analyze(u)
                url_details.append(u_res)
            except Exception:
                pass
    analysis["url_breakdowns"] = url_details

    # Persist in scan history
    scan_type = "screenshot" if payload.scan_source == "screenshot" else "sms"
    saved = db_service.save_scan({
        "scan_type": scan_type,
        "target_input": analysis["target_input"],
        "sanitized_input": analysis["target_input"][:120] + ("..." if len(analysis["target_input"]) > 120 else ""),
        "risk_score": analysis["risk_score"],
        "risk_category": analysis["risk_category"],
        "verdict": analysis["verdict"],
        "detected_signals": analysis["detected_signals"],
        "recommendations": analysis["recommendations"],
        "telemetry": {
            "category": analysis["detected_category"],
            "language": analysis["detected_language"],
            "extracted_urls": extracted_urls,
            "extracted_phones": analysis.get("extracted_phones", [])
        },
        "is_demo": False
    })

    analysis["scan_id"] = saved["id"]
    analysis["created_at"] = saved["created_at"]
    return analysis

