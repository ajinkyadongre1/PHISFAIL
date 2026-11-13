from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional
import re
from backend.database.db_service import db_service

router = APIRouter(prefix="/api/community", tags=["Community Threat Reports"])

class CommunityReportSubmission(BaseModel):
    target_value: str = Field(..., min_length=3, max_length=1000)
    report_type: str = Field(..., description="url, sms, phone, upi, qr")
    threat_category: str = Field(..., description="Banking Phishing, Smishing, Utility Extortion, etc.")
    targeted_brand: Optional[str] = "General"
    description: str = Field(..., min_length=10, max_length=2000)
    evidence_text: Optional[str] = None

def scrub_sensitive_pii(text: str) -> str:
    """Privacy scrubber: scrubs 12-digit Aadhaar, 16-digit credit cards, OTP codes."""
    if not text:
        return text
    # Credit card / 16 digits
    text = re.sub(r'\b(?:\d{4}[-\s]?){3}\d{4}\b', '[REDACTED CARD NUMBER]', text)
    # Aadhaar (12 digits)
    text = re.sub(r'\b\d{4}\s?\d{4}\s?\d{4}\b', '[REDACTED AADHAAR]', text)
    # OTP pattern (6 digits after OTP/pin keyword)
    text = re.sub(r'(?i)(?:otp|code|pin)\s*(?:is|:)?\s*\b\d{4,6}\b', '[REDACTED OTP]', text)
    return text

@router.get("")
async def get_reports(
    limit: int = Query(50, ge=1, le=100),
    threat_type: Optional[str] = Query(None)
):
    reports = db_service.get_community_reports(limit=limit, threat_type=threat_type)
    return {"total": len(reports), "reports": reports}

@router.post("")
async def submit_report(payload: CommunityReportSubmission):
    # Sanitize and scrub PII
    clean_target = scrub_sensitive_pii(payload.target_value.strip())
    clean_desc = scrub_sensitive_pii(payload.description.strip())
    clean_evidence = scrub_sensitive_pii(payload.evidence_text.strip()) if payload.evidence_text else None

    # Duplicate check: see if identical target already reported
    existing = db_service.get_community_reports(limit=100)
    for r in existing:
        if r.get("target_value", "").lower() == clean_target.lower():
            # Auto-upvote existing
            updated = db_service.upvote_report(r["id"])
            return {
                "status": "upvoted_existing",
                "message": "This threat was already reported by the community. Your confirmation has been added as an upvote!",
                "report": updated
            }

    new_report = db_service.add_community_report({
        "target_value": clean_target,
        "report_type": payload.report_type,
        "threat_category": payload.threat_category,
        "targeted_brand": payload.targeted_brand or "General",
        "description": clean_desc,
        "evidence_text": clean_evidence,
        "is_public": True
    })

    return {
        "status": "created",
        "message": "Thank you! Your threat indicator has been safely logged in the community defense network.",
        "report": new_report
    }

@router.post("/{report_id}/upvote")
async def upvote(report_id: str):
    res = db_service.upvote_report(report_id)
    if not res:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"status": "success", "report": res}

