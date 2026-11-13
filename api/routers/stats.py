from fastapi import APIRouter
from backend.database.db_service import db_service

router = APIRouter(prefix="/api/stats", tags=["Dashboard Statistics"])

@router.get("")
async def get_stats():
    return db_service.get_dashboard_stats()

