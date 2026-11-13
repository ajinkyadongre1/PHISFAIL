# 🛡️ PHISFAIL — AI-Powered Cybersecurity Threat Defense Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/Frontend-React_19_TypeScript-61DAFB.svg)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC.svg)](https://tailwindcss.com)
[![Threat Intel](https://img.shields.io/badge/Threat_Intel-VirusTotal_%26_Safe_Browsing-red.svg)](https://virustotal.com)
[![AI Co-Pilot](https://img.shields.io/badge/AI_Engine-Google_Gemini-4285F4.svg)](https://aistudio.google.com)

**PHISFAIL** is a next-generation AI cybersecurity web application built for ordinary citizens, enterprise employees, and incident response analysts. Rather than simply flagging an entity as malicious or safe, PHISFAIL **explains why something is dangerous**, decodes psychological social engineering tactics, **uncovers interconnected attack infrastructure via Scam DNA**, and delivers actionable incident response playbooks.

---

## 🌟 Key Innovations & Core Modules

### 1. 🧬 Scam DNA — Threat Correlation Engine
- **Infrastructural Correlation**: Analyzes shared bulletproof IP blocks, identical phishing kit DOM fingerprints, SMS sender identifiers, and mule UPI handles.
- **Interactive Topology Graph**: Powered by **React Flow**, displaying live threat clusters (e.g. State Bank of India phishing ring, India Post postal smishing cluster, Electricity disconnection extortion ring).
- **Confidence Scoring & Disclaimers**: Every correlation edge displays relationship confidence (e.g. `98%`) and a forensic reason, with strict ethical disclosures that correlation does not claim definitive criminal attribution without judicial validation.

### 2. 🌐 AI Phishing URL Scanner
- **Homoglyph & Punycode Attack Detection**: Identifies Cyrillic and lookalike Unicode codepoints (`xn--`) masquerading as authentic brands.
- **Brand Impersonation & Typosquatting**: Checks Levenshtein distances and subdomain stacking across high-target brands (SBI, HDFC, Netflix, India Post, Amazon, Apple, etc.).
- **SSRF Protection & DNS Guard**: Strict network validation that blocks RFC 1918 private IPs, loopback (`127.0.0.1`, `::1`), link-local, and cloud metadata (`169.254.169.254`).
- **Threat Intelligence Adapters**: Real-time integration with **Google Safe Browsing v4** and **VirusTotal v3** with transparent, clearly labeled simulated demo fallbacks.
- **Explainable 0–100 Risk Score**: Accompanied by prioritized indicators and exact incident remediation steps.

### 3. 📷 QR Code Quishing Scanner
- **Dual-Mode Scanner**: Supports both file upload (PNG/JPG screenshots) and **live webcam/camera scanning** via `jsQR`.
- **Auto-Navigation Interception**: Decodes and displays destination URLs without automatically navigating your browser, shielding users from drive-by downloads or zero-click exploits.
- **Direct Engine Handoff**: 1-click trigger to inspect the decoded payload through the AI URL Scanner.

### 4. 💬 SMS & Screenshot Scam Detector
- **In-Browser OCR via Tesseract.js**: Extract text directly from screenshots without uploading sensitive images to external servers.
- **Multi-Lingual NLP Support**: Detects English and **Hindi/Hinglish extortion patterns** (e.g. *"Bijli bill update: Aaj raat 9:30 baje electricity supply disconnect ho jayegi"*).
- **Psychological Trigger Analysis**: Detects artificial urgency, government/police impersonation, and Remote Access Trojan (RAT) vectors (e.g. AnyDesk, TeamViewer, malicious APKs).
- **Inline Danger Highlighting**: Renders highlighted spans with red/amber badges and actionable reporting directives (1930 / Sanchar Saathi / 1909).

### 5. 🤖 AI Cybersecurity Investigator
- **Conversational Co-Pilot**: Powered by **Google Gemini 2.5 Flash** with an intelligent rule-based expert fallback engine.
- **Active Scan Injection**: Directly explains technical findings from any recent URL or SMS scan in plain, easy-to-understand language.
- **Incident Playbooks**: Step-by-step guidance for compromised accounts, SIM swap fraud, and cybercrime reporting.

### 6. 📄 Scan History & Downloadable PDF Reports
- **Executive Threat Incident Reports**: Generates professional, printable, and downloadable PDF security reports via **jsPDF**.
- **Audit Logs**: Filterable by scan vector (URL, QR, SMS, Screenshot) and risk level.

### 7. 🤝 Community Threat Exchange
- **Crowdsourced Defense Network**: Community reporting of suspicious URLs, SMS texts, and mule UPI handles.
- **Automated Privacy Scrubber**: Sanitizes sensitive PII (credit cards, Aadhaar, OTPs) before storing reports.
- **Upvoting & Verification**: Community consensus mechanism to validate emerging campaigns.

### 8. 🎓 Security Defense Academy & Phishing IQ Quiz
- **Gamified Awareness**: Interactive spot-the-phish scenarios with instant score feedback and celebratory confetti.
- **Educational Distinction**: Isolated awareness challenges strictly distinguished from live threat detection.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons |
| **Charts & Graphs** | Recharts (Telemetry Analytics), React Flow `@xyflow/react` (Scam DNA Topology) |
| **Vision & OCR** | Tesseract.js (In-Browser Neural OCR), jsQR (Real-Time QR Decoding) |
| **PDF Reporting** | jsPDF (Executive Incident Summaries) |
| **Audio Synthesizer**| Web Audio API (Zero-dependency cyber audio telemetry) |
| **Backend API** | Python 3.14 / 3.11+, FastAPI, Uvicorn, Pydantic v2, HTTPX |
| **Database** | Supabase Cloud PostgreSQL (with Row-Level Security) + Local JSON Storage Fallback |
| **AI & Threat Intel**| Google Gemini API, Google Safe Browsing v4, VirusTotal v3 |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & `npm`
- Python (v3.10+)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/PHISFAIL.git
cd PHISFAIL
```

### 2. Set Up the Backend
```bash
# Create and activate python virtual environment
python -m venv backend/venv

# Windows
backend\venv\Scripts\activate

# Linux / macOS
source backend/venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Copy environment file and add your API keys
cp backend/.env.example backend/.env

# Start FastAPI server (runs on http://127.0.0.1:8000)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Run the Frontend
In another terminal:
```bash
# Install packages
npm install

# Start Vite dev server (runs on http://127.0.0.1:5173)
npm run dev
```

Open your browser at **`http://127.0.0.1:5173/`** to explore the PHISFAIL Defense Console.

---

## 🚀 Deploying to Vercel (1-Click Single Project)

PHISFAIL is architected as a **unified single project** specifically designed for 1-click Vercel deployment:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New" > "Project"**.
2. Select your repository: **`ajinkyadongre1/PHISFAIL`**.
3. Vercel automatically detects:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Single Unified Project)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**!
5. All frontend pages are deployed instantly to Vercel's global edge network, and all `/api/*` endpoints are automatically handled by the serverless Python handler in `api/index.py`.

---

## 🔑 Environment Variables & Demo Mode

PHISFAIL includes a **zero-configuration Demo Mode**. If you do not provide API keys, the application automatically runs using realistic simulated telemetry and deep local heuristic models:

| Variable | Description | Default Fallback |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key for conversational investigator | Expert Incident Playbook Rule Engine |
| `VIRUSTOTAL_API_KEY` | VirusTotal v3 API key for URL reputation lookups | Simulated 88-engine threat telemetry |
| `GOOGLE_SAFE_BROWSING_API_KEY`| Google Safe Browsing v4 lookup key | Heuristic threat feed simulation |
| `SUPABASE_URL` & `SUPABASE_KEY`| Supabase Cloud database endpoint and anon key | Local persistent JSON storage (`backend/data/storage.json`) |

---

## 🗄️ Supabase PostgreSQL Setup & RLS

To connect to Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste the contents of `backend/database/schema.sql`.
4. Copy your project URL and `anon` key into `backend/.env`.

The schema configures Row-Level Security (RLS) on all core tables:
- `profiles`: User roles (`analyst`, `hunter`, `admin`).
- `scans`: Target records, risk categories, and telemetry.
- `threat_indicators`: Scam DNA entities (domain, IP, kit, phone, UPI).
- `scam_relationships`: Graph edges linking correlated threats.
- `community_reports`: Crowdsourced scam feed.

---

## 🧪 Hackathon Demonstration Targets to Test

Try these realistic scenarios right in the UI:

1. **State Bank of India (SBI) Phishing Kit**:
   - URL: `https://sbi-yono-update-kyc.org/login.php`
   - *Result*: 100/100 Malicious, brand impersonation detected, correlated in Scam DNA to IP `194.26.29.112` and kit `Kit-Chakra-SBI-v3`.
2. **India Post Delivery Smishing**:
   - URL: `https://indiapost-parcel-tracking.vip`
   - *Result*: 88/100 Malicious, artificial 12-hour deadline, flagged .vip TLD.
3. **Electricity Power Cut Extortion (Hindi/Hinglish)**:
   - SMS: *"Bijli bill update: Priye grahak, aapka bijli bill update nahi hua hai. Aaj raat 9:30 baje electricity supply disconnect ho jayegi. Turant electricity officer se sampark karein: 9876543210 ya link kholen http://bijli-bill-seva.in"*
   - *Result*: High-confidence extortion scam, personal phone number extracted, Hindi phrasing detected.
4. **Physical Parking Meter Quishing**:
   - URL / QR: `https://parking-meter-pay-fast.top/meter-id?slot=402`
   - *Result*: Quishing alert, untrusted parking payment gateway.
5. **Legitimate Platform Verification**:
   - URL: `https://github.com/torvalds/linux`
   - *Result*: Safe (0/100), verified enterprise domain.

---

## 🔒 Security Best Practices Implemented

- **Strict SSRF Defense**: Evaluates resolved IP addresses to block intranet, localhost, link-local, and cloud metadata access.
- **Automated PII Scrubber**: Community report submissions scrub credit cards, 12-digit Aadhaar numbers, and OTP tokens.
- **Sliding-Window Rate Limiting**: In-memory rate limiting middleware protects the backend against flood attacks.
- **Credential Protection**: Zero API keys are exposed to the client bundle.
- **Security Headers**: Injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `X-XSS-Protection`.

---

## 👥 Authors
Built with pride for the Hackathon by the **PHISFAIL Cyber Defense Team**.
For official cybercrime reporting in India, call **1930** or visit [cybercrime.gov.in](https://cybercrime.gov.in). In the US, visit [ic3.gov](https://ic3.gov).

