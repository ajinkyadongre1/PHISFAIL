from fastapi import APIRouter, Query
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from backend.services.scam_dna import scam_dna_engine
from backend.database.db_service import db_service

router = APIRouter(prefix="/api/scam-dna", tags=["Scam DNA"])

class NewIndicatorRequest(BaseModel):
    indicator_type: str = Field(..., description="domain, ip, phone, kit_signature, upi")
    indicator_value: str
    targeted_brand: Optional[str] = "Unspecified"
    scam_category: Optional[str] = "Phishing"
    reputation_score: Optional[int] = 85

class CorrelateRequest(BaseModel):
    target_value: str

@router.get("/graph")
async def get_graph(brand: Optional[str] = Query(None, description="Filter by targeted brand")):
    return scam_dna_engine.get_full_threat_graph(filter_brand=brand)

@router.post("/indicator")
async def add_indicator(payload: NewIndicatorRequest):
    result = db_service.add_threat_indicator({
        "indicator_type": payload.indicator_type,
        "indicator_value": payload.indicator_value,
        "targeted_brand": payload.targeted_brand,
        "scam_category": payload.scam_category,
        "reputation_score": payload.reputation_score,
        "times_seen": 1
    })
    return {"status": "success", "indicator": result}

@router.post("/correlate")
async def correlate_indicator(payload: CorrelateRequest):
    # Quick correlation test
    return scam_dna_engine.correlate_new_scan(payload.target_value, {"telemetry": {"domain": payload.target_value}})

