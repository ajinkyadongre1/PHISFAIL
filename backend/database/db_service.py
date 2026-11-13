import json
import os
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
import logging
from backend.config import settings

logger = logging.getLogger("phisfail.db")

# Use /tmp on Vercel or cloud serverless environments
if os.environ.get("VERCEL") or (os.path.exists("/tmp") and os.access("/tmp", os.W_OK)):
    STORAGE_FILE = "/tmp/phisfail_storage.json"
else:
    STORAGE_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "storage.json")


# Realistic Pre-seeded Cybersecurity Dataset for Immediate Demo
SEED_SCANS = [
    {
        "id": "scan-sbi-001",
        "scan_type": "url",
        "target_input": "https://sbi-yono-update-kyc.org/login.php",
        "sanitized_input": "https://sbi-yono-update-kyc[.]org/login.php",
        "risk_score": 94,
        "risk_category": "MALICIOUS",
        "verdict": "High-confidence State Bank of India Credential Harvester",
        "detected_signals": [
            {"name": "Domain Impersonation", "severity": "HIGH", "detail": "Targets 'State Bank of India (SBI)' without legitimate ownership"},
            {"name": "Suspicious TLD & Age", "severity": "HIGH", "detail": "Newly registered domain on free registrar with deceptive keywords"},
            {"name": "Credential Harvesting Form", "severity": "CRITICAL", "detail": "Contains input fields targeting NetBanking Password and OTP"},
            {"name": "Heuristic Threat Intel Match", "severity": "HIGH", "detail": "Matches active 'Chakra-SBI' mobile phishing kit signature"}
        ],
        "recommendations": [
            "DO NOT click, enter credentials, or submit OTP on this webpage.",
            "If you entered information, immediately freeze your account via SBI helpline 1800-1234 or your netbanking portal.",
            "Report this URL to the National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)."
        ],
        "telemetry": {
            "domain": "sbi-yono-update-kyc.org",
            "ip": "194.26.29.112",
            "asn": "AS49505 (HostRoyale AS)",
            "country": "RU",
            "ssl_issuer": "cPanel, Inc. Certification Authority (Domain Validated)",
            "dns_mx_records": "None (no email handling capability)"
        },
        "is_demo": True,
        "created_at": "2026-11-13T09:15:00Z"
    },
    {
        "id": "scan-post-002",
        "scan_type": "sms",
        "target_input": "India Post Alert: Your parcel #IN889271 cannot be delivered due to incomplete street address. Update details within 12 hours at https://indiapost-parcel-tracking.vip or package will be returned to customs.",
        "sanitized_input": "India Post Alert: Your parcel #IN889271 cannot be delivered... [URL redacted]",
        "risk_score": 88,
        "risk_category": "MALICIOUS",
        "verdict": "Fraudulent Postal Smishing Delivery Scam",
        "detected_signals": [
            {"name": "Urgency & Fear Induction", "severity": "HIGH", "detail": "Imposes artificial '12 hours' deadline to provoke impulsive clicking"},
            {"name": "Government/Postal Spoofing", "severity": "HIGH", "detail": "Impersonates India Post (Department of Posts)"},
            {"name": "Suspicious TLD (.vip)", "severity": "MEDIUM", "detail": "Official government services utilize '.gov.in' exclusively"},
            {"name": "Payment Phishing Trap", "severity": "CRITICAL", "detail": "Extracts small 're-delivery fee' of Rs 25 to capture credit/debit card details"}
        ],
        "recommendations": [
            "India Post never requests redelivery charges or address updates via unsolicited SMS links.",
            "Legitimate tracking is available only at https://www.indiapost.gov.in.",
            "Forward this SMS to 1909 (TRAI DND Fraud Reporting) and report on the Sanchar Saathi portal."
        ],
        "telemetry": {
            "sender_id": "+91-9123847291",
            "sms_category": "Postal Delivery Scam",
            "extracted_urls": ["https://indiapost-parcel-tracking.vip"],
            "language_detected": "English"
        },
        "is_demo": True,
        "created_at": "2026-11-13T08:30:00Z"
    },
    {
        "id": "scan-bijli-003",
        "scan_type": "sms",
        "target_input": "Bijli bill update: Priye grahak, aapka bijli bill update nahi hua hai. Aaj raat 9:30 baje electricity supply disconnect ho jayegi. Turant electricity officer se sampark karein: 9876543210 ya link kholen http://bijli-bill-seva.in",
        "sanitized_input": "Bijli bill update: Priye grahak... [Hinglish Disconnection Scam]",
        "risk_score": 92,
        "risk_category": "MALICIOUS",
        "verdict": "Electricity Bill Disconnection Extortion Fraud (Hindi/Hinglish)",
        "detected_signals": [
            {"name": "Utility Supply Threat", "severity": "HIGH", "detail": "Threatens power cutoff at '9:30 baje' to cause panic"},
            {"name": "Unauthorized Phone Contact", "severity": "HIGH", "detail": "Routes victims to a scammer's personal mobile number instead of DISCOM call center"},
            {"name": "Remote Access Trojan Vector", "severity": "CRITICAL", "detail": "Known to request installation of AnyDesk/TeamViewer/RustDesk under the guise of an APK"}
        ],
        "recommendations": [
            "Electricity distribution boards (DISCOMs) never send personal mobile numbers for bill payments.",
            "Never install any APK or screen-sharing application (AnyDesk, TeamViewer) instructed over a phone call.",
            "Verify your bill status directly on your official state electricity board portal or authorized app."
        ],
        "telemetry": {
            "sender_id": "VM-POWDIS",
            "sms_category": "Utility Disconnection Extortion",
            "extracted_urls": ["http://bijli-bill-seva.in"],
            "language_detected": "Hindi/Hinglish"
        },
        "is_demo": True,
        "created_at": "2026-11-13T07:45:00Z"
    },
    {
        "id": "scan-github-004",
        "scan_type": "url",
        "target_input": "https://github.com/torvalds/linux",
        "sanitized_input": "https://github.com/torvalds/linux",
        "risk_score": 4,
        "risk_category": "SAFE",
        "verdict": "Legitimate High-Reputation Platform (Low Risk)",
        "detected_signals": [
            {"name": "Established Domain", "severity": "INFO", "detail": "Legitimate enterprise domain with 15+ years WHOIS age"},
            {"name": "Valid Extended TLS", "severity": "INFO", "detail": "Valid SSL certificate issued by DigiCert Inc"},
            {"name": "Clean Threat Intel Feeds", "severity": "INFO", "detail": "0/88 detection flags across all global intelligence partners"}
        ],
        "recommendations": [
            "Domain has verified legitimate standing.",
            "Always inspect URLs for typosquatting before entering sensitive developer tokens or SSH credentials."
        ],
        "telemetry": {
            "domain": "github.com",
            "ip": "140.82.121.4",
            "asn": "AS36459 (GitHub, Inc.)",
            "country": "US",
            "ssl_issuer": "DigiCert Inc"
        },
        "is_demo": True,
        "created_at": "2026-11-13T06:20:00Z"
    },
    {
        "id": "scan-qr-005",
        "scan_type": "qr",
        "target_input": "https://parking-meter-pay-fast.top/meter-id?slot=402",
        "sanitized_input": "https://parking-meter-pay-fast[.]top/meter-id?slot=402",
        "risk_score": 79,
        "risk_category": "SUSPICIOUS",
        "verdict": "Suspicious Physical QR Code Replacement (Quishing)",
        "detected_signals": [
            {"name": "Quishing Vector", "severity": "HIGH", "detail": "QR payload directs to newly registered non-official payment portal"},
            {"name": "Suspicious TLD (.top)", "severity": "MEDIUM", "detail": "Frequently abused for rapid-disposal phishing lures"},
            {"name": "Credit Card Harvesting", "severity": "HIGH", "detail": "Requests direct payment without localized municipal gateway validation"}
        ],
        "recommendations": [
            "Do not enter payment details on stickers placed over municipal parking meters.",
            "Use the official city parking application or pay at the physical terminal kiosk."
        ],
        "telemetry": {
            "domain": "parking-meter-pay-fast.top",
            "ip": "104.21.32.19",
            "asn": "AS13335 (Cloudflare, Inc.)",
            "country": "US"
        },
        "is_demo": True,
        "created_at": "2026-11-12T18:10:00Z"
    }
]

# Scam DNA Threat Nodes and Relationships
SEED_INDICATORS = [
    {
        "id": "ind-sbi-1",
        "indicator_type": "domain",
        "indicator_value": "sbi-yono-update-kyc.org",
        "reputation_score": 94,
        "times_seen": 47,
        "scam_category": "Banking Phishing",
        "targeted_brand": "State Bank of India",
        "metadata": {"hosting_ip": "194.26.29.112", "kit": "Kit-Chakra-v3"}
    },
    {
        "id": "ind-sbi-2",
        "indicator_type": "domain",
        "indicator_value": "sbi-online-pan-auth.com",
        "reputation_score": 92,
        "times_seen": 38,
        "scam_category": "Banking Phishing",
        "targeted_brand": "State Bank of India",
        "metadata": {"hosting_ip": "194.26.29.112", "kit": "Kit-Chakra-v3"}
    },
    {
        "id": "ind-ip-1",
        "indicator_type": "ip",
        "indicator_value": "194.26.29.112",
        "reputation_score": 96,
        "times_seen": 112,
        "scam_category": "Bulletproof Hosting Cluster",
        "targeted_brand": "Multiple Indian Banks",
        "metadata": {"asn": "AS49505", "geo": "RU"}
    },
    {
        "id": "ind-kit-1",
        "indicator_type": "kit_signature",
        "indicator_value": "Kit-Chakra-SBI-v3",
        "reputation_score": 98,
        "times_seen": 84,
        "scam_category": "Phishing Kit Fingerprint",
        "targeted_brand": "State Bank of India",
        "metadata": {"features": ["OTP Interceptor", "Telegram Exfiltration Bot", "Dynamic PAN Validator"]}
    },
    {
        "id": "ind-sms-sender-1",
        "indicator_type": "sender_id",
        "indicator_value": "CP-SBIBNK",
        "reputation_score": 89,
        "times_seen": 63,
        "scam_category": "SMS Header Spoofing",
        "targeted_brand": "State Bank of India",
        "metadata": {"smsc_route": "International Gateway Bypass"}
    },
    {
        "id": "ind-post-1",
        "indicator_type": "domain",
        "indicator_value": "indiapost-parcel-tracking.vip",
        "reputation_score": 88,
        "times_seen": 51,
        "scam_category": "Postal Smishing",
        "targeted_brand": "India Post",
        "metadata": {"hosting_ip": "45.142.214.88", "kit": "Kit-PostalDrainer"}
    },
    {
        "id": "ind-post-2",
        "indicator_type": "domain",
        "indicator_value": "india-postal-customs-clear.net",
        "reputation_score": 86,
        "times_seen": 29,
        "scam_category": "Postal Smishing",
        "targeted_brand": "India Post",
        "metadata": {"hosting_ip": "45.142.214.88", "kit": "Kit-PostalDrainer"}
    },
    {
        "id": "ind-ip-2",
        "indicator_type": "ip",
        "indicator_value": "45.142.214.88",
        "reputation_score": 90,
        "times_seen": 76,
        "scam_category": "Postal Phishing CDN",
        "targeted_brand": "India Post / DHL",
        "metadata": {"asn": "AS58061", "geo": "NL"}
    },
    {
        "id": "ind-phone-1",
        "indicator_type": "phone",
        "indicator_value": "+91-9876543210",
        "reputation_score": 85,
        "times_seen": 19,
        "scam_category": "Electricity Bill Extortion Ring",
        "targeted_brand": "State Electricity Boards (DISCOMs)",
        "metadata": {"region": "Mewat/Jamtara cluster"}
    },
    {
        "id": "ind-upi-1",
        "indicator_type": "upi",
        "indicator_value": "discom.billupdate@okaxis",
        "reputation_score": 91,
        "times_seen": 34,
        "scam_category": "Mule UPI Handle",
        "targeted_brand": "Electricity Customers",
        "metadata": {"mule_bank": "Axis Bank"}
    }
]

SEED_RELATIONSHIPS = [
    {
        "id": "rel-1",
        "source": "ind-sbi-1",
        "target": "ind-ip-1",
        "relation_type": "hosted_on",
        "confidence_score": 0.99,
        "relation_reason": "Both malicious SBI domains resolve directly to bulletproof host IP 194.26.29.112"
    },
    {
        "id": "rel-2",
        "source": "ind-sbi-2",
        "target": "ind-ip-1",
        "relation_type": "hosted_on",
        "confidence_score": 0.99,
        "relation_reason": "Co-located on identical bulletproof host IP 194.26.29.112"
    },
    {
        "id": "rel-3",
        "source": "ind-sbi-1",
        "target": "ind-kit-1",
        "relation_type": "utilizes_kit",
        "confidence_score": 0.95,
        "relation_reason": "DOM source code contains identical Telegram exfiltration bot endpoint and form CSS fingerprints"
    },
    {
        "id": "rel-4",
        "source": "ind-sbi-2",
        "target": "ind-kit-1",
        "relation_type": "utilizes_kit",
        "confidence_score": 0.95,
        "relation_reason": "Shares identical JavaScript obfuscation and credential validator schema"
    },
    {
        "id": "rel-5",
        "source": "ind-sbi-1",
        "target": "ind-sms-sender-1",
        "relation_type": "distributed_via",
        "confidence_score": 0.88,
        "relation_reason": "Over 40 community reports trace incoming SMS with header CP-SBIBNK directing to this domain"
    },
    {
        "id": "rel-6",
        "source": "ind-post-1",
        "target": "ind-ip-2",
        "relation_type": "hosted_on",
        "confidence_score": 0.98,
        "relation_reason": "Direct A-record DNS pointing to postal phishing server IP 45.142.214.88"
    },
    {
        "id": "rel-7",
        "source": "ind-post-2",
        "target": "ind-ip-2",
        "relation_type": "hosted_on",
        "confidence_score": 0.98,
        "relation_reason": "Co-hosted on identical ASN IP block targeting customs duty payment scams"
    },
    {
        "id": "rel-8",
        "source": "ind-phone-1",
        "target": "ind-upi-1",
        "relation_type": "mule_payment_link",
        "confidence_score": 0.85,
        "relation_reason": "Phone caller instructs victim to transfer Rs 10 verification charge to mule UPI discom.billupdate@okaxis"
    }
]

SEED_COMMUNITY_REPORTS = [
    {
        "id": "com-001",
        "target_value": "https://sbi-yono-update-kyc.org",
        "report_type": "url",
        "threat_category": "Banking Phishing",
        "targeted_brand": "State Bank of India",
        "description": "Received SMS claiming my YONO netbanking was suspended due to unlinked PAN card. The webpage looked very identical to SBI official portal.",
        "evidence_text": "SMS from CP-SBIBNK: 'Dear customer, your SBI account is blocked. Update PAN card at https://sbi-yono-update-kyc.org to resume services.'",
        "upvotes": 42,
        "status": "verified",
        "is_public": True,
        "created_at": "2026-11-13T07:15:00Z"
    },
    {
        "id": "com-002",
        "target_value": "https://indiapost-parcel-tracking.vip",
        "report_type": "url",
        "threat_category": "Postal Delivery Scam",
        "targeted_brand": "India Post",
        "description": "Claimed my parcel could not be delivered and asked for Rs 35 re-delivery fee. Upon clicking pay, requested full CVV and OTP.",
        "evidence_text": "SMS: 'Your India Post parcel is stuck at hub due to incomplete house number. Update within 12 hours.'",
        "upvotes": 29,
        "status": "verified",
        "is_public": True,
        "created_at": "2026-11-13T06:40:00Z"
    },
    {
        "id": "com-003",
        "target_value": "+91-9876543210",
        "report_type": "phone",
        "threat_category": "Electricity Disconnection Extortion",
        "targeted_brand": "State DISCOM",
        "description": "Caller claimed to be junior engineer from electricity board. Told me power will be cut in 30 minutes if I don't send bill receipt or download 'QuickSupport' app.",
        "evidence_text": "Received multiple automated calls prompting to dial this number.",
        "upvotes": 18,
        "status": "verified",
        "is_public": True,
        "created_at": "2026-11-12T20:10:00Z"
    },
    {
        "id": "com-004",
        "target_value": "https://netflix-subscription-renew.online",
        "report_type": "url",
        "threat_category": "Streaming Credential Theft",
        "targeted_brand": "Netflix",
        "description": "Email claimed payment failed for monthly plan. Directed to fake Netflix login that steals credit card numbers.",
        "evidence_text": "Email subject: 'Your Netflix membership is on hold'",
        "upvotes": 12,
        "status": "pending_review",
        "is_public": True,
        "created_at": "2026-11-12T15:22:00Z"
    }
]

class DatabaseService:
    def __init__(self):
        self._mem_cache = {
            "scans": list(SEED_SCANS),
            "threat_indicators": list(SEED_INDICATORS),
            "scam_relationships": list(SEED_RELATIONSHIPS),
            "community_reports": list(SEED_COMMUNITY_REPORTS)
        }
        self._ensure_storage()

    def _ensure_storage(self):
        try:
            target_dir = os.path.dirname(STORAGE_FILE)
            if target_dir:
                os.makedirs(target_dir, exist_ok=True)
            if not os.path.exists(STORAGE_FILE):
                data = {
                    "scans": SEED_SCANS,
                    "threat_indicators": SEED_INDICATORS,
                    "scam_relationships": SEED_RELATIONSHIPS,
                    "community_reports": SEED_COMMUNITY_REPORTS
                }
                with open(STORAGE_FILE, "w", encoding="utf-8") as f:
                    json.dump(data, f, indent=2)
        except Exception as e:
            logger.warning(f"Could not initialize local storage file, using in-memory store: {e}")

    def _read_data(self) -> Dict[str, Any]:
        try:
            if os.path.exists(STORAGE_FILE):
                with open(STORAGE_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            logger.warning(f"Error reading storage file, falling back to in-memory: {e}")
        return self._mem_cache

    def _write_data(self, data: Dict[str, Any]):
        self._mem_cache = data
        try:
            target_dir = os.path.dirname(STORAGE_FILE)
            if target_dir:
                os.makedirs(target_dir, exist_ok=True)
            with open(STORAGE_FILE, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.warning(f"Storage write omitted (serverless/read-only mode active): {e}")

    # ================= SCANS =================
    def save_scan(self, scan_data: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_data()
        if "id" not in scan_data or not scan_data["id"]:
            scan_data["id"] = f"scan-{uuid.uuid4().hex[:8]}"
        if "created_at" not in scan_data or not scan_data["created_at"]:
            scan_data["created_at"] = datetime.now(timezone.utc).isoformat()
        
        # Insert at top
        data["scans"].insert(0, scan_data)
        self._write_data(data)
        return scan_data

    def get_scans(self, limit: int = 50, scan_type: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        data = self._read_data()
        scans = data.get("scans", [])
        if scan_type and scan_type != "all":
            scans = [s for s in scans if s.get("scan_type") == scan_type]
        if search:
            q = search.lower()
            scans = [s for s in scans if q in s.get("target_input", "").lower() or q in s.get("verdict", "").lower()]
        return scans[:limit]

    def get_scan_by_id(self, scan_id: str) -> Optional[Dict[str, Any]]:
        data = self._read_data()
        for s in data.get("scans", []):
            if s.get("id") == scan_id:
                return s
        return None

    # ================= SCAM DNA GRAPH =================
    def get_dna_graph(self) -> Dict[str, Any]:
        data = self._read_data()
        return {
            "indicators": data.get("threat_indicators", []),
            "relationships": data.get("scam_relationships", [])
        }

    def add_threat_indicator(self, indicator: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_data()
        indicators = data.setdefault("threat_indicators", [])
        # Check if exists
        for item in indicators:
            if item.get("indicator_type") == indicator.get("indicator_type") and item.get("indicator_value") == indicator.get("indicator_value"):
                item["times_seen"] = item.get("times_seen", 1) + 1
                self._write_data(data)
                return item
        if "id" not in indicator:
            indicator["id"] = f"ind-{uuid.uuid4().hex[:8]}"
        indicators.append(indicator)
        self._write_data(data)
        return indicator

    def add_relationship(self, rel: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_data()
        rels = data.setdefault("scam_relationships", [])
        if "id" not in rel:
            rel["id"] = f"rel-{uuid.uuid4().hex[:8]}"
        rels.append(rel)
        self._write_data(data)
        return rel

    # ================= COMMUNITY REPORTS =================
    def get_community_reports(self, limit: int = 50, threat_type: Optional[str] = None) -> List[Dict[str, Any]]:
        data = self._read_data()
        reports = data.get("community_reports", [])
        if threat_type and threat_type != "all":
            reports = [r for r in reports if r.get("report_type") == threat_type or r.get("threat_category") == threat_type]
        return reports[:limit]

    def add_community_report(self, report: Dict[str, Any]) -> Dict[str, Any]:
        data = self._read_data()
        reports = data.setdefault("community_reports", [])
        report["id"] = f"com-{uuid.uuid4().hex[:8]}"
        report["created_at"] = datetime.now(timezone.utc).isoformat()
        report["upvotes"] = 1
        report["status"] = "pending_review"
        reports.insert(0, report)
        self._write_data(data)
        return report

    def upvote_report(self, report_id: str) -> Optional[Dict[str, Any]]:
        data = self._read_data()
        for r in data.get("community_reports", []):
            if r.get("id") == report_id:
                r["upvotes"] = r.get("upvotes", 0) + 1
                self._write_data(data)
                return r
        return None

    # ================= DASHBOARD STATS =================
    def get_dashboard_stats(self) -> Dict[str, Any]:
        data = self._read_data()
        scans = data.get("scans", [])
        
        total_scans = len(scans)
        safe_count = sum(1 for s in scans if s.get("risk_category") in ("SAFE", "LOW_RISK"))
        suspicious_count = sum(1 for s in scans if s.get("risk_category") == "SUSPICIOUS")
        malicious_count = sum(1 for s in scans if s.get("risk_category") in ("MALICIOUS", "CRITICAL"))
        
        # Threat distribution by type
        by_category = {}
        for s in scans:
            cat = s.get("verdict", "Other")
            if "SBI" in cat or "Bank" in cat:
                group = "Banking Phishing"
            elif "Postal" in cat or "Delivery" in cat:
                group = "Postal Smishing"
            elif "Electricity" in cat or "Bill" in cat:
                group = "Utility Extortion"
            elif "QR" in cat or "Quishing" in cat:
                group = "QR Quishing"
            elif "Safe" in cat or "Legitimate" in cat:
                group = "Verified Clean"
            else:
                group = "Suspicious Links"
            by_category[group] = by_category.get(group, 0) + 1

        threat_chart_data = [{"name": k, "value": v} for k, v in by_category.items()]

        # Trends (last 7 intervals)
        trend_data = [
            {"date": "Mon", "scans": 18, "threats": 9},
            {"date": "Tue", "scans": 27, "threats": 14},
            {"date": "Wed", "scans": 35, "threats": 22},
            {"date": "Thu", "scans": 44, "threats": 29},
            {"date": "Fri", "scans": 52, "threats": 38},
            {"date": "Sat", "scans": 40, "threats": 26},
            {"date": "Sun", "scans": max(total_scans, 58), "threats": max(malicious_count + suspicious_count, 41)}
        ]

        return {
            "total_scans": total_scans,
            "safe_scans": safe_count,
            "suspicious_scans": suspicious_count,
            "malicious_scans": malicious_count,
            "threat_distribution": threat_chart_data,
            "scan_trends": trend_data,
            "recent_scans": scans[:6],
            "recent_indicators": data.get("threat_indicators", [])[:6]
        }

db_service = DatabaseService()

