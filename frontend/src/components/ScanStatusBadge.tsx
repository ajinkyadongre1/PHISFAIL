import React from 'react';
import { RiskCategory } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

interface Props {
  category: RiskCategory | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const ScanStatusBadge: React.FC<Props> = ({ category, size = 'md', showIcon = true }) => {
  const cat = (category || 'UNKNOWN').toUpperCase();

  let bg = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let icon = <Info className="w-3.5 h-3.5" />;

  if (cat === 'MALICIOUS' || cat === 'CRITICAL') {
    bg = 'bg-red-950/80 text-red-400 border-red-500/40 cyber-glow-red';
    icon = <AlertOctagon className="w-3.5 h-3.5 text-red-400 animate-pulse" />;
  } else if (cat === 'SUSPICIOUS') {
    bg = 'bg-amber-950/80 text-amber-400 border-amber-500/40 cyber-glow-amber';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
  } else if (cat === 'LOW_RISK') {
    bg = 'bg-blue-950/80 text-blue-400 border-blue-500/40';
    icon = <Info className="w-3.5 h-3.5 text-blue-400" />;
  } else if (cat === 'SAFE') {
    bg = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 cyber-glow-green';
    icon = <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border backdrop-blur-md uppercase tracking-wider font-mono font-medium ${bg} ${sizeClasses}`}>
      {showIcon && icon}
      {cat}
    </span>
  );
};

