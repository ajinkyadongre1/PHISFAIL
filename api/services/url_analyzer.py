import re
import socket
import ipaddress
import math
from urllib.parse import urlparse, parse_qs
from typing import Dict, List, Any, Tuple
import logging
from backend.services.threat_intel import threat_intel_service

logger = logging.getLogger("phisfail.url_analyzer")

# High-profile brands frequently targeted by phishing campaigns
TARGETED_BRANDS = {
    "sbi": "State Bank of India (SBI)",
    "yono": "SBI YONO Banking",
    "hdfc": "HDFC Bank",
    "icici": "ICICI Bank",
    "axis": "Axis Bank",
    "paytm": "Paytm Payments",
    "phonepe": "PhonePe",
    "gpay": "Google Pay",
    "paypal": "PayPal",
    "netflix": "Netflix",
    "amazon": "Amazon",
    "apple": "Apple ID",
    "microsoft": "Microsoft 365",
    "google": "Google Accounts",
    "binance": "Binance Crypto",
    "metamask": "MetaMask Wallet",
    "indiapost": "India Post",
    "incometax": "Income Tax Department of India",
    "irctc": "IRCTC Railways",
    "whatsapp": "WhatsApp Support",
    "telegram": "Telegram Web",
    "instagram": "Instagram Security"
}

SUSPICIOUS_TLDS = {
    "top", "xyz", "club", "work", "click", "gq", "cf", "tk", "ml", "ga",
    "zip", "mov", "ru", "country", "live", "icu", "rest", "cam", "vip", "monster"
}

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "verification", "update", "secure", "security",
    "account", "banking", "netbanking", "kyc", "pan-card", "aadhaar", "wallet",
    "claim", "bonus", "free", "lottery", "suspended", "blocked", "restore",
    "password", "auth", "token", "refund", "support", "billing"
]

PRIVATE_IP_RANGES = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),
    ipaddress.ip_network("100.64.0.0/10"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def is_private_or_restricted_ip(ip_str: str) -> bool:
    """SSRF Protection: Check if resolved IP belongs to private/loopback/cloud-metadata."""
    try:
        ip = ipaddress.ip_address(ip_str)
        if ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_unspecified or ip.is_private:
            return True
        return any(ip in net for net in PRIVATE_IP_RANGES)
    except ValueError:
        return False

def calculate_shannon_entropy(s: str) -> float:
    """Calculates Shannon entropy of domain or path string to detect DGA or randomness."""
    if not s:
        return 0.0
    prob = [float(s.count(c)) / len(s) for c in dict.fromkeys(list(s))]
    return -sum(p * math.log2(p) for p in prob)

def detect_homoglyphs(text: str) -> Tuple[bool, List[str]]:
    """Detects Cyrillic, Greek, or non-Latin lookalike characters (Punycode attack)."""
    homoglyphs_found = []
    has_homoglyph = False
    
    # Common Cyrillic lookalikes to Latin letters
    cyrillic_map = {
        '\u0430': 'a', '\u0435': 'e', '\u043e': 'o', '\u0440': 'p',
        '\u0441': 'c', '\u0443': 'y', '\u0445': 'x', '\u0456': 'i',
        '\u0410': 'A', '\u0412': 'B', '\u0415': 'E', '\u041a': 'K',
        '\u041c': 'M', '\u041d': 'H', '\u041e': 'O', '\u0420': 'P',
        '\u0421': 'C', '\u0422': 'T', '\u0425': 'X'
    }
    
    for ch in text:
        if ch in cyrillic_map:
            has_homoglyph = True
            homoglyphs_found.append(f"Cyrillic character '{ch}' masquerading as Latin '{cyrillic_map[ch]}'")
        elif ord(ch) > 127 and ch not in ".-_/":
            has_homoglyph = True
            homoglyphs_found.append(f"Non-ASCII Unicode codepoint U+{ord(ch):04X} ('{ch}')")
            
    return has_homoglyph, list(set(homoglyphs_found))

class URLAnalyzer:
    async def analyze(self, raw_url: str) -> Dict[str, Any]:
        """
        Performs holistic multi-stage security analysis of a URL.
        """
        # Ensure scheme
        url = raw_url.strip()
        if not re.match(r'^[a-zA-Z]+://', url):
            url = 'https://' + url
            
        parsed = urlparse(url)
        hostname = (parsed.hostname or "").lower()
        path = parsed.path
        query = parsed.query
        scheme = parsed.scheme.lower()
        port = parsed.port
        
        detected_signals = []
        risk_score = 0
        targeted_brand = None
        
        # 1. SSRF & IP Validation
        is_ip_domain = False
        resolved_ip = None
        try:
            # Check if hostname itself is raw IP
            ip_obj = ipaddress.ip_address(hostname)
            is_ip_domain = True
            resolved_ip = str(ip_obj)
            if is_private_or_restricted_ip(resolved_ip):
                return {
                    "error": "Access Denied: SSRF Protection. Internal or private IP targets cannot be scanned.",
                    "risk_score": 100,
                    "risk_category": "CRITICAL",
                    "verdict": "Blocked Internal SSRF Target",
                    "detected_signals": [{"name": "SSRF Guard Triggered", "severity": "CRITICAL", "detail": f"Target resolves to internal restricted network {resolved_ip}"}],
                    "recommendations": ["Do not attempt to scan internal server boundaries or private infrastructure."]
                }
            detected_signals.append({
                "name": "Direct IP-based URL",
                "severity": "HIGH",
                "detail": f"URL uses raw IP address ({resolved_ip}) rather than a legitimate registered domain name."
            })
            risk_score += 35
        except ValueError:
            # Hostname is a domain name. Resolve safely via DNS without connecting
            try:
                addr_info = socket.getaddrinfo(hostname, None, socket.AF_INET)
                if not addr_info:
                    addr_info = socket.getaddrinfo(hostname, None)
                if addr_info:
                    resolved_ip = addr_info[0][4][0]
                    if is_private_or_restricted_ip(resolved_ip):
                        return {
                            "error": "Access Denied: SSRF Protection. Domain resolves to private or internal loopback IP.",
                            "risk_score": 100,
                            "risk_category": "CRITICAL",
                            "verdict": "Blocked Internal Loopback Target",
                            "detected_signals": [{"name": "DNS Rebinding / SSRF", "severity": "CRITICAL", "detail": f"Domain resolves to {resolved_ip}"}],
                            "recommendations": ["Internal IPs are protected and cannot be evaluated."]
                        }
            except Exception:
                resolved_ip = "Unresolved (NXDOMAIN)"

        # 2. Protocol & Port Signals
        if scheme == "http":
            detected_signals.append({
                "name": "Insecure HTTP Protocol",
                "severity": "MEDIUM",
                "detail": "Data transmitted without TLS encryption, vulnerable to Man-in-the-Middle (MitM) eavesdropping."
            })
            risk_score += 15
        elif scheme != "https":
            detected_signals.append({
                "name": "Unusual Protocol Scheme",
                "severity": "HIGH",
                "detail": f"Non-standard web scheme '{scheme}://' used."
            })
            risk_score += 25
            
        if port and port not in (80, 443):
            detected_signals.append({
                "name": "Non-Standard Port",
                "severity": "MEDIUM",
                "detail": f"Web service runs on non-standard port {port}, commonly seen on disposable or compromised hosting."
            })
            risk_score += 15

        # 3. Homoglyph / Punycode Attacks
        if "xn--" in hostname:
            detected_signals.append({
                "name": "IDN Punycode Encoding",
                "severity": "HIGH",
                "detail": f"Domain uses Punycode ({hostname}), often used to mimic popular brands with visually identical characters."
            })
            risk_score += 30
            
        has_homoglyphs, homoglyph_details = detect_homoglyphs(hostname)
        if has_homoglyphs:
            detected_signals.append({
                "name": "Homoglyph Character Spoofing",
                "severity": "CRITICAL",
                "detail": f"Detected lookalike Unicode characters: {'; '.join(homoglyph_details[:2])}"
            })
            risk_score += 40

        # 4. Domain Impersonation & Typosquatting
        domain_parts = hostname.split('.')
        tld = domain_parts[-1] if len(domain_parts) > 1 else ""
        subdomain = ".".join(domain_parts[:-2]) if len(domain_parts) > 2 else ""
        base_domain = ".".join(domain_parts[-2:]) if len(domain_parts) >= 2 else hostname

        # Brand search
        for brand_key, brand_name in TARGETED_BRANDS.items():
            if brand_key in hostname.lower():
                # Is it the authentic official domain?
                is_legit = False
                if brand_key == "sbi" and base_domain in ("sbi.co.in", "onlinesbi.sbi", "statebankofindia.com"):
                    is_legit = True
                elif brand_key == "google" and base_domain in ("google.com", "google.co.in"):
                    is_legit = True
                elif brand_key == "netflix" and base_domain == "netflix.com":
                    is_legit = True
                elif brand_key == "amazon" and base_domain in ("amazon.com", "amazon.in"):
                    is_legit = True
                elif brand_key == "apple" and base_domain == "apple.com":
                    is_legit = True
                elif brand_key == "microsoft" and base_domain in ("microsoft.com", "live.com", "office.com"):
                    is_legit = True
                elif brand_key == "paypal" and base_domain == "paypal.com":
                    is_legit = True
                elif brand_key == "indiapost" and (base_domain == "indiapost.gov.in" or hostname.endswith(".gov.in")):
                    is_legit = True
                    
                if not is_legit:
                    targeted_brand = brand_name
                    detected_signals.append({
                        "name": "Brand Typosquatting / Impersonation",
                        "severity": "CRITICAL",
                        "detail": f"Domain mimics {brand_name} without authorized domain ownership ({base_domain})."
                    })
                    risk_score += 45
                    break

        # 5. Suspicious TLD
        if tld in SUSPICIOUS_TLDS:
            detected_signals.append({
                "name": f"High-Abuse Top-Level Domain (.{tld})",
                "severity": "HIGH",
                "detail": f"TLD '.{tld}' is disproportionately associated with disposable bulletproof domains and botnet infrastructure."
            })
            risk_score += 25

        # 6. Subdomain Depth & Hyphenation
        if len(domain_parts) > 3:
            detected_signals.append({
                "name": "Excessive Subdomain Stacking",
                "severity": "MEDIUM",
                "detail": f"Domain contains {len(domain_parts)} hierarchical labels, commonly used to trick users on mobile address bars."
            })
            risk_score += 15
            
        hyphen_count = hostname.count('-')
        if hyphen_count >= 3:
            detected_signals.append({
                "name": "Multiple Hyphens in Domain",
                "severity": "MEDIUM",
                "detail": f"Found {hyphen_count} hyphens in hostname, typical of automated brand spoofing generators."
            })
            risk_score += 15

        # 7. Suspicious Keywords in Path or Hostname
        full_url_lower = url.lower()
        matched_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in full_url_lower]
        if matched_keywords:
            severity = "HIGH" if len(matched_keywords) >= 2 else "MEDIUM"
            detected_signals.append({
                "name": "Phishing Bait Keywords",
                "severity": severity,
                "detail": f"Contains high-risk social engineering terminology: {', '.join(matched_keywords[:4])}."
            })
            risk_score += min(len(matched_keywords) * 10, 30)

        # 8. Open Redirect & Embedded URL parameters
        parsed_params = parse_qs(query)
        for param, vals in parsed_params.items():
            for v in vals:
                if v.startswith("http://") or v.startswith("https://"):
                    detected_signals.append({
                        "name": "Embedded Secondary Destination (Open Redirect)",
                        "severity": "HIGH",
                        "detail": f"Query parameter '{param}' redirects to secondary destination '{v[:40]}...'."
                    })
                    risk_score += 25
                    break

        # 9. Query & Path Entropy
        path_entropy = calculate_shannon_entropy(path + query)
        if path_entropy > 4.5 and len(path + query) > 30:
            detected_signals.append({
                "name": "High Information Entropy",
                "severity": "MEDIUM",
                "detail": f"Path & parameters exhibit high randomness (entropy: {path_entropy:.2f}), suggesting obfuscated payloads or victim session tokens."
            })
            risk_score += 15

        # 10. Query External Threat Intelligence Adapters
        sb_result = await threat_intel_service.check_google_safe_browsing(url)
        vt_result = await threat_intel_service.check_virustotal(url)
        
        if sb_result.get("is_flagged"):
            detected_signals.append({
                "name": "Google Safe Browsing Match",
                "severity": "CRITICAL",
                "detail": sb_result.get("details", "Flagged in threat feeds.")
            })
            risk_score += 45
            
        if vt_result.get("is_flagged"):
            detected_signals.append({
                "name": "VirusTotal Vendor Consensus",
                "severity": "CRITICAL",
                "detail": vt_result.get("details", "Flagged by security engines.")
            })
            risk_score += 40

        # Clamp risk score
        final_score = min(max(risk_score, 0), 100)
        
        # Risk Category classification
        if final_score >= 70:
            risk_category = "MALICIOUS"
            verdict = f"High Risk Phishing / Malicious Site targeting {targeted_brand}" if targeted_brand else "Malicious Web Threat"
        elif final_score >= 35:
            risk_category = "SUSPICIOUS"
            verdict = f"Suspicious Activity / Potential {targeted_brand} Spoof" if targeted_brand else "Suspicious Digital Signals Detected"
        elif final_score >= 15:
            risk_category = "LOW_RISK"
            verdict = "Low Risk (Minor Anomalies Detected)"
        else:
            risk_category = "SAFE"
            verdict = "Low Risk (No Active Anomalies Found)"

        # Protective Recommendations
        recommendations = []
        if risk_category in ("MALICIOUS", "CRITICAL"):
            recommendations.append("DO NOT enter credentials, OTPs, credit cards, or personal identifiers.")
            recommendations.append("Close the browser tab immediately and avoid downloading any suggested files or APKs.")
            recommendations.append("Report this domain to local cybersecurity authorities (e.g., 1930 in India / cybercrime.gov.in or IC3).")
            if targeted_brand:
                recommendations.append(f"If you suspect your {targeted_brand} credentials were breached, change your password immediately on the official website.")
        elif risk_category == "SUSPICIOUS":
            recommendations.append("Exercise extreme caution: Verify the domain carefully before proceeding.")
            recommendations.append("Look for the exact official domain in a search engine instead of following provided links.")
            recommendations.append("Never approve unsolicited push authentications or SMS OTPs.")
        else:
            recommendations.append("No critical indicators detected. However, zero-day phishing sites may evade static databases.")
            recommendations.append("Always verify the sender and confirm HTTPS padlock before submitting confidential details.")

        sanitized_input = url.replace("http://", "hxxp://").replace("https://", "hxxps://").replace(".", "[.]")

        return {
            "target_input": raw_url,
            "sanitized_input": sanitized_input,
            "risk_score": final_score,
            "risk_category": risk_category,
            "verdict": verdict,
            "detected_signals": detected_signals,
            "recommendations": recommendations,
            "telemetry": {
                "domain": hostname,
                "base_domain": base_domain,
                "resolved_ip": resolved_ip,
                "scheme": scheme,
                "tld": tld,
                "path_entropy": round(path_entropy, 2),
                "safe_browsing": sb_result,
                "virustotal": vt_result
            }
        }

url_analyzer = URLAnalyzer()
