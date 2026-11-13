from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from backend.services.url_analyzer import url_analyzer
from backend.services.scam_dna import scam_dna_engine
from backend.database.db_service import db_service

router = APIRouter(prefix="/api/url", tags=["URL Scanner"])

class URLScanRequest(BaseModel):
    url: str = Field(..., min_length=3, max_length=2048, description="Target URL to analyze")
    scan_source: Optional[str] = "web" # 'web' or 'qr'

@router.post("/scan")
async def scan_url(payload: URLScanRequest):
    if not payload.url or len(payload.url.strip()) < 3:
        raise HTTPException(status_code=400, detail="Invalid URL format")
        
    result = await url_analyzer.analyze(payload.url)
    
    if "error" in result:
        raise HTTPException(status_code=403, detail=result["error"])

    # Correlate with Scam DNA database
    correlations = scam_dna_engine.correlate_new_scan(payload.url, result)
    result["scam_dna_correlation"] = correlations

    # Persist in scan history
    scan_type = "qr" if payload.scan_source == "qr" else "url"
    saved_record = db_service.save_scan({
        "scan_type": scan_type,
        "target_input": result["target_input"],
        "sanitized_input": result["sanitized_input"],
        "risk_score": result["risk_score"],
        "risk_category": result["risk_category"],
        "verdict": result["verdict"],
        "detected_signals": result["detected_signals"],
        "recommendations": result["recommendations"],
        "telemetry": result["telemetry"],
        "is_demo": False
    })
    result["scan_id"] = saved_record["id"]
    result["created_at"] = saved_record["created_at"]

    return result

