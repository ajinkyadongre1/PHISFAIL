import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from backend.config import settings
from backend.routers import (
    url_scan,
    sms_scan,
    scam_dna,
    investigator,
    history,
    community,
    stats,
    system
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("phisfail.app")

app = FastAPI(
    title="PHISFAIL Threat Defense API",
    description="AI-Powered Cybersecurity Platform detecting Phishing URLs, Smishing, QR Quishing, and Scam DNA correlation.",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple sliding window rate-limiter in memory
RATE_LIMIT_STORE = {}

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
    
    # Exclude static/health checks from strict rate limits
    if request.url.path.startswith("/api/"):
        window = RATE_LIMIT_STORE.setdefault(client_ip, [])
        # Keep calls within past 60 seconds
        window = [t for t in window if now - t < 60]
        if len(window) >= settings.RATE_LIMIT_PER_MINUTE:
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please wait a moment before sending more threat scans."}
            )
        window.append(now)
        RATE_LIMIT_STORE[client_ip] = window

    response = await call_next(request)
    # Add Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# Register Routers
app.include_router(url_scan.router)
app.include_router(sms_scan.router)
app.include_router(scam_dna.router)
app.include_router(investigator.router)
app.include_router(history.router)
app.include_router(community.router)
app.include_router(stats.router)
app.include_router(system.router)

@app.get("/")
async def root():
    return {
        "platform": "PHISFAIL AI Cyber Defense Platform",
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

