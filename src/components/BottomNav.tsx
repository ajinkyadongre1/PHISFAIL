import React from 'react';
import { LayoutGrid, Scan, Network, Bot, GraduationCap } from 'lucide-react';
import { soundFX } from '../services/sound';

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<Props> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Command', icon: LayoutGrid },
    { id: 'url-scanner', label: 'Scan', icon: Scan },
    { id: 'scam-dna', label: 'DNA', icon: Network },
    { id: 'ai-investigator', label: 'AI Bot', icon: Bot },
    { id: 'education', label: 'Academy', icon: GraduationCap },
  ];

  const handleSelect = (id: string) => {
    soundFX.playClick();
    setCurrentTab(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shadow-2xl">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id || (tab.id === 'url-scanner' && (currentTab === 'qr-scanner' || currentTab === 'sms-scanner'));

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition duration-150 relative ${isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition ${isActive ? 'scale-110 drop-shadow-[0_0_8px_#00f0ff]' : ''}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>
              <span className={`text-[10px] font-mono mt-1 tracking-wide ${isActive ? 'font-bold text-cyan-300' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

