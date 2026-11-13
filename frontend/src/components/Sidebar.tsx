import React from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  QrCode, 
  MessageSquareWarning, 
  Network, 
  Bot, 
  FileCode, 
  Radio, 
  GraduationCap, 
  Settings, 
  Lock, 
  Zap,
  Shield,
  Activity
} from 'lucide-react';
import { soundFX } from '../services/sound';

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<Props> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'url-scanner', label: 'URL Forensics', icon: Globe },
    { id: 'qr-scanner', label: 'QR Analyzer', icon: QrCode },
    { id: 'sms-scanner', label: 'Message & OCR', icon: MessageSquareWarning },
    { id: 'scam-dna', label: 'Scam DNA™', icon: Network, liveBadge: true },
    { id: 'ai-investigator', label: 'AI Investigator', icon: Bot, zapIcon: true },
    { id: 'history', label: 'STIX Logs', icon: FileCode },
    { id: 'community', label: 'Global Telemetry', icon: Radio },
    { id: 'education', label: 'Threat Academy', icon: GraduationCap },
    { id: 'settings', label: 'SOC Config', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    soundFX.playClick();
    setCurrentTab(id);
  };

  return (
    <aside className="w-64 shrink-0 bg-[#070b14] border-r border-slate-800/80 flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        {/* Brand Header with Logo */}
        <div 
          onClick={() => handleSelect('dashboard')}
          className="flex items-center gap-3 px-2 py-2 cursor-pointer group"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/40 cyber-glow-cyan flex items-center justify-center p-0.5 shrink-0 transition group-hover:scale-105">
            <img 
              src="/phisfail-logo.png" 
              alt="PHISFAIL Logo" 
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-wider text-white font-mono leading-none">
                PHISFAIL
              </span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                v4.8
              </span>
            </div>
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">
              SOC THREAT PLATFORM
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
          OPERATIONAL MODULES
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs transition duration-150 group text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 transition ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                  <span className="tracking-wide text-[11px]">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.liveBadge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold font-mono tracking-wider ${
                      isActive ? 'bg-cyan-300 text-black' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      LIVE
                    </span>
                  )}

                  {item.zapIcon && (
                    <Zap className={`w-3 h-3 ${isActive ? 'text-cyan-300' : 'text-cyan-400'}`} />
                  )}

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white ml-1" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sentinel Node Widget & Analyst Profile */}
      <div className="pt-3 border-t border-slate-800/80 space-y-2">
        {/* Node status telemetry */}
        <div className="p-2.5 rounded-xl bg-[#0c1424] border border-slate-800 space-y-1 font-mono text-[10px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              SENTINEL-NODE 07
            </span>
            <span className="text-cyan-400 font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>LATENCY 0.4ms</span>
            <span className="text-red-400 bg-red-950/70 px-1 rounded border border-red-500/30">
              DEFCON 3
            </span>
          </div>
        </div>

        {/* Analyst Profile */}
        <div className="p-2 rounded-xl bg-[#0c1424] border border-slate-800 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px]">
              <div className="w-full h-full rounded-full bg-[#070b14] flex items-center justify-center text-cyan-300 font-bold text-[10px]">
                AV
              </div>
            </div>
            <div>
              <div className="text-white font-bold text-[11px] leading-tight">Alex Vance</div>
              <div className="text-[9px] text-slate-400">SOC TIER-3 ANALYST</div>
            </div>
          </div>
          <Lock className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>
    </aside>
  );
};
