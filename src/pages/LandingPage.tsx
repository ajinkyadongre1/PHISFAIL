import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  ArrowRight, 
  Lock, 
  Network, 
  MessageSquareWarning, 
  QrCode, 
  Bot, 
  Zap, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { soundFX } from '../services/sound';

interface Props {
  onLaunchConsole: (defaultTab?: string) => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchConsole }) => {
  const [quickUrl, setQuickUrl] = useState('');

  const handleQuickScan = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    if (quickUrl.trim()) {
      sessionStorage.setItem('phisfail_prefill_url', quickUrl.trim());
    }
    onLaunchConsole('url-scanner');
  };

  const sampleTargets = [
    { label: 'SBI Phishing Scam', url: 'https://sbi-yono-update-kyc.org/login.php' },
    { label: 'Postal Delivery Smish', url: 'https://indiapost-parcel-tracking.vip' },
    { label: 'Legitimate GitHub', url: 'https://github.com' }
  ];

  return (
    <div className="min-h-screen bg-[#06080f] text-slate-100 cyber-grid relative overflow-hidden pb-16">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-4xl mx-auto px-4 pt-10 pb-16 text-center">
        {/* User's Official Brand Logo Showcase */}
        <div className="relative mx-auto max-w-sm mb-6 flex flex-col items-center">
          <div className="relative rounded-3xl overflow-hidden border border-cyan-500/40 cyber-glow-cyan bg-slate-950 p-2 shadow-2xl">
            <img 
              src="/phisfail-logo.png" 
              alt="PHISFAIL - Fail the Phish. Protect the Future." 
              className="w-full h-auto rounded-2xl object-contain drop-shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            />
          </div>
        </div>

        {/* Top Announcement Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-400 text-xs font-mono mb-6 cyber-glow-cyan animate-pulse">
          <Zap className="w-3.5 h-3.5 text-cyan-300" />
          <span>AUTONOMOUS CYBERSECURITY DEFENSE GRID</span>
        </div>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-8 leading-relaxed font-sans">
          PHISFAIL detects fraudulent websites, quishing QR stickers, and smishing messages. 
          It unpacks attack infrastructure via <strong className="text-cyan-400">Scam DNA</strong> and delivers actionable incident response playbooks.
        </p>

        {/* Quick URL Sandbox Form */}
        <div className="max-w-xl mx-auto mb-6">
          <form onSubmit={handleQuickScan} className="relative flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Paste suspicious URL or domain to evaluate..."
                value={quickUrl}
                onChange={(e) => setQuickUrl(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-400 transition"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            </div>
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-black font-bold font-mono text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-1"
            >
              <span>Analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick-Pick Test Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 font-mono text-[11px]">
            <span className="text-slate-500">Quick Test:</span>
            {sampleTargets.map((st, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setQuickUrl(st.url);
                }}
                className="px-2.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 transition"
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              soundFX.playClick();
              onLaunchConsole('dashboard');
            }}
            className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold font-mono text-xs uppercase tracking-wider transition shadow-xl shadow-cyan-400/20 flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Launch Tactical Console</span>
          </button>
          <button
            onClick={() => {
              soundFX.playClick();
              onLaunchConsole('scam-dna');
            }}
            className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-mono text-xs tracking-wide border border-cyan-500/30 transition flex items-center gap-2"
          >
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Scam DNA Graph</span>
          </button>
        </div>
      </section>
    </div>
  );
};
