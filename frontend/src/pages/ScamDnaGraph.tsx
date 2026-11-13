import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Filter, 
  ShieldAlert, 
  Globe, 
  Server, 
  Cpu, 
  Maximize2, 
  Plus, 
  Minus, 
  Download, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  ChevronDown, 
  Pause, 
  Layers, 
  Bot, 
  Mail, 
  Share2,
  Radio
} from 'lucide-react';
import { soundFX } from '../services/sound';

export const ScamDnaGraph: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('APX-7702-RU');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('auth-msft');
  const [isPaused, setIsPaused] = useState(false);
  const [sinkholed, setSinkholed] = useState(false);

  // Nodes configuration matching Image 3
  const nodes = [
    { 
      id: 'auth-msft', 
      label: 'auth-msft-verify.net', 
      score: '98 CRIT', 
      desc: 'AitM Reverse-Proxy [M365 Session Hijack]', 
      latency: 'LATENCY: 18ms SELECTED',
      x: 62, 
      y: 42, 
      color: 'border-cyan-400 bg-cyan-950/90 text-cyan-300' 
    },
    { 
      id: 'tor-node', 
      label: '185.226.101.5 TOR', 
      desc: 'Anonymized Proxy Relay • RISK 94 • AS208052', 
      x: 32, 
      y: 30, 
      color: 'border-slate-700 bg-slate-900 text-slate-300' 
    },
    { 
      id: 'qr-node', 
      label: 'qr.quick-verify.me [QUISH]', 
      desc: 'Conditional Geo-Bypass • RISK 88 • Polymorphic SVG', 
      x: 58, 
      y: 28, 
      color: 'border-cyan-500 bg-slate-900 text-cyan-300' 
    },
    { 
      id: 'exfil-bot', 
      label: '@phish_exfil_bot', 
      desc: 'Live Token Exfil Webhook • RISK 91 • TG Bot API v6', 
      x: 48, 
      y: 54, 
      color: 'border-slate-700 bg-slate-900 text-slate-300' 
    },
    { 
      id: 'crypto-node', 
      label: '0x71C...4f90 Permit2 Drainer', 
      desc: 'RISK 97 • ETH BAL: 38.4 ($132k)', 
      x: 63, 
      y: 50, 
      color: 'border-emerald-500 bg-slate-900 text-emerald-400' 
    },
    { 
      id: 'sms-node', 
      label: 'SMS Cluster #402', 
      desc: 'Guerilla Simbox Array (+44) • RISK 96 • 14,200 DISPATCHED', 
      x: 32, 
      y: 52, 
      color: 'border-red-500 bg-slate-900 text-red-400' 
    },
  ];

  const handleNodeClick = (id: string) => {
    soundFX.playClick();
    setSelectedNodeId(id);
  };

  const handleSinkhole = () => {
    soundFX.playThreatAlert();
    setSinkholed(true);
  };

  return (
    <div className="space-y-4 pb-12 max-w-7xl mx-auto">
      {/* Top Threat Mutation Banner Strip */}
      <div className="p-3 rounded-2xl bg-[#0c1424] border border-red-500/40 flex flex-col lg:flex-row lg:items-center justify-between gap-2 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-red-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            DEFCON 1 ACTIVE MUTATION
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-white font-bold">ACTIVE CAMPAIGN VECTOR: C2 Matrix #APX-7702-RU</span>
          <span className="text-slate-600">•</span>
          <span className="text-red-400">MUTATING IN REAL TIME (14 Linked Nodes)</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>POLARITY DRIFT: <strong className="text-cyan-400">+8.4% / hr</strong></span>
          <span>IOC PROPAGATION: <strong className="text-emerald-400">GLOBAL TIER-1 CDN</strong></span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800"
          >
            <Pause className="w-3 h-3 text-cyan-400" />
            <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search with EXACT badge */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-1.5 pl-8 pr-14 rounded-xl bg-[#0c1424] border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-cyan-400 px-1 rounded bg-[#070c18] border border-cyan-500/30">
              EXACT
            </span>
          </div>

          {/* Filter dropdowns */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0c1424] border border-red-500/30 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span>Severity: Critical</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0c1424] border border-slate-800 text-slate-300">
            <span>Vector: AitM Reverse-Proxy</span>
            <ChevronDown className="w-3 h-3 ml-0.5 text-slate-500" />
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0c1424] border border-slate-800 text-slate-300">
            <span>Campaign: ApexPhish Matrix</span>
            <ChevronDown className="w-3 h-3 ml-0.5 text-slate-500" />
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0c1424] border border-slate-800 text-slate-300">
            <span>Window: Past 72h</span>
            <ChevronDown className="w-3 h-3 ml-0.5 text-slate-500" />
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <button className="px-2.5 py-1.5 rounded-xl bg-[#0c1424] border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Force Live
          </button>
          <button className="px-2.5 py-1.5 rounded-xl bg-[#0c1424] border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1">
            <Radio className="w-3 h-3 text-purple-400" /> 3D Orbit
          </button>
          <button className="p-1.5 rounded-lg bg-[#0c1424] border border-slate-800 text-slate-400 hover:text-white">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg bg-[#0c1424] border border-slate-800 text-slate-400 hover:text-white">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded-lg bg-[#0c1424] border border-slate-800 text-slate-400 hover:text-white">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left (Topology Canvas + Metrics) & Right (Threat Dossier Sheet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (7 cols): Canvas + Metrics */}
        <div className="lg:col-span-7 space-y-4">
          {/* Topology Canvas */}
          <div className="p-4 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-white flex items-center gap-1.5">
                <Network className="w-4 h-4 text-cyan-400" /> TOPOLOGY: ADVERSARY C2 FEDERATION
              </span>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-cyan-400">14 NODES • 21 TELEMETRY EDGES</span>
                <span>RENDER: 60 FPS</span>
                <span className="text-slate-500">SUBGRAPH: STIX 2.1 SYNTH</span>
              </div>
            </div>

            {/* Radar Canvas with interactive nodes */}
            <div className="relative h-96 rounded-xl bg-[#070b14] border border-slate-850 overflow-hidden flex items-center justify-center">
              {/* Concentric circles */}
              <div className="absolute w-80 h-80 rounded-full border border-cyan-500/10 pointer-events-none" />
              <div className="absolute w-56 h-56 rounded-full border border-cyan-500/15 pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full border border-cyan-500/25 pointer-events-none" />
              <div className="absolute w-full h-[1px] bg-cyan-500/10 pointer-events-none" />
              <div className="absolute h-full w-[1px] bg-cyan-500/10 pointer-events-none" />

              {/* Connecting lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="45%" y1="45%" x2="62%" y2="42%" stroke="#00f0ff" strokeWidth="2" strokeDasharray="3 3" opacity="0.8" />
                <line x1="45%" y1="45%" x2="32%" y2="30%" stroke="#64748b" strokeWidth="1.2" opacity="0.5" />
                <line x1="45%" y1="45%" x2="58%" y2="28%" stroke="#00f0ff" strokeWidth="1.5" opacity="0.6" />
                <line x1="45%" y1="45%" x2="48%" y2="54%" stroke="#64748b" strokeWidth="1.2" opacity="0.5" />
                <line x1="45%" y1="45%" x2="63%" y2="50%" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
                <line x1="45%" y1="45%" x2="32%" y2="52%" stroke="#ef4444" strokeWidth="1.8" opacity="0.8" />
              </svg>

              {/* Central Root Node */}
              <div className="absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center cyber-glow-red animate-pulse">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                </div>
                <div className="bg-[#0a1220]/95 px-2 py-0.5 rounded border border-red-500/40 text-[9px] font-mono font-bold text-red-400 mt-1 whitespace-nowrap">
                  ● ApexPhish-Kit-v3 [ROOT C2]
                </div>
                <span className="text-[8px] font-mono text-slate-500">MUTATING • 99 RISK</span>
              </div>

              {/* Nodes */}
              {nodes.map((n) => {
                const isSelected = selectedNodeId === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleNodeClick(n.id)}
                    style={{ top: `${n.y}%`, left: `${n.x}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl border font-mono text-[9px] shadow-2xl transition cursor-pointer z-10 flex flex-col text-left ${n.color} ${
                      isSelected ? 'ring-2 ring-cyan-400 scale-105 cyber-glow-cyan' : 'hover:scale-105'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 font-bold text-white">
                      <span>{n.label}</span>
                      {n.score && (
                        <span className="text-[8px] px-1 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                          {n.score}
                        </span>
                      )}
                    </div>
                    <span className="text-[8px] text-slate-400 mt-0.5">{n.desc}</span>
                    {n.latency && (
                      <span className="text-[7px] text-cyan-400 font-bold mt-0.5">{n.latency}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom canvas status strip */}
            <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-850">
              <div>CLUSTER DNA HASH: <span className="text-cyan-400">SHA256:d8a9f029...e1c4b</span></div>
              <div>REUSED ARTIFACTS: <span className="text-white font-bold">3 Core Signatures</span></div>
              <div>Clustering: <span className="text-slate-300">Levenshtein+DOM</span></div>
              <button className="text-cyan-400 hover:underline">Focus Root</button>
            </div>
          </div>

          {/* 3 Metrics Cards under Canvas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* DNA POLARITY DRIFT */}
            <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase font-bold">
                <span>DNA POLARITY DRIFT</span>
                <span className="text-cyan-400 font-bold">+14.2%</span>
              </div>
              <div className="text-sm font-bold font-mono text-white">Kit Mutation Rate</div>
              <p className="text-[10px] text-slate-400 font-sans">
                Polymorphic obfuscation detected across 9 script tags every 22 mins.
              </p>
            </div>

            {/* TARGET EXPOSURE */}
            <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase font-bold">
                <span>TARGET EXPOSURE</span>
                <span className="text-blue-400 font-bold">TIER-1 ENTERPRISE</span>
              </div>
              <div className="text-sm font-bold font-mono text-white">4,280 Inboxes Hit</div>
              <p className="text-[10px] text-slate-400 font-sans">
                Corporate Office 365, Okta SSO, and Azure AD accounts prioritized.
              </p>
            </div>

            {/* SINKHOLE READINESS */}
            <div className="p-3.5 rounded-2xl bg-[#0c1424] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase font-bold">
                <span>SINKHOLE READINESS</span>
                <span className="text-emerald-400 font-bold">100% RESOLVABLE</span>
              </div>
              <div className="text-sm font-bold font-mono text-white">14/14 Node Hooks</div>
              <p className="text-[10px] text-slate-400 font-sans">
                Registrar BGP poisoning and upstream DNS sinkhole coordinates verified.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Comprehensive Threat Dossier Sheet */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0c1424] border border-cyan-500/40 cyber-glow-cyan space-y-3.5">
            {/* Header: PRIMARY TARGET C2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                <span>PRIMARY TARGET C2</span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                99.4% DNA MATCH
              </span>
            </div>

            <div>
              <h2 className="text-lg font-black font-mono text-white">
                auth-msft-verify.net
              </h2>
              <div className="text-[10px] font-mono text-slate-500">
                Reverse-Proxy Node • Canonical FQDN
              </div>
            </div>

            {/* Scores Bar */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850">
                <span className="text-slate-500 text-[9px] block">THREAT SCORE</span>
                <span className="text-red-400 font-black text-sm">98 / 100</span>
                <span className="text-[9px] text-slate-400 block">Critical AitM Proxy</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850">
                <span className="text-slate-500 text-[9px] block">SESSION HIJACKS</span>
                <span className="text-white font-black text-sm">142 EST.</span>
                <span className="text-[9px] text-cyan-400 block">Active Cookie Exfil</span>
              </div>
            </div>

            {/* DNA SIGNATURE MATCHES */}
            <div className="space-y-2 border-t border-slate-850 pt-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400">
                <span>DNA SIGNATURE MATCHES</span>
                <span className="text-cyan-400">3 SIGNATURES DETECTED</span>
              </div>

              {/* Match 1 */}
              <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850 space-y-1 font-mono text-[10px]">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>&lt;&gt; DOM Tree Comment Signature</span>
                  <span className="text-red-400 font-extrabold text-[9px]">100% MATCH</span>
                </div>
                <div className="text-cyan-300">&lt;!-- apx_stage3_rev7_worker_init --&gt;</div>
                <p className="text-[9px] text-slate-400 font-sans">
                  Unique obfuscated comment tag matching Russian APT kit variant #7702.
                </p>
              </div>

              {/* Match 2 */}
              <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850 space-y-1 font-mono text-[10px]">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>Reused Favicon MD5 Hash</span>
                  <span className="text-emerald-400 font-bold text-[9px]">EXACT MD5</span>
                </div>
                <div className="text-slate-300 text-[9px]">8f49c017d04b2c1a96c1c828455...</div>
                <p className="text-[9px] text-slate-400 font-sans">
                  Authentic Microsoft 365 32x32 glyph with injected rogue EXIF metadata.
                </p>
              </div>

              {/* Match 3 */}
              <div className="p-2.5 rounded-xl bg-[#070c18] border border-slate-850 space-y-1 font-mono text-[10px]">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span>Collocated Infrastructure</span>
                  <span className="text-amber-400 font-bold text-[9px]">12 ATTACKS</span>
                </div>
                <p className="text-[9px] text-slate-400 font-sans">
                  Autonomous System AS-STARKNET host binding 12 currently operational landing pages under identical NS records.
                </p>
              </div>
            </div>

            {/* ATTACK PROGRESSION TIMELINE */}
            <div className="space-y-1.5 border-t border-slate-850 pt-2 font-mono text-[10px]">
              <span className="text-slate-400 font-bold uppercase block text-[9px]">ATTACK PROGRESSION TIMELINE</span>
              
              <div className="space-y-2 pl-2 border-l border-cyan-500/40">
                <div>
                  <div className="flex justify-between text-slate-400 text-[9px]">
                    <span>● T - 72h Ingestion</span>
                    <span className="text-slate-500">UTC 11:29:18</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[10px]">
                    DNS record provisioning registered via NameCheap with privacy shield.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-red-400 font-bold text-[9px]">
                    <span>● T - 24h Mass Escalation</span>
                    <span className="text-slate-500">UTC 08:44:00</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[10px]">
                    Dispatch of 4,200 executive spear-phishing lures referencing pending HR equity grants.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-emerald-400 font-bold text-[9px]">
                    <span>● Current State: MITIGATING</span>
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                  </div>
                  <p className="text-slate-300 font-sans text-[10px]">
                    Upstream cloudflare token interception hook triggered; automated quarantine in progress.
                  </p>
                </div>
              </div>
            </div>

            {/* TACTICAL INTERVENTION Buttons */}
            <div className="space-y-2 border-t border-slate-850 pt-3">
              <span className="text-[9px] font-mono uppercase text-slate-500 font-bold block">TACTICAL INTERVENTION</span>

              {/* Red Sinkhole button */}
              <button
                onClick={handleSinkhole}
                className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg ${
                  sinkholed
                    ? 'bg-emerald-500 text-black'
                    : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 text-white shadow-red-500/30'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{sinkholed ? 'CLUSTER SINKHOLED (14 NODES QUARANTINED)' : '⚡ Sinkhole Entire Cluster (14 Nodes)'}</span>
              </button>

              {/* Dark Evidence Pack */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  alert('Generating Law Enforcement Evidence Pack (PDF & STIX 2.1)...');
                }}
                className="w-full py-2 rounded-xl bg-[#070c18] hover:bg-[#101a2f] border border-slate-800 text-slate-300 font-mono text-[11px] transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Generate Evidence Pack (PDF/STIX 2.1)</span>
              </button>

              {/* Notify Cloudflare */}
              <button
                onClick={() => {
                  soundFX.playClick();
                  alert('Cloudflare abuse notification and upstream transit tickets created.');
                }}
                className="w-full py-2 rounded-xl bg-[#070c18] hover:bg-[#101a2f] border border-slate-800 text-slate-400 hover:text-slate-200 font-mono text-[10px] transition flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3 h-3 text-cyan-400" />
                <span>Notify Cloudflare & Tier-1 Transit Abuse</span>
              </button>
            </div>

            {/* AI Investigator Mini Co-Pilot Card */}
            <div className="p-2.5 rounded-xl bg-[#070c18] border border-cyan-500/30 flex items-center justify-between font-mono text-[10px]">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-white font-bold">AI INVESTIGATOR: T-800 SENTRY</div>
                  <div className="text-slate-500">Correlation Confidence: <span className="text-cyan-400">99.82%</span></div>
                </div>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                AUTO-SYNC
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
