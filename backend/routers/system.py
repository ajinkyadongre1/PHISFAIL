from fastapi import APIRouter
from backend.config import settings

router = APIRouter(prefix="/api/system", tags=["System Status & Integrations"])

@router.get("/status")
async def get_system_status():
    return {
        "status": "online",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "integrations": {
            "gemini_api": {
                "active": settings.is_gemini_active,
                "label": "Google Gemini 2.5 Flash",
                "mode": "Live Integration" if settings.is_gemini_active else "Simulated Cyber Expert Engine (Demo Active)"
            },
            "virustotal": {
                "active": settings.is_virustotal_active,
                "label": "VirusTotal v3 Intelligence",
                "mode": "Live API Feed" if settings.is_virustotal_active else "Simulated Threat Reputation (Demo Active)"
            },
            "safe_browsing": {
                "active": settings.is_safe_browsing_active,
                "label": "Google Safe Browsing v4",
                "mode": "Live API Feed" if settings.is_safe_browsing_active else "Simulated Threat Feed (Demo Active)"
            },
            "supabase_db": {
                "active": settings.is_supabase_active,
                "label": "Supabase Cloud Database",
                "mode": "Live Cloud PostgreSQL" if settings.is_supabase_active else "Local Persistent JSON Storage (Demo Active)"
            }
        }
    }

