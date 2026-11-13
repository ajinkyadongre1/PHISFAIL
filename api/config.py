import os
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    APP_NAME: str = "PHISFAIL"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", "8000"))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    
    # API Security & CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*"
    ]
    
    # External APIs
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    VIRUSTOTAL_API_KEY: str = os.getenv("VIRUSTOTAL_API_KEY", "")
    GOOGLE_SAFE_BROWSING_API_KEY: str = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY", "")
    
    # Supabase credentials (optional, fallback to local persistent store)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    
    @property
    def is_gemini_active(self) -> bool:
        return bool(self.GEMINI_API_KEY and not self.GEMINI_API_KEY.startswith("your_"))
        
    @property
    def is_virustotal_active(self) -> bool:
        return bool(self.VIRUSTOTAL_API_KEY and not self.VIRUSTOTAL_API_KEY.startswith("your_"))

    @property
    def is_safe_browsing_active(self) -> bool:
        return bool(self.GOOGLE_SAFE_BROWSING_API_KEY and not self.GOOGLE_SAFE_BROWSING_API_KEY.startswith("your_"))

    @property
    def is_supabase_active(self) -> bool:
        return bool(self.SUPABASE_URL and self.SUPABASE_KEY and not self.SUPABASE_URL.startswith("https://your-project"))

settings = Settings()

