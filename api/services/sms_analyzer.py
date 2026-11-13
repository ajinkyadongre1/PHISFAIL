import re
from typing import Dict, List, Any
import logging

logger = logging.getLogger("phisfail.sms_analyzer")

# Multi-lingual scam pattern signatures (English, Hindi, and Hinglish)
URGENCY_PATTERNS = [
    (r"\b(immediately|urgent|urgently|within \d+ hours?|today only|last chance|final notice|24 hours?|12 hours?)\b", "Artificial Deadline / Urgency"),
    (r"\b(turant|aaj hi|aaj raat|jaldi karein|antim chetavni|samay seema)\b", "Urgency / Threat (Hindi/Hinglish)"),
    (r"\b(suspended|blocked|terminated|cancelled|disconnected|deactivated)\b", "Account Suspension / Service Cutoff"),
    (r"\b(disconnect|kat jayegi|band ho jayega|rok diya gaya|khatam)\b", "Utility / Service Termination (Hinglish)"),
    (r"\b(arrest warrant|police complaint|fir registered|cbi|rbi investigation|cyber cell action|legal action)\b", "Legal Intimidation / Police Impersonation"),
]

IMPERSONATION_PATTERNS = [
    (r"\b(sbi|state bank|yono|hdfc|icici|axis|pnb|paytm|phonepe|gpay)\b", "Banking Institution Spoofing"),
    (r"\b(india post|postal department|customs|courier hub|consignment|parcel)\b", "Postal / Logistics Delivery Scam"),
    (r"\b(electricity board|discom|bijli vibhag|electricity officer|power supply)\b", "Utility / DISCOM Impersonation"),
    (r"\b(income tax|it department|tax refund|itr verification|rbi)\b", "Government / Tax Authority Impersonation"),
    (r"\b(telecom|trai|sim card|esim upgrade|sim verification)\b", "Telecom Carrier / SIM Swap Scam")
]

CREDENTIAL_HARVESTING_PATTERNS = [
    (r"\b(update (?:pan|aadhaar|kyc|profile|details)|link (?:pan|aadhaar|card))\b", "KYC / Identity Document Theft"),
    (r"\b(kyc update|pan link|aadhaar jodein|dastavez jama)\b", "KYC Phishing (Hinglish)"),
    (r"\b(verify otp|share otp|one time password|pin|cvv|password)\b", "OTP / Financial Credential Harvesting"),
    (r"\b(download apk|install app|anydesk|teamviewer|rustdesk|quicksupport)\b", "Remote Access Trojan (RAT) Injection Vector"),
]

PAYMENT_FRAUD_PATTERNS = [
    (r"\b(won lottery|kbc prize|lucky draw|cash prize|congratulations you won)\b", "Lottery / Prize Scam"),
    (r"\b(lottery jeeta|inaam mila|crorepati|bada tohfa)\b", "Lottery Scam (Hinglish)"),
    (r"\b(part[- ]time job|earn (?:rs|inr|\$)\s*\d+.*daily|like youtube videos|rate hotels)\b", "Task / Telegram Work Scam"),
    (r"\b(pay rs\.?\s*\d+|re-delivery fee|processing fee|clearance charge|security deposit)\b", "Upfront Advance Fee Fraud"),
    (r"\b(paytm|gpay|phonepe|upi|@okhdfc|@okaxis|@ybl|@paytm)\b", "Direct Mule UPI Solicitation")
]

class SMSAnalyzer:
    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyzes SMS, WhatsApp, or OCR-extracted message for fraud patterns.
        """
        cleaned_text = text.strip()
        lower_text = cleaned_text.lower()
        
        detected_signals = []
        highlight_spans = []
        risk_score = 0
        detected_category = "General Suspicion"
        
        # 1. URL extraction
        url_pattern = r'https?://[^\s<>"]+|www\.[^\s<>"]+|[a-zA-Z0-9-]+\.(?:top|vip|xyz|online|org|site|shop|in|net|com)/[^\s<>"]*'
        found_urls = re.findall(url_pattern, cleaned_text)
        if found_urls:
            detected_signals.append({
                "name": "Unsolicited Embedded Links",
                "severity": "HIGH",
                "detail": f"Contains suspicious web links ({len(found_urls)} found). Legitimate institutions rarely send unshortened direct update links via SMS."
            })
            risk_score += 30
            for u in found_urls:
                highlight_spans.append({"phrase": u, "category": "Link", "severity": "HIGH"})

        # 2. Extract Phone numbers
        phone_pattern = r'(?:\+?91[\-\s]?)?[6-9]\d{9}\b'
        found_phones = re.findall(phone_pattern, cleaned_text)
        if found_phones and any(k in lower_text for k in ["call", "contact", "dial", "officer", "sampark"]):
            detected_signals.append({
                "name": "Personal Contact Solicitation",
                "severity": "HIGH",
                "detail": f"Routes recipient to call personal mobile numbers ({', '.join(found_phones[:2])}) instead of verified enterprise toll-free helplines."
            })
            risk_score += 25
            for p in found_phones:
                highlight_spans.append({"phrase": p, "category": "Phone", "severity": "HIGH"})

        # 3. Urgency & Threat Checks
        for pat, desc in URGENCY_PATTERNS:
            match = re.search(pat, lower_text)
            if match:
                detected_signals.append({
                    "name": f"Psychological Pressure: {desc}",
                    "severity": "HIGH",
                    "detail": f"Leverages emotional trigger '{match.group(0)}' to prompt immediate uncritical reaction."
                })
                risk_score += 25
                highlight_spans.append({"phrase": match.group(0), "category": "Urgency", "severity": "HIGH"})
                break

        # 4. Impersonation Checks
        for pat, desc in IMPERSONATION_PATTERNS:
            match = re.search(pat, lower_text)
            if match:
                detected_signals.append({
                    "name": f"Brand Spoofing: {desc}",
                    "severity": "HIGH",
                    "detail": f"Impersonates trusted institution or public authority: '{match.group(0).upper()}'."
                })
                risk_score += 30
                highlight_spans.append({"phrase": match.group(0), "category": "Impersonation", "severity": "HIGH"})
                if "bank" in desc.lower():
                    detected_category = "Banking & KYC Fraud"
                elif "postal" in desc.lower():
                    detected_category = "Postal Smishing Scam"
                elif "utility" in desc.lower():
                    detected_category = "Electricity Extortion Scam"
                elif "tax" in desc.lower():
                    detected_category = "Government Impersonation"
                break

        # 5. Credential Harvesting & Remote Access Trojans
        for pat, desc in CREDENTIAL_HARVESTING_PATTERNS:
            match = re.search(pat, lower_text)
            if match:
                severity = "CRITICAL" if any(k in match.group(0) for k in ["apk", "anydesk", "teamviewer", "otp"]) else "HIGH"
                detected_signals.append({
                    "name": f"Exploit Mechanism: {desc}",
                    "severity": severity,
                    "detail": f"Attempts unauthorized credential extraction or device takeover ('{match.group(0)}')."
                })
                risk_score += 35
                highlight_spans.append({"phrase": match.group(0), "category": "Harvesting", "severity": severity})
                break

        # 6. Payment & Lottery Fraud
        for pat, desc in PAYMENT_FRAUD_PATTERNS:
            match = re.search(pat, lower_text)
            if match:
                detected_signals.append({
                    "name": f"Financial Lure: {desc}",
                    "severity": "HIGH",
                    "detail": f"Solicits fraudulent transfer or bait: '{match.group(0)}'."
                })
                risk_score += 30
                highlight_spans.append({"phrase": match.group(0), "category": "Financial", "severity": "HIGH"})
                if "lottery" in desc.lower():
                    detected_category = "Lottery / Prize Fraud"
                elif "job" in desc.lower():
                    detected_category = "Task / Employment Scam"
                break

        # Language Detection
        hindi_markers = ["bijli", "grahak", "aapka", "karein", "turant", "sampark", "aavedan", "khatam", "jeeta", "inaam"]
        is_hindi = any(marker in lower_text for marker in hindi_markers)
        detected_language = "Hindi / Hinglish" if is_hindi else "English"

        # Final Score & Category
        final_score = min(max(risk_score, 0), 100)
        if final_score >= 70:
            risk_category = "MALICIOUS"
            verdict = f"High-Confidence Fraudulent Message ({detected_category})"
        elif final_score >= 35:
            risk_category = "SUSPICIOUS"
            verdict = f"Suspicious Unsolicited Solicitation ({detected_category})"
        elif final_score >= 15:
            risk_category = "LOW_RISK"
            verdict = "Low Risk / Informational Message"
        else:
            risk_category = "SAFE"
            verdict = "Normal Communication (No Obvious Threat Signals)"

        # Tailored Protective Recommendations
        recommendations = []
        if risk_category in ("MALICIOUS", "CRITICAL"):
            recommendations.append("DO NOT click any link in this message or dial the included phone number.")
            recommendations.append("DO NOT share OTPs, PINs, or install apps (especially APKs, AnyDesk, or TeamViewer).")
            recommendations.append("Forward this message to 1909 (Telecom DND Fraud Reporting) or report via the Sanchar Saathi (Chakshu) portal.")
            recommendations.append("If you already shared financial information, call the National Cyber Crime Helpline at 1930 immediately.")
        elif risk_category == "SUSPICIOUS":
            recommendations.append("Verify the claim independently through the organization's official website or app.")
            recommendations.append("Never reply to unsolicited messages requesting account updates or payments.")
        else:
            recommendations.append("No immediate scam indicators detected.")
            recommendations.append("Remain cautious: legitimate organizations will never demand passwords or OTPs over text.")

        # Explain why it is dangerous in simple language
        explanation = (
            f"This message exhibits strong characteristics of {detected_category}. "
            f"Scammers use psychological urgency and fake authority to panic victims into clicking malicious links or calling scammer-operated numbers. "
            f"{'Hindi/Hinglish phrasing was specifically detected.' if is_hindi else ''}"
        )

        return {
            "target_input": cleaned_text,
            "risk_score": final_score,
            "risk_category": risk_category,
            "verdict": verdict,
            "detected_category": detected_category,
            "detected_language": detected_language,
            "explanation": explanation,
            "detected_signals": detected_signals,
            "highlight_spans": highlight_spans,
            "recommendations": recommendations,
            "extracted_urls": found_urls,
            "extracted_phones": found_phones
        }

sms_analyzer = SMSAnalyzer()

