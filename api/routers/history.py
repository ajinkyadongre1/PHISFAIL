from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from backend.database.db_service import db_service

router = APIRouter(prefix="/api/history", tags=["Scan History"])

@router.get("")
async def get_scan_history(
    limit: int = Query(50, ge=1, le=100),
    scan_type: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    scans = db_service.get_scans(limit=limit, scan_type=scan_type, search=search)
    return {"total": len(scans), "scans": scans}

@router.get("/{scan_id}")
async def get_scan_record(scan_id: str):
    scan = db_service.get_scan_by_id(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found.")
    return scan

