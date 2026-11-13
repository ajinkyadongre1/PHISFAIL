import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Lock, 
  Zap, 
  Layers, 
  Globe, 
  Cpu, 
  ArrowRight, 
  Filter, 
  FileText, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { soundFX } from '../services/sound';
import { ScanResult } from '../types';
import { PdfReportModal } from '../components/PdfReportModal';

interface Props {
  onNavigate: (tab: string) => void;
  onInspectScan?: (scan: ScanResult) => void;
}

export const Dashboard: React.FC<Props> = ({ onNavigate }) => {
  const [quickScanUrl, setQuickScanUrl] = useState('https://login.microsoft-verify.support/auth?token=90a');
  const [selectedScanForReport, setSelectedScanForReport] = useState<ScanResult | null>(null);

  // Checkbox states for Detonation Sandbox
  const [antiEvasion, setAntiEvasion] = useState(true);
  const [resProxy, setResProxy] = useState(true);
  const [headlessCanvas, setHeadlessCanvas] = useState(true);
  const [voiceHook, setVoiceHook] = useState(false);

  // 7-Day Multi-Vector Threat Flux Data
  const fluxData = [
    { day: 'T-6 DAYS', phish: 22, qr: 14, sms: 10 },
    { day: 'T-5 DAYS', phish: 35, qr: 24, sms: 18 },
    { day: 'T-4 DAYS', phish: 48, qr: 32, sms: 28 },
    { day: 'T-3 DAYS', phish: 42, qr: 28, sms: 22 },
    { day: 'T-2 DAYS', phish: 58, qr: 38, sms: 35 },
    { day: 'YESTERDAY', phish: 75, qr: 62, sms: 48 },
    { day: 'REALTIME NOW', phish: 96, qr: 82, sms: 58 },
  ];

  // Attack Vectors Donut Data
  const vectorData = [
    { name: 'Credential Harvester', value: 44, color: '#3B82F6' },
    { name: 'Fake Financial Gate', value: 28, color: '#00F0FF' },
    { name: 'Malicious QR (Quish)', value: 18, color: '#E2E8F0' },
    { name: 'AI Synthetic Voice', value: 10, color: '#FF6B6B' },
  ];

  // Live SOC Triage & Interception Stream
  const triageStream = [
    {
      id: 'soc-1',
      severity: 'CRITICAL • 98/100',
      sevColor: 'text-red-400 bg-red-950/70 border-red-500/40',
      targetDomain: 'https://login.okta-sso.corporate-v...',
      vector: 'Credential Theft',
      vectorColor: 'bg-blue-950 text-blue-300 border-blue-800',
      targetOrg: 'Okta / Fortune 500',
      timestamp: '14:23:41',
      scanObj: {
        target_input: 'https://login.okta-sso.corporate-verify.net',
        risk_score: 98,
        risk_category: 'CRITICAL',
        verdict: 'Adversary-in-the-Middle Reverse Proxy Stealing Okta Session Cookies',
        detected_signals: [{ name: 'Okta SSO Spoofing', severity: 'CRITICAL', detail: 'Harvests live session cookies' }],
        recommendations: ['Revoke active Okta tokens and deploy DNS sinkhole.'],
        telemetry: { domain: 'login.okta-sso.corporate-verify.net' }
      }
    },
    {
      id: 'soc-2',
      severity: 'DANGER • 89/100',
      sevColor: 'text-orange-400 bg-orange-950/70 border-orange-500/40',
      targetDomain: 'svg:qr-payload-dynamic-token.redire...',
      vector: 'Malicious QR',
      vectorColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      targetOrg: 'PayPal Invoicing',
      timestamp: '14:22:15',
      scanObj: {
        target_input: 'svg:qr-payload-dynamic-token.redirect',
        risk_score: 89,
        risk_category: 'MALICIOUS',
        verdict: 'Polymorphic SVG QR Code Redirecting to Phishing Portal',
        detected_signals: [{ name: 'Quishing Gateway', severity: 'HIGH', detail: 'Dynamic client-side SVG redirect' }],
        recommendations: ['Do not scan unverified QR payment codes.'],
        telemetry: { domain: 'qr-payload-dynamic.vip' }
      }
    },
    {
      id: 'soc-3',
      severity: 'CRITICAL • 96/100',
      sevColor: 'text-red-400 bg-red-950/70 border-red-500/40',
      targetDomain: 'https://m365-login.auth-portal-rene...',
      vector: 'Credential Theft',
      vectorColor: 'bg-blue-950 text-blue-300 border-blue-800',
      targetOrg: 'Microsoft 365',
      timestamp: '14:20:08',
      scanObj: {
        target_input: 'https://m365-login.auth-portal-renew.net',
        risk_score: 96,
        risk_category: 'CRITICAL',
        verdict: 'M365 Enterprise Login Phishing Kit',
        detected_signals: [{ name: 'Domain Homoglyph', severity: 'CRITICAL', detail: 'AitM Reverse Proxy' }],
        recommendations: ['Block FQDN in enterprise gateway.'],
        telemetry: { domain: 'm365-login.auth-portal-renew.net' }
      }
    },
    {
      id: 'soc-4',
      severity: 'WARNING • 78/100',
      sevColor: 'text-amber-400 bg-amber-950/70 border-amber-500/40',
      targetDomain: 'sms://+18885550192?body=USPS-Delive...',
      vector: 'SMS / Smishing',
      vectorColor: 'bg-purple-950 text-purple-300 border-purple-800',
      targetOrg: 'USPS Logistics',
      timestamp: '14:18:52',
      scanObj: {
        target_input: 'sms://+18885550192?body=USPS-Delivery-Suspended',
        risk_score: 78,
        risk_category: 'SUSPICIOUS',
        verdict: 'Postal Delivery Redirection Smish',
        detected_signals: [{ name: 'Artificial Urgency', severity: 'HIGH', detail: 'Claims parcel is held at customs' }],
        recommendations: ['Report sender number to 1909 DND.'],
        telemetry: { category: 'Smishing' }
      }
    },
    {
      id: 'soc-5',
      severity: 'DANGER • 87/100',
      sevColor: 'text-orange-400 bg-orange-950/70 border-orange-500/40',
      targetDomain: 'https://chase-online.banking-securi...',
      vector: 'Fake Financial Gate',
      vectorColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
      targetOrg: 'Chase Bank',
      timestamp: '14:15:20',
      scanObj: {
        target_input: 'https://chase-online.banking-security-auth.com',
        risk_score: 87,
        risk_category: 'MALICIOUS',
        verdict: 'Chase NetBanking Credential Phishing Gate',
        detected_signals: [{ name: 'Banking Impersonation', severity: 'HIGH', detail: 'Fake login form' }],
        recommendations: ['Freeze compromised netbanking credentials.'],
        telemetry: { domain: 'chase-online.banking-security-auth.com' }
      }
    }
  ];

  const handleDetonateQuick = () => {
    soundFX.playClick();
    sessionStorage.setItem('phisfail_prefill_url', quickScanUrl);
    onNavigate('url-scanner');
  };

  return (
    <div className="space-y-4 pb-12 max-w-7xl mx-auto">
      {/* Good morning Lead Analyst Banner */}
      <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
            Good morning, <span className="text-cyan-300">Lead Analyst</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SENTINEL NODE 07 • US-EAST
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              DEFCON 3: ELEVATED MONITORING
            </span>
            <span className="text-slate-600">|</span>
            <span>UTC SYNC: 2026-11-13 08:38:41</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">GLOBAL REPUTATION MESH: ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400">AI HEURISTIC ENGINE: 99.98% VERIFIED</span>
          </div>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-xs">
          <button
            onClick={() => {
              soundFX.playThreatAlert();
              alert('Cluster Sinkhole Command executed. BGP routes broadcast.');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070c18] hover:bg-slate-900 text-slate-300 border border-slate-700 transition"
          >
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>Trigger Cluster Sinkhole</span>
          </button>

          <button
            onClick={() => {
              soundFX.playScanPing();
              onNavigate('url-scanner');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070c18] hover:bg-slate-900 text-slate-300 border border-slate-700 transition"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulate Phish Run</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              alert('SOC Executive Digest compiled.');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-600/30"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate SOC Digest</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* TOTAL SCANS (24H) */}
        <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
            <span>TOTAL SCANS (24H)</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            1,429,820
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-cyan-400 font-mono font-bold">▲ +12.4% vs last week</span>
            <svg className="w-14 h-4 text-cyan-400" fill="none" viewBox="0 0 60 16">
              <path d="M2 12 Q 15 2, 30 10 T 58 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* NEUTRALIZED THREATS */}
        <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
            <span>NEUTRALIZED THREATS</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            18,492
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>Efficacy Rate</span>
            <span className="text-white font-bold">99.98%</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[99.98%]" />
          </div>
        </div>

        {/* QUARANTINE BUFFER */}
        <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
            <span>QUARANTINE BUFFER</span>
            <Radio className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            3,114
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Isolated memory payloads</div>
          <div className="flex items-center justify-between pt-1 text-[9px] font-mono">
            <span className="text-slate-500">Auto-Purge in: 12h</span>
            <span className="text-red-400 bg-red-950/80 px-1 rounded border border-red-500/30 font-bold">HIGH RISK</span>
          </div>
        </div>

        {/* ACTIVE SENTINEL SHIELD */}
        <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-bold">
            <span>ACTIVE SENTINEL SHIELD</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-400 tracking-tight flex items-center gap-1.5">
            <span>ARMED</span>
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>Engine Kernel</span>
            <span className="text-white">AI Heuristic v4.8</span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-0.5">
            <span>Latency: <strong className="text-cyan-400">0.4ms</strong></span>
            <span className="text-cyan-300 bg-cyan-950/80 px-1 rounded border border-cyan-500/30 font-bold">ZERO-DAY DEFENSE</span>
          </div>
        </div>
      </div>

      {/* Row 2: Threat Flux (Left) & Global Threat Scope (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column (2 cols): Threat Flux + Detonation Quick Run */}
        <div className="lg:col-span-2 space-y-4">
          {/* 7-Day Multi-Vector Threat Flux */}
          <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" /> 7-Day Multi-Vector Threat Flux
                </h2>
                <p className="text-[10px] font-mono text-slate-500">Hourly aggregated telemetry telemetry across attack surfaces</p>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2 h-2 rounded-sm bg-blue-500" /> Phishing URLs
                </span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <span className="w-2 h-2 rounded-sm bg-cyan-400" /> Quishing (QR)
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2 h-2 rounded-sm bg-purple-500" /> SMS / Smishing
                </span>
              </div>
            </div>

            {/* Peak Surge Banner */}
            <div className="flex justify-end pr-4">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                PEAK SURGE: 16.8k Intercepts/hr
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fluxData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fluxBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fluxCyan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={10} fontFamily="monospace" tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} fontFamily="monospace" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#070b14',
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Area type="natural" dataKey="phish" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#fluxBlue)" />
                  <Area type="natural" dataKey="qr" stroke="#00F0FF" strokeWidth={2} fillOpacity={1} fill="url(#fluxCyan)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detonation Sandbox Quick-Run */}
          <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-white flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" /> Detonation Sandbox Quick-Run
              </span>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/30">
                KERNEL DOCK #12 READY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Isolated VM spin-up with full memory heuristic tracing
            </p>

            {/* Input with Detonate Button */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={quickScanUrl}
                  onChange={(e) => setQuickScanUrl(e.target.value)}
                  className="w-full px-3 py-2 pl-8 rounded-xl bg-[#070c18] border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
                <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-500 px-1 py-0.2 rounded bg-slate-900 border border-slate-800">
                  MD5/SHA256
                </span>
              </div>
              <button
                onClick={handleDetonateQuick}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5 shrink-0"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-200 fill-cyan-200" />
                <span>Detonate Payload</span>
              </button>
            </div>

            {/* 4 Checkbox Flags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={antiEvasion}
                  onChange={(e) => setAntiEvasion(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                />
                <span>Anti-Evasion Bypass</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={resProxy}
                  onChange={(e) => setResProxy(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                />
                <span>Residential Proxy Bypass</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={headlessCanvas}
                  onChange={(e) => setHeadlessCanvas(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                />
                <span>Headless Canvas Rendering</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={voiceHook}
                  onChange={(e) => setVoiceHook(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500"
                />
                <span>Deepfake Voice Capture Hook</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Global Threat Scope Radar */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-white flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-cyan-400" /> Global Threat Scope
              </span>
              <span className="text-cyan-400 text-[10px]">● 2,842 INTERCEPTS/MIN</span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">Real-time edge DNS sync & ingress telemetry</p>
          </div>

          {/* Radar Screen with concentric circles */}
          <div className="relative h-44 rounded-xl bg-[#070b14] border border-slate-850 overflow-hidden flex items-center justify-center my-2">
            <div className="absolute w-36 h-36 rounded-full border border-cyan-500/15" />
            <div className="absolute w-24 h-24 rounded-full border border-cyan-500/25" />
            <div className="absolute w-12 h-12 rounded-full border border-cyan-500/35" />
            <div className="absolute w-full h-[1px] bg-cyan-500/10" />
            <div className="absolute h-full w-[1px] bg-cyan-500/10" />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-20 h-20 rounded-full border-r-2 border-cyan-400/60 animate-radar origin-center opacity-60" />
            </div>

            {/* Blips */}
            <div className="absolute top-8 right-12 text-[8px] font-mono bg-red-950/80 px-1.5 py-0.2 rounded border border-red-500/40 text-red-300">
              ● Frankfurt R1
            </div>
            <div className="absolute bottom-10 right-14 text-[8px] font-mono bg-orange-950/80 px-1.5 py-0.2 rounded border border-orange-500/40 text-orange-300">
              ● Tokyo Rel 72
            </div>
            <div className="absolute bottom-8 left-12 text-[8px] font-mono bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40 text-emerald-300">
              ● Ashburn Primary
            </div>
          </div>

          {/* Regional Status List */}
          <div className="space-y-1.5 font-mono text-[10px] border-t border-slate-850 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">● Frankfurt Hub (EU-Central)</span>
              <span className="text-red-400 font-bold">CRIT 98/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">● Tokyo Relay (AP-East)</span>
              <span className="text-orange-400 font-bold">DANGER 89/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">● Ashburn Primary (US-East)</span>
              <span className="text-emerald-400 font-bold">VERIFIED CLEAN</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-850 text-slate-500">
              <span>BGP Route Propagation</span>
              <span className="text-cyan-400 font-bold">100% IN SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Attack Vector Breakdown (Left) & Active Adversary Syndicates (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attack Vector Vectors */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" /> Attack Vector Vectors
            </span>
            <span className="text-slate-500 text-[10px]">24H TELEMETRY</span>
          </div>
          <p className="text-[10px] font-mono text-slate-500">Cluster breakdown of active payload ingress</p>

          <div className="flex items-center gap-4 pt-1">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={vectorData} cx="50%" cy="50%" innerRadius={34} outerRadius={48} paddingAngle={4} dataKey="value">
                    {vectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-black font-mono text-white">100%</span>
                <span className="text-[7px] font-mono text-slate-400 uppercase">TRIAGED</span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5 font-mono text-[11px]">
              {vectorData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-white font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] font-mono text-cyan-400 pt-2 border-t border-slate-850">
            Highest Vector Delta: +14.8% Quishing Campaign Ingress
          </div>
        </div>

        {/* Active Adversary Syndicates & Campaigns */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" /> Active Adversary Syndicates & Campaigns
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 font-bold">
              3 HIGH-PRIORITY
            </span>
          </div>
          <p className="text-[10px] font-mono text-slate-500">Tracked threat clusters operating autonomous generation nodes</p>

          <div className="space-y-2">
            {/* Syndicate 1 */}
            <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-[11px]">01 ApexPhish-Kit-v3</span>
                  <span className="text-[8px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 rounded uppercase font-bold">
                    CONFIRMED C2
                  </span>
                </div>
                <div className="text-[9px] text-slate-400">
                  Targeting: Okta SSO / Azure AD • Autonomous Domain Rotator (340 ips)
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-white font-bold block text-[10px]">8,412 Hits</span>
                  <span className="text-[8px] text-slate-500">Origin: Bulletproof NL</span>
                </div>
                <button
                  onClick={() => onNavigate('scam-dna')}
                  className="px-2 py-1 rounded bg-[#0c1424] hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px]"
                >
                  Scam DNA™
                </button>
              </div>
            </div>

            {/* Syndicate 2 */}
            <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-[11px]">02 Drop-Node-Cluster #88</span>
                  <span className="text-[8px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-1 rounded uppercase font-bold">
                    QUISHING RING
                  </span>
                </div>
                <div className="text-[9px] text-slate-400">
                  Targeting: Parking Meter QR / Utility Bills • SVGs with Dynamic Redirects
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-white font-bold block text-[10px]">4,120 Hits</span>
                  <span className="text-[8px] text-slate-500">Origin: Fast-Flux RU</span>
                </div>
                <button
                  onClick={() => onNavigate('scam-dna')}
                  className="px-2 py-1 rounded bg-[#0c1424] hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px]"
                >
                  Scam DNA™
                </button>
              </div>
            </div>

            {/* Syndicate 3 */}
            <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-[11px]">03 Typosquat M365 Network</span>
                  <span className="text-[8px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1 rounded uppercase font-bold">
                    HOMOGLYPH IDN
                  </span>
                </div>
                <div className="text-[9px] text-slate-400">
                  Targeting: Enterprise Executive Credentials • Punycode Spoofs
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <span className="text-white font-bold block text-[10px]">2,918 Hits</span>
                  <span className="text-[8px] text-slate-500">Origin: Cloud VPS US</span>
                </div>
                <button
                  onClick={() => onNavigate('scam-dna')}
                  className="px-2 py-1 rounded bg-[#0c1424] hover:bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px]"
                >
                  Scam DNA™
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-850">
            <span>Active Sinkholes Deployed: <strong className="text-cyan-400">14/14 Nodes</strong></span>
            <button onClick={() => onNavigate('scam-dna')} className="text-cyan-400 hover:underline">
              View All 53 Syndicates &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Live SOC Triage & Interception Stream */}
      <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" /> Live SOC Triage & Interception Stream
            </h2>
            <p className="text-[10px] font-mono text-slate-500">Deterministic heuristic classification engine streaming payload ingress</p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Filter Severity
            </span>
            <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Stream: Auto
            </span>
          </div>
        </div>

        {/* Triage Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#070c18] border-b border-slate-800 text-slate-400 uppercase text-[9px]">
              <tr>
                <th className="p-2.5">SEVERITY / SCORE</th>
                <th className="p-2.5">TARGET DOMAIN / PAYLOAD URI</th>
                <th className="p-2.5">VECTOR</th>
                <th className="p-2.5">TARGET ORG</th>
                <th className="p-2.5 text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-slate-300">
              {triageStream.map((row) => (
                <tr 
                  key={row.id}
                  onClick={() => {
                    soundFX.playClick();
                    setSelectedScanForReport(row.scanObj as any);
                  }}
                  className="hover:bg-slate-900/60 transition cursor-pointer text-[11px]"
                >
                  <td className="p-2.5">
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${row.sevColor}`}>
                      ● {row.severity}
                    </span>
                  </td>
                  <td className="p-2.5 font-bold text-white">
                    {row.targetDomain}
                  </td>
                  <td className="p-2.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${row.vectorColor}`}>
                      {row.vector}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-400">
                    {row.targetOrg}
                  </td>
                  <td className="p-2.5 text-right text-slate-500">
                    {row.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-850">
          <span>Showing 5 of 18,492 active threats • Next batch fetch in 4s</span>
          <div className="flex items-center gap-1.5">
            <button className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">Prev</button>
            <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold">1</span>
            <button className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">2</button>
            <button className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">3</button>
            <button className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">Next</button>
          </div>
        </div>
      </div>

      {/* PDF Report Modal */}
      {selectedScanForReport && (
        <PdfReportModal scan={selectedScanForReport} onClose={() => setSelectedScanForReport(null)} />
      )}
    </div>
  );
};
