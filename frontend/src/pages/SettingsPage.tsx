import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Key, 
  Cpu, 
  Shield, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Info,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { SystemStatus } from '../types';
import { soundFX } from '../services/sound';

export const SettingsPage: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.getSystemStatus();
      setStatus(res);
    } catch (e) {
      console.error('Failed to fetch system status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCopy = (text: string, id: string) => {
    soundFX.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleAudio = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playClick();
  };

  const sampleEnv = `PORT=8000
ENVIRONMENT=development
# AI Explanations
GEMINI_API_KEY=your_gemini_api_key_here

# Threat Intelligence APIs
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
GOOGLE_SAFE_BROWSING_API_KEY=your_safe_browsing_key_here

# Supabase Database (Optional - fallback to local storage if absent)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_key
`;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-[#0c1427] to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              SYSTEM STATUS & API INTEGRATIONS
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Live inspection of external intelligence providers, environment configuration, and fallback adapters.
            </p>
          </div>
        </div>

        <button
          onClick={() => { soundFX.playClick(); fetchStatus(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition border border-slate-700 self-start md:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Check Status</span>
        </button>
      </div>

      {/* Integration Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gemini API */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-mono font-bold text-white">Google Gemini API</span>
            </div>
            {status?.integrations.gemini_api.active ? (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live
              </span>
            ) : (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
                Demo Fallback Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Powers the conversational AI Cybersecurity Investigator. When live key is missing, our comprehensive local cyber incident rule engine handles all queries.
          </p>
          <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-2 rounded border border-slate-850">
            Mode: {status?.integrations.gemini_api.mode}
          </div>
        </div>

        {/* VirusTotal API */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-mono font-bold text-white">VirusTotal v3 Intelligence</span>
            </div>
            {status?.integrations.virustotal.active ? (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live API
              </span>
            ) : (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
                Simulated Telemetry Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Queries global security vendor detection ratios. Emits explicit simulated indicator flags when credentials are not configured.
          </p>
          <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-2 rounded border border-slate-850">
            Mode: {status?.integrations.virustotal.mode}
          </div>
        </div>

        {/* Google Safe Browsing */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-mono font-bold text-white">Google Safe Browsing v4</span>
            </div>
            {status?.integrations.safe_browsing.active ? (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Live Feed
              </span>
            ) : (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
                Simulated Feed Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Evaluates deceptive social engineering targets. Transparently flags demo evaluations for hackathon evaluation.
          </p>
          <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-2 rounded border border-slate-850">
            Mode: {status?.integrations.safe_browsing.mode}
          </div>
        </div>

        {/* Supabase Cloud / Local Database */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-mono font-bold text-white">Database & Persistence</span>
            </div>
            {status?.integrations.supabase_db.active ? (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Supabase Live
              </span>
            ) : (
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                Local JSON Store Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Stores scan history, community reports, and Scam DNA nodes. Pre-seeded with rich sample datasets.
          </p>
          <div className="text-[11px] font-mono text-cyan-300 bg-slate-950 p-2 rounded border border-slate-850">
            Storage: {status?.integrations.supabase_db.mode}
          </div>
        </div>
      </div>

      {/* Audio Preferences Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-sm font-mono font-bold text-white flex items-center gap-2">
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            Cyber Audio Feedback Synthesizer
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Plays subtle Web Audio sound cues on radar scans, alert sirens, and clean verifications.
          </p>
        </div>
        <button
          onClick={handleToggleAudio}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition ${
            isMuted
              ? 'bg-slate-800 text-slate-400 hover:text-white'
              : 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
          }`}
        >
          {isMuted ? 'Muted' : 'Audio Enabled'}
        </button>
      </div>

      {/* Environment Configuration Guide */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white uppercase flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            Environment Setup Reference (.env)
          </span>
          <button
            onClick={() => handleCopy(sampleEnv, 'env')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
          >
            {copiedKey === 'env' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'env' ? 'Copied' : 'Copy .env.example'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 font-sans">
          To enable live Google Gemini, VirusTotal, Safe Browsing, or Supabase, create a <code className="text-cyan-300">.env</code> file in <code className="text-cyan-300">backend/</code> with the variables below:
        </p>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
          {sampleEnv}
        </pre>
      </div>
    </div>
  );
};

