import React from 'react';
import { RiskCategory } from '../types';

interface Props {
  score: number;
  category: RiskCategory | string;
  size?: number;
}

export const RiskGauge: React.FC<Props> = ({ score, category, size = 180 }) => {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use a 270 degree arc gauge
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * clampedScore) / 100;

  let color = '#10b981'; // Green
  let glowClass = 'cyber-glow-green';
  let labelText = 'CLEAN';

  if (clampedScore >= 70) {
    color = '#ef4444'; // Red
    glowClass = 'cyber-glow-red';
    labelText = 'DANGEROUS';
  } else if (clampedScore >= 35) {
    color = '#f59e0b'; // Amber
    glowClass = 'cyber-glow-amber';
    labelText = 'SUSPICIOUS';
  } else if (clampedScore >= 15) {
    color = '#3b82f6'; // Blue
    glowClass = 'cyber-glow-cyan';
    labelText = 'LOW RISK';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className={`relative flex items-center justify-center rounded-full p-2 ${glowClass}`}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-135 transition-all duration-1000 ease-out"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active score bar */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold mt-0.5">
            RISK SCORE
          </span>
          <span
            className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 mt-1 rounded font-mono"
            style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
          >
            {labelText}
          </span>
        </div>
      </div>
    </div>
  );
};

