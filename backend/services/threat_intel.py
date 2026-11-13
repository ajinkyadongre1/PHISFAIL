import httpx
import logging
from typing import Dict, Any, Optional
from backend.config import settings

logger = logging.getLogger("phisfail.threat_intel")

class ThreatIntelService:
    """
    Integrates with Google Safe Browsing and VirusTotal APIs.
    Provides verified detection telemetry when API keys are configured,
    and falls back cleanly to contextual threat intelligence heuristic models
    with clear 'simulated/demo' telemetry flags when credentials are absent.
    """
    
    def __init__(self):
        self.sb_key = settings.GOOGLE_SAFE_BROWSING_API_KEY
        self.vt_key = settings.VIRUSTOTAL_API_KEY
        
    async def check_google_safe_browsing(self, url: str) -> Dict[str, Any]:
        """
        Check URL against Google Safe Browsing Lookup API (v4).
        """
        if not settings.is_safe_browsing_active:
            # Deterministic, realistic fallback based on URL attributes
            is_malicious = any(k in url.lower() for k in [
                "sbi-yono-update", "secure-login-token", "kyc-update", 
                "bank-verification", "free-gift-crypto", "netflix-suspended",
                "income-tax-refund.org"
            ])
            return {
                "source": "Google Safe Browsing (Simulated Engine)",
                "is_active_api": False,
                "is_flagged": is_malicious,
                "threat_types": ["MALWARE", "SOCIAL_ENGINEERING"] if is_malicious else [],
                "platform_type": "ANY_PLATFORM",
                "details": "Known malicious phishing target identified via simulated Threat Intel feeds." if is_malicious else "No match in threat feed."
            }
            
        endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={self.sb_key}"
        payload = {
            "client": {
                "clientId": "phisfail-security",
                "clientVersion": "1.0.0"
            },
            "threatInfo": {
                "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": url}]
            }
        }
        
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.post(endpoint, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    matches = data.get("matches", [])
                    is_flagged = len(matches) > 0
                    threat_types = [m.get("threatType") for m in matches]
                    return {
                        "source": "Google Safe Browsing v4 (Live API)",
                        "is_active_api": True,
                        "is_flagged": is_flagged,
                        "threat_types": threat_types,
                        "details": f"Flagged by Google Safe Browsing: {', '.join(threat_types)}" if is_flagged else "Clean reputation."
                    }
                else:
                    logger.warning(f"Safe Browsing API returned {res.status_code}")
        except Exception as e:
            logger.error(f"Error querying Safe Browsing API: {e}")
            
        return {
            "source": "Google Safe Browsing (Offline Fallback)",
            "is_active_api": False,
            "is_flagged": False,
            "threat_types": [],
            "details": "Lookup bypassed or service unreachable."
        }

    async def check_virustotal(self, url: str) -> Dict[str, Any]:
        """
        Check URL against VirusTotal v3 API.
        """
        if not settings.is_virustotal_active:
            # Deterministic realistic fallback
            lower = url.lower()
            is_flagged = any(k in lower for k in [
                "sbi-yono", "free-gift", "token-airdrop", "verify-account", 
                "bank-alert", "paypal-auth", "delivery-failed"
            ])
            positives = 14 if is_flagged else 0
            total_engines = 88
            return {
                "source": "VirusTotal Intelligence (Simulated Engine)",
                "is_active_api": False,
                "is_flagged": is_flagged,
                "positives": positives,
                "total_engines": total_engines,
                "detection_ratio": f"{positives}/{total_engines}",
                "scan_date": "2026-11-13T10:45:00Z",
                "categories": ["phishing", "malicious"] if is_flagged else ["harmless"],
                "details": f"{positives} security vendors flagged this URL as malicious (Simulated Telemetry)." if is_flagged else "0 security vendors flagged this URL."
            }
            
        import base64
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
        endpoint = f"https://www.virustotal.com/api/v3/urls/{url_id}"
        headers = {"x-apikey": self.vt_key}
        
        try:
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(endpoint, headers=headers)
                if res.status_code == 200:
                    data = res.json().get("data", {})
                    attributes = data.get("attributes", {})
                    stats = attributes.get("last_analysis_stats", {})
                    malicious_cnt = stats.get("malicious", 0) + stats.get("suspicious", 0)
                    total = sum(stats.values()) if stats else 75
                    return {
                        "source": "VirusTotal v3 (Live API)",
                        "is_active_api": True,
                        "is_flagged": malicious_cnt > 2,
                        "positives": malicious_cnt,
                        "total_engines": total,
                        "detection_ratio": f"{malicious_cnt}/{total}",
                        "categories": [k for k, v in attributes.get("categories", {}).items()],
                        "details": f"{malicious_cnt} vendors flagged this URL as malicious." if malicious_cnt > 0 else "0 security vendors flagged this URL."
                    }
        except Exception as e:
            logger.error(f"Error querying VirusTotal API: {e}")
            
        return {
            "source": "VirusTotal (Offline Fallback)",
            "is_active_api": False,
            "is_flagged": False,
            "positives": 0,
            "total_engines": 75,
            "detection_ratio": "0/75",
            "categories": [],
            "details": "Lookup bypassed or service unreachable."
        }

threat_intel_service = ThreatIntelService()

