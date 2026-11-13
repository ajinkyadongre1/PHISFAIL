import httpx
from typing import Dict, List, Any, Optional
import logging
from backend.config import settings

logger = logging.getLogger("phisfail.ai_investigator")

SYSTEM_PROMPT = """
You are the PHISFAIL AI Cybersecurity Incident Investigator.
Your mission is to help everyday users and security analysts understand phishing threats, malicious URLs, QR scams, and fraudulent messages in clear, actionable, non-technical language.

Key Rules:
1. Ground your answers strictly in verifiable cybersecurity principles.
2. Explain technical jargon (e.g. homoglyphs, DNS rebinding, RAT, APK trojans, SSL spoofing) with relatable analogies.
3. Recommend safe incident-response steps (e.g., disconnecting Wi-Fi, freezing bank accounts, alerting 1930 or IC3).
4. NEVER fabricate threat intelligence or claim to have inspected internal server files or run checks that were not performed.
5. If the user provides a scan context, refer directly to the detected signals and risk score.
Keep your response concise, empathetic, and structured with bullet points.
"""

# Contextual local cybersecurity knowledge engine
KNOWLEDGE_RESPONSES = [
    {
        "keywords": ["clicked", "accidental", "opened link", "clicked link", "entered password", "submitted"],
        "reply": (
            "### 🚨 Immediate Incident Response: You Clicked a Suspicious Link\n\n"
            "Take these 4 actions immediately:\n\n"
            "1. **Do Not Enter Any Information**: If the page is still open, close the browser tab immediately. Do not submit OTPs, passwords, or card numbers.\n"
            "2. **Disconnect / Airplane Mode**: If you downloaded an APK or unknown executable file, immediately disconnect your phone or computer from Wi-Fi and mobile data to block remote control access.\n"
            "3. **Change Passwords**: From another clean device, immediately change the passwords for the account that was targeted (e.g., bank, email, Google/Apple ID) and terminate all active sessions.\n"
            "4. **Notify Your Bank / Report**: If financial or banking credentials were entered, call your bank's 24/7 hotline to freeze netbanking and cards. In India, call **1930** or visit [cybercrime.gov.in](https://cybercrime.gov.in)."
        )
    },
    {
        "keywords": ["qr", "quishing", "qr code", "parking", "restaurant"],
        "reply": (
            "### 🔍 Understanding Quishing (QR Code Phishing)\n\n"
            "**Quishing** is phishing delivered through manipulated QR codes.\n\n"
            "- **The Danger**: Humans cannot read QR code pixels with their eyes. Scammers stick malicious QR stickers over legitimate QR codes on parking meters, restaurants, EV chargers, and utility posters.\n"
            "- **The Attack**: Scanning the QR code silently redirects your phone to a counterfeit payment portal or downloads a malicious configuration profile.\n"
            "- **PHISFAIL Protection**: Our QR Scanner extracts the embedded destination URL and inspects its reputation *before* you open it, ensuring you are never caught unaware."
        )
    },
    {
        "keywords": ["electricity", "bijli", "discom", "power cut", "9:30"],
        "reply": (
            "### ⚡ Anatomy of the Electricity Bill Disconnection Scam\n\n"
            "This is one of the most widespread social engineering scams:\n\n"
            "- **The Hook**: An SMS or WhatsApp message threatens that your power supply will be cut off tonight at 9:30 PM due to an unpaid bill.\n"
            "- **The Trap**: The message includes an unauthorized 10-digit mobile number claiming to be an 'Electricity Officer'.\n"
            "- **The Fraud**: When you call, the scammer claims your payment didn't update and instructs you to download a 'verification app' (actually **AnyDesk**, **TeamViewer**, or an APK) or pay a nominal Rs 10 fee via UPI, through which they siphon funds.\n"
            "- **Golden Rule**: Real DISCOMs send official bill notices on utility portals, never from personal mobile numbers!"
        )
    },
    {
        "keywords": ["report", "1930", "police", "cyber crime", "complaint", "sanchar saathi"],
        "reply": (
            "### 🛡️ How to Report Scams & Cyber Fraud\n\n"
            "**In India:**\n"
            "- **Helpline**: Call **1930** (Citizen Financial Cyber Fraud Reporting System) immediately if money was stolen.\n"
            "- **Online Portal**: File an official complaint at **cybercrime.gov.in**.\n"
            "- **SMS/Call Fraud**: Report fraudulent SMS and unsolicited calling numbers on the Government **Sanchar Saathi (Chakshu)** portal.\n"
            "- **Telecom DND**: Forward smishing texts to **1909**.\n\n"
            "**International:**\n"
            "- **USA / Global**: Report to the FBI Internet Crime Complaint Center at **ic3.gov** or FTC at **reportfraud.ftc.gov**."
        )
    },
    {
        "keywords": ["apk", "trojan", "malware", "anydesk", "teamviewer", "screen share"],
        "reply": (
            "### 🛑 Danger Alert: Malicious APKs & Remote Access Apps\n\n"
            "- **Why Scammers Love APKs**: Once installed, an Android APK can request `SMS Read` and `Accessibility Services` permissions. This allows scammers to silently intercept bank OTPs and bypass 2FA.\n"
            "- **Remote Access Fraud**: Apps like AnyDesk, TeamViewer, or QuickSupport are legitimate remote desktop tools abused by scammers to view your screen while you enter banking PINs.\n"
            "- **Action**: Immediately uninstall the suspect app. Put your phone in Safe Mode or perform a factory reset if you suspect persistent compromise."
        )
    }
]

class AIInvestigator:
    async def chat(self, user_message: str, scan_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Answers user cybersecurity questions or explains scan results.
        Uses Gemini API if configured, otherwise uses intelligent incident response rule engine.
        """
        msg_lower = user_message.lower()

        # If Gemini API Key is configured, use live Gemini API
        if settings.is_gemini_active:
            try:
                context_str = ""
                if scan_context:
                    context_str = f"\nCurrent Active Scan Context:\n- Target: {scan_context.get('target_input')}\n- Risk Score: {scan_context.get('risk_score')}/100\n- Category: {scan_context.get('risk_category')}\n- Verdict: {scan_context.get('verdict')}\n- Signals: {scan_context.get('detected_signals')}\n"

                prompt = f"{SYSTEM_PROMPT}\n{context_str}\nUser Question: {user_message}"
                
                # Use Gemini 2.5 Flash / 1.5 Flash endpoint
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }]
                }
                
                async with httpx.AsyncClient(timeout=10.0) as client:
                    res = await client.post(url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            text_reply = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            return {
                                "reply": text_reply,
                                "engine": "Gemini 2.5 Flash (Live AI Integration)",
                                "is_live_ai": True
                            }
            except Exception as e:
                logger.error(f"Error calling Gemini API: {e}")

        # Intelligent Cybersecurity Knowledge Fallback
        if scan_context and any(k in msg_lower for k in ["explain", "this scan", "result", "why dangerous", "score", "findings"]):
            score = scan_context.get("risk_score", 0)
            category = scan_context.get("risk_category", "UNKNOWN")
            verdict = scan_context.get("verdict", "Unknown")
            signals = scan_context.get("detected_signals", [])
            
            sig_bullets = "\n".join([f"- **{s.get('name')}** ({s.get('severity')}): {s.get('detail')}" for s in signals[:4]])
            
            reply = (
                f"### 🛡️ Analysis of Your Scan\n\n"
                f"**Verdict**: {verdict}\n"
                f"**Risk Score**: `{score}/100` ({category})\n\n"
                f"**Key Detected Signals**:\n{sig_bullets}\n\n"
                f"**Why This Is Dangerous**:\n"
                f"The target combines several indicators commonly seen in active credential harvesting campaigns. "
                f"Attackers use these techniques to bypass basic spam filters and impersonate trustworthy institutions. "
                f"Never enter passwords or personal data on this link."
            )
            return {
                "reply": reply,
                "engine": "PHISFAIL Cyber Expert Rule Engine (Demo Active)",
                "is_live_ai": False
            }

        for item in KNOWLEDGE_RESPONSES:
            if any(k in msg_lower for k in item["keywords"]):
                return {
                    "reply": item["reply"],
                    "engine": "PHISFAIL Incident Playbook Engine",
                    "is_live_ai": False
                }

        # General cybersecurity advice response
        default_reply = (
            "### 🤖 PHISFAIL Security Advisory\n\n"
            f"Regarding your query: *\"{user_message}\"*\n\n"
            "Here are the core security principles to keep in mind:\n"
            "- **Zero Trust for Unsolicited Messages**: Never trust links or phone numbers received via unexpected SMS, emails, or messaging apps.\n"
            "- **Inspect Domain Anatomy**: Look closely at the top-level domain and exact spelling before submitting any information.\n"
            "- **Guard Your OTPs**: Legitimate bank representatives and support staff will NEVER ask for your OTP or password under any circumstances.\n"
            "- **Report Suspicious Activities**: You can test URLs and SMS messages right here in PHISFAIL to inspect their Scam DNA."
        )
        return {
            "reply": default_reply,
            "engine": "PHISFAIL Incident Playbook Engine",
            "is_live_ai": False
        }

ai_investigator = AIInvestigator()

