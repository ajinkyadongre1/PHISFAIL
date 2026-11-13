import React, { useState } from 'react';
import { 
  Globe, 
  QrCode, 
  MessageSquareWarning, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Upload, 
  Zap, 
  ArrowRight, 
  Download, 
  Network,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Server
} from 'lucide-react';
import { api } from '../services/api';
import { ScanResult } from '../types';
import { soundFX } from '../services/sound';
import { PdfReportModal } from '../components/PdfReportModal';

interface Props {
  onNavigate: (tab: string) => void;
  onSetInvestigatorContext?: (scan: ScanResult) => void;
}

export const UrlScanner: React.FC<Props> = ({ onNavigate, onSetInvestigatorContext }) => {
  const [vectorTab, setVectorTab] = useState<'url' | 'qr' | 'sms'>('url');
  const [url, setUrl] = useState('https://auth-microsoft-support-365.workers-node3.biz/login?ref=e');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sinkholed, setSinkholed] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Toggles
  const [headlessSpoof, setHeadlessSpoof] = useState(true);
  const [wafBypass, setWafBypass] = useState(true);
  const [domHooking, setDomHooking] = useState(true);

  const handleCopy = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDetonate = () => {
    soundFX.playScanPing();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      soundFX.playThreatAlert();
    }, 1200);
  };

  return (
    <div className="space-y-4 pb-12 max-w-7xl mx-auto">
      {/* Detonation Chamber Top Banner Strip */}
      <div className="p-3 rounded-2xl bg-[#0c1424] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            DETONATION CHAMBER #64: ACTIVE TRACE
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">SESSION ID: STX-9041-K7-AITM</span>
          <span className="text-slate-600">|</span>
          <span className="text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40 text-[10px] font-bold">
            ISOLATION: EPHEMERAL CHROMIUM v128.4
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>SANDBOX ENGINE: v4.8-SENTINEL-eBPF</span>
          <span>RAM ALLOC: 4096MB</span>
        </div>
      </div>

      {/* Vector Switcher & Target Environment */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[#0c1424] border border-slate-800 font-mono text-xs">
          <button
            onClick={() => {
              soundFX.playClick();
              setVectorTab('url');
            }}
            className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>URL Deep Scan</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate('qr-scanner');
            }}
            className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Quishing Decoder</span>
          </button>

          <button
            onClick={() => {
              soundFX.playClick();
              onNavigate('sms-scanner');
            }}
            className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white transition flex items-center gap-1.5"
          >
            <MessageSquareWarning className="w-3.5 h-3.5" />
            <span>SMS / OCR Message Parser</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-[#0c1424] px-3 py-1.5 rounded-xl border border-slate-800">
          TARGET ENV: <span className="text-cyan-400 font-bold">DISPOSABLE_KVM_NODE_09</span>
        </div>
      </div>

      {/* Target Vector Payload Input & Detonation Row */}
      <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 pl-9 pr-14 rounded-xl bg-[#070c18] border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
              <button onClick={handleCopy} className="p-1 hover:text-white" title="Copy URL">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a href={url} target="_blank" rel="noreferrer" className="p-1 hover:text-white">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <button
            onClick={handleDetonate}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold font-mono text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-400/25 flex items-center gap-2 shrink-0"
          >
            <Zap className="w-4 h-4 text-black fill-black" />
            <span>{loading ? 'Detonating...' : 'Detonate & Analyze'}</span>
          </button>
        </div>

        {/* 3 Toggles + Egress Sandbox Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-850 font-mono text-[10px]">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={headlessSpoof}
                onChange={(e) => setHeadlessSpoof(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
              <span>Headless Fingerprint Spoofing (Canvas/WebGL)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={wafBypass}
                onChange={(e) => setWafBypass(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
              <span>Bypass Cloudflare Turnstile & WAF</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={domHooking}
                onChange={(e) => setDomHooking(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500"
              />
              <span>Live DOM Hooking & Token Intercept</span>
            </label>
          </div>

          <div className="text-slate-400">
            Egress Sandbox: IP ROTATING • <span className="text-cyan-400">92.223.108.14 (Frankfurt Gateway)</span>
          </div>
        </div>
      </div>

      {/* Row of 3 Metric & Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: WEAPON RISK SCORE */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-red-500/40 cyber-glow-red space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-400" /> WEAPON RISK SCORE
            </span>
            <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
              HIGH CONFIRMATION
            </span>
          </div>

          {/* Circular Score Gauge */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="50" stroke="#1e293b" strokeWidth="8" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="#FF5555"
                  strokeWidth="8"
                  strokeDasharray="314"
                  strokeDashoffset={314 - (314 * 94) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="drop-shadow-[0_0_10px_#ff5555]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black font-mono text-white">94</span>
                <span className="text-[8px] font-mono text-slate-400 uppercase">/ 100 SEVERITY</span>
                <span className="text-[8px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-red-500 text-black mt-0.5">
                  ZERO-DAY DETECTED
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1 font-mono text-xs border-t border-slate-850 pt-2">
            <div className="text-[10px] text-slate-500 flex justify-between">
              <span>CLASSIFICATION</span>
              <span className="text-red-400 font-bold">CONFIDENCE 99.98%</span>
            </div>
            <div className="text-white font-bold text-[11px]">
              Adversary in the Middle (AitM) Reverse Proxy Credential-Harvester
            </div>
            <div className="flex flex-wrap gap-1 pt-1 text-[9px]">
              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                EvilGinx3 Variant
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800">
                Session Cookie Stealer
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-red-300 border border-slate-800">
                MFA FIDO-Bypass
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: HOST & INFRA MATRIX */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <Server className="w-4 h-4 text-cyan-400" /> HOST & INFRA MATRIX
            </span>
            <span className="text-[10px] text-slate-400">ASN 49382</span>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#070c18] border border-slate-850">
              <span className="text-slate-500 text-[10px]">Domain Age</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-200">4 hrs 12 mins ago</span>
                <span className="text-[8px] bg-red-500/20 text-red-400 px-1 rounded border border-red-500/30 font-bold">FRESH IOC</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-[#070c18] border border-slate-850">
              <span className="text-slate-500 text-[10px]">Registrar</span>
              <span className="text-slate-200">NameCheap Privacy Shield</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-[#070c18] border border-slate-850">
              <span className="text-slate-500 text-[10px]">Origin IP & Geo</span>
              <div className="text-right">
                <span className="text-cyan-400 block font-bold">194.87.139.44</span>
                <span className="text-[9px] text-slate-400">Saint Petersburg, RU</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg bg-[#070c18] border border-slate-850">
              <span className="text-slate-500 text-[10px]">Infrastructure</span>
              <span className="text-red-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Bulletproof Drop Node
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-slate-850 pt-2">
            <span>NAMESERVERS: <strong className="text-slate-300">ns1.bulletdns.in</strong></span>
            <span>DNS-SEC: <strong className="text-red-400">INACTIVE</strong></span>
          </div>
        </div>

        {/* Card 3: TACTICAL MITIGATION */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" /> TACTICAL MITIGATION
            </span>
            <span className="text-[9px] text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30 font-bold">
              DEFCON 1 ACTIVE
            </span>
          </div>

          <div className="space-y-2">
            {/* Red Sinkhole Button */}
            <button
              onClick={() => {
                soundFX.playThreatAlert();
                setSinkholed(true);
              }}
              className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                sinkholed
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-gradient-to-r from-red-500/20 to-red-600/30 hover:from-red-500/30 border-red-500/60 text-red-200'
              }`}
            >
              <div>
                <div className="text-xs font-mono font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  {sinkholed ? 'Sinkhole Active Across 1,420 Domains' : 'Sinkhole in Endpoint & Firewalls'}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  Propagate to 1,420 domain assets
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-red-400" />
            </button>

            {/* Export STIX Bundle */}
            <button
              onClick={() => {
                soundFX.playClick();
                setShowPdfModal(true);
              }}
              className="w-full p-2.5 rounded-xl bg-[#070c18] hover:bg-[#101b33] border border-slate-850 text-left transition flex items-center justify-between text-xs font-mono"
            >
              <div>
                <div className="font-bold text-slate-200">Export STIX 2.1 & MISP Bundle</div>
                <div className="text-[9px] text-slate-500">IOCs, regex rules, Suricata rules</div>
              </div>
              <Download className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Trace in Scam DNA */}
            <button
              onClick={() => {
                soundFX.playClick();
                onNavigate('scam-dna');
              }}
              className="w-full p-2.5 rounded-xl bg-[#070c18] hover:bg-[#101b33] border border-cyan-500/30 text-left transition flex items-center justify-between text-xs font-mono"
            >
              <div>
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Network className="w-3.5 h-3.5 text-cyan-400" />
                  Trace in Scam DNA™ Threat Graph
                </div>
                <div className="text-[9px] text-slate-500">Linked to Campaign #RU-F109</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-slate-850 pt-2">
            <span>CROWDSTRIKE FALCON: <strong className="text-cyan-400">SYNCED</strong></span>
            <span>SPLUNK FORWARDER: <strong className="text-emerald-400">READY</strong></span>
          </div>
        </div>
      </div>

      {/* Middle 2x2 Grid of Detailed Forensic Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Live DOM Tree Mutation & Heuristics */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" /> Live DOM Tree Mutation & Heuristics
            </span>
            <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40">
              3 EVASION HOOKS CAUGHT
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Real-time mutation observer triggered during ephemeral headless sandbox load. Cyrillic source comments and debugger-evasion scripts uncovered.
          </p>

          {/* Embedded Code Snippet */}
          <div className="rounded-xl bg-[#070c18] border border-slate-850 p-3 space-y-2 font-mono text-[10px]">
            <div className="flex items-center justify-between text-slate-500 border-b border-slate-850 pb-1">
              <span>SOURCE: inline_payload_obf.js (Line 12-61)</span>
              <span className="text-amber-400">Cyrillic Strings Preserved</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto leading-relaxed">
{`/* Внимание: обход капчи антибота для токена сессии */
const _0xfeab = () => {
  // Anti-Sandboxing Headless Detection
  if (navigator.webdriver || window.callPhantom) {
    window.location.replace("https://support.microsoft.com");
  }
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  const fp = gl.getParameter(gl.RENDERER);
  if (fp.includes('SwiftShader') || fp.includes('LLVMpipe')) {
    return quarantineRedirect();
  }
  document.addEventListener('DOMContentLoaded', _0xfd0b);
};`}
            </pre>
          </div>

          {/* MITRE ATT&CK Triggers */}
          <div className="space-y-1.5 font-mono text-[10px] pt-1">
            <div className="flex items-center justify-between p-2 rounded bg-[#070c18] border border-slate-850">
              <span className="text-slate-300">MITRE T1497.001 - Virtualization/Sandbox Evasion</span>
              <span className="text-red-400 font-bold">TRIGGERED 14:21:40 UTC</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-[#070c18] border border-slate-850">
              <span className="text-slate-300">MITRE T1056.001 - Graphical Keylogger & Credential Scraping</span>
              <span className="text-red-400 font-bold">TRIGGERED 14:21:44 UTC</span>
            </div>
          </div>
        </div>

        {/* Card 2: SSL/TLS Inconsistency & SAN Report */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-400" /> SSL/TLS Inconsistency & SAN Report
            </span>
            <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40">
              CERTIFICATE SPOOF DETECTED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
            {/* Left: Observed Certificate */}
            <div className="p-3 rounded-xl bg-[#070c18] border border-slate-850 space-y-1.5">
              <span className="text-slate-400 font-bold block uppercase text-[9px]">OBSERVED X.509 CERTIFICATE</span>
              <div>
                <span className="text-slate-500 block">Issuer:</span>
                <span className="text-slate-200">Let's Encrypt / Certbot Automated CA</span>
              </div>
              <div>
                <span className="text-slate-500 block">Key:</span>
                <span className="text-slate-200">RSA 2048 (Low-tier key)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Issued:</span>
                <span className="text-slate-200">Today 10:18 UTC (Valid 89 days)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Revocation:</span>
                <span className="text-emerald-400">OCSP Stapling Valid</span>
              </div>
            </div>

            {/* Right: SAN Subject Comparison */}
            <div className="p-3 rounded-xl bg-[#070c18] border border-slate-850 space-y-1.5">
              <span className="text-slate-400 font-bold block uppercase text-[9px]">SAN SUBJECT COMPARISON</span>
              <div>
                <span className="text-slate-500 block">EXPECTED FOR MICROSOFT 365:</span>
                <span className="text-emerald-400">*.login.microsoftonline.com</span>
                <span className="text-[8px] text-slate-500 block">DigiCert Global Root G2 (EV Validated)</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block">ACTUAL HOST SAN:</span>
                <span className="text-red-400 font-bold">*.workers-node3.biz</span>
                <span className="text-red-400 block text-[9px]">DISPARITY: 100% Identity Impersonation</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-slate-850 pt-2">
            <span>CLIENT / PROXY TLS TELEMETRY: <strong className="text-cyan-400">JA3 MATCH</strong></span>
            <span>JA4 FINGERPRINT: <strong className="text-red-400">EvilGinx Server</strong></span>
          </div>
        </div>

        {/* Card 3: Typosquatting & Brand Homoglyphs */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" /> Typosquatting & Brand Homoglyphs
            </span>
            <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/40">
              MIMICRY SCORE: 98%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
            <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850 space-y-1">
              <span className="text-slate-500 block text-[9px] uppercase">LEGITIMATE TARGET URI</span>
              <span className="text-emerald-400 font-bold text-[11px] block">login.microsoftonline.com</span>
              <span className="text-[9px] text-slate-400">Authentic Microsoft Cloud Identity</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850 space-y-1">
              <span className="text-slate-500 block text-[9px] uppercase">DECEPTIVE ATTACK VECTOR</span>
              <span className="text-red-400 font-bold text-[11px] block truncate">auth-microsoft-support-365...</span>
              <span className="text-[9px] text-slate-400">Subdomain Confusion Technique</span>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Levenshtein Edit Distance:</span>
              <span className="text-amber-400 font-bold">1 [Character Insertion Trick]</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Phonetic Soundex Ratio:</span>
              <span className="text-cyan-300 font-bold">98.4% Match to Official Support Portal</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Visual Pixel Match Ratio:</span>
              <span className="text-purple-300 font-bold">99.2% (Stolen Microsoft CSS / Fabric UI)</span>
            </div>
          </div>

          <div className="text-[9px] font-mono text-slate-500 border-t border-slate-850 pt-2">
            Target Brand Notified: <strong className="text-slate-300">Microsoft Threat Intelligence Center (MSTIC-CASE #48109)</strong>
          </div>
        </div>

        {/* Card 4: Network Stream & Intercept Waterfall */}
        <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" /> Network Stream & Intercept Waterfall
            </span>
            <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/40 font-bold">
              ● EXFILTRATION ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Real-time packet capture showing reverse-proxy relay stealing live Microsoft Entra ID session cookies:
          </p>

          {/* Packet capture rows */}
          <div className="space-y-1 font-mono text-[10px]">
            <div className="flex items-center justify-between p-1.5 rounded bg-[#070c18] border border-slate-850">
              <span className="text-cyan-400">GET /kms19client.office304</span>
              <span className="text-emerald-400 font-bold">200 OK (14.7 KB)</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-[#070c18] border border-slate-850">
              <span className="text-amber-400">POST /auth/login.srf [User/Pass]</span>
              <span className="text-orange-400 font-bold">302 FOUND (1.8 KB)</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-[#070c18] border border-slate-850">
              <span className="text-red-400">POST /proxy/relay-cookie (ESTSA_...)</span>
              <span className="text-red-400 font-bold">200 OK (3.4 KB)</span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded bg-[#070c18] border border-slate-850">
              <span className="text-slate-400">GET /redirect?landing=portal...</span>
              <span className="text-blue-400 font-bold">301 MOVED (0.4 KB)</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#070c18] border border-red-500/30 font-mono text-[9px] text-red-300 space-y-0.5">
            <span className="text-slate-400 uppercase font-bold block">INTERCEPTED EXFILTRATION ARTIFACTS:</span>
            <div>Cookie: ESTSAUTH = <code className="text-slate-200">eyJOeXA1OiJKV1Qi... [DECRYPTED]</code></div>
            <div>Cookie: ESTSAUTHPERSISTENT = <strong className="text-red-400">MFA BYPASS COMPLETE</strong></div>
          </div>
        </div>
      </div>

      {/* Bottom Detonation Event Log Stream (eBPF Terminal Hooks) */}
      <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-850 pb-2">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Terminal className="w-4 h-4" /> DETONATION EVENT LOG STREAM (REAL-TIME SANDBOX eBPF HOOKS)
          </span>
          <span className="text-[10px] text-slate-500">BUFFER: 256/256 KB • Replay Execution</span>
        </div>

        <div className="bg-[#070b14] p-3 rounded-xl border border-slate-850 text-[10px] space-y-1 text-slate-400 leading-relaxed overflow-x-auto">
          <div><span className="text-slate-600">[14:21:30.102]</span> <span className="text-cyan-400 font-bold">[INIT]</span> Spawning isolated Chromium sandbox container node sandbox-vm-1-0088.</div>
          <div><span className="text-slate-600">[14:21:30.418]</span> <span className="text-blue-400 font-bold">[NET]</span> Resolved auth-microsoft-support-365.workers-node3.biz -&gt; 194.87.139.44 [AS49382]</div>
          <div><span className="text-slate-600">[14:21:30.995]</span> <span className="text-purple-400 font-bold">[TLS]</span> Handshake established. Cipher: TLS_AES_128_GCM_SHA256. SAN verification: SAN mismatch confirmed.</div>
          <div><span className="text-slate-600">[14:21:35.424]</span> <span className="text-amber-400 font-bold">[ALERT]</span> Heuristic engine detected EvilGinx reverse proxy signature in response headers (Cache-Control: private, no-store).</div>
          <div><span className="text-slate-600">[14:21:40.128]</span> <span className="text-red-400 font-bold">[CRITICAL]</span> Intercept hook captured POST to /auth/login.srf containing victim credentials and hijacked authentication tokens.</div>
          <div><span className="text-slate-600">[14:21:49.991]</span> <span className="text-emerald-400 font-bold">[SOC-AUTOMATION]</span> STIX 2.1 indicator generated. Threat tagged: Adversary-in-the-Middle. Automated sinkhole broadcast.</div>
        </div>
      </div>

      {/* PDF Modal */}
      {showPdfModal && (
        <PdfReportModal
          scan={{
            scan_type: 'url',
            target_input: url,
            sanitized_input: 'hxxps://auth-microsoft-support-365[.]workers-node3.biz/login?ref=e',
            risk_score: 94,
            risk_category: 'CRITICAL',
            verdict: 'Adversary in the Middle (AitM) Reverse Proxy Credential-Harvester',
            detected_signals: [
              { name: 'Reverse-Proxy AitM', severity: 'CRITICAL', detail: 'EvilGinx3 session cookie theft' },
              { name: 'Bulletproof Origin', severity: 'CRITICAL', detail: 'ASN 49382 Saint Petersburg RU' }
            ],
            recommendations: [
              'Deploy DNS sinkhole immediately across 1,420 domain assets.',
              'Revoke compromised Microsoft 365 tokens in Entra ID admin console.'
            ],
            telemetry: { domain: 'auth-microsoft-support-365.workers-node3.biz', resolved_ip: '194.87.139.44' }
          }}
          onClose={() => setShowPdfModal(false)}
        />
      )}
    </div>
  );
};
