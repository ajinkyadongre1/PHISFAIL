import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, Bell, Shield, Volume2, VolumeX } from 'lucide-react';
import { soundFX } from '../services/sound';

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onQuickDetonate?: () => void;
}

export const Navbar: React.FC<Props> = ({ currentTab, setCurrentTab, onQuickDetonate }) => {
  const [utcTime, setUtcTime] = useState('');
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());
  const [hasAlerts, setHasAlerts] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().slice(17, 25));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSoundToggle = () => {
    const muted = soundFX.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFX.playClick();
  };

  return (
    <header className="h-14 bg-[#070b14] border-b border-slate-800/80 px-4 flex items-center justify-between select-none shrink-0">
      {/* Left: Command Search */}
      <div className="flex items-center gap-3 w-72">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Press / to search IOCs..."
            className="w-full px-3 py-1.5 pl-8 rounded-lg bg-[#0c1424] border border-slate-800 text-xs font-mono text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>

      {/* Center: Shield Active Status & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Shield Active Status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c1424] border border-cyan-500/30 text-[11px] font-mono text-cyan-300 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>SHIELD ACTIVE • 99.98%</span>
        </div>

        {/* Export STIX button */}
        <button
          onClick={() => {
            soundFX.playClick();
            alert('Exporting STIX 2.1 Threat Intelligence Bundle...');
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0c1424] hover:bg-[#121f38] text-slate-300 hover:text-white border border-slate-800 text-xs font-mono transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export STIX</span>
        </button>

        {/* Detonation Scan button */}
        <button
          onClick={() => {
            soundFX.playClick();
            if (onQuickDetonate) onQuickDetonate();
            else setCurrentTab('url-scanner');
          }}
          className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition shadow-lg shadow-blue-600/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Detonation Scan</span>
        </button>
      </div>

      {/* Right: Telemetry, Audio, Bell, User */}
      <div className="flex items-center gap-3 font-mono text-xs">
        {/* 14 CRIT & Clock */}
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-400 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            14 CRIT
          </span>
          <span className="text-slate-400 text-[11px]">UTC {utcTime || '14:22:08'}</span>
        </div>

        {/* Sound toggle */}
        <button
          onClick={handleSoundToggle}
          title={isMuted ? 'Unmute' : 'Mute'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-600" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Alert Bell */}
        <button
          onClick={() => {
            soundFX.playClick();
            setHasAlerts(false);
          }}
          className="relative p-1.5 rounded-lg text-slate-300 hover:text-white"
        >
          <Bell className="w-4 h-4" />
          {hasAlerts && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
          {hasAlerts && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          )}
        </button>

        {/* Profile Circle */}
        <div 
          onClick={() => { soundFX.playClick(); setCurrentTab('settings'); }}
          className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] cursor-pointer"
        >
          <div className="w-full h-full rounded-full bg-[#070b14] flex items-center justify-center text-cyan-300 font-bold text-[10px]">
            AV
          </div>
        </div>
      </div>
    </header>
  );
};
