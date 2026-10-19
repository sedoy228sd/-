import React from 'react';
import { Award, Flame, Gift, Sparkles } from 'lucide-react';

interface EventProgressBarProps {
  currentSpins: number;
  onClaimMilestone?: (milestoneIndex: number) => void;
}

export const EventProgressBar: React.FC<EventProgressBarProps> = ({ currentSpins }) => {
  const maxSpins = 100;
  const progressInCycle = currentSpins % maxSpins;
  const percent = Math.min(100, Math.max(0, (progressInCycle / maxSpins) * 100));
  const currentLevel = Math.floor(currentSpins / maxSpins) + 1;

  const milestones = [
    { target: 25, label: '25', reward: 'Серебро', icon: Gift },
    { target: 50, label: '50', reward: '50 000 ₽', icon: Flame },
    { target: 75, label: '75', reward: 'Nitro x3', icon: Sparkles },
    { target: 100, label: '100', reward: 'VIP Кейс', icon: Award },
  ];

  return (
    <div className="w-full max-w-[480px] mx-auto px-4 py-2.5 rounded-2xl bg-[#0f121e]/90 border border-slate-800/80 shadow-lg backdrop-blur-md relative overflow-hidden select-none">
      {/* Background ambient glow */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between text-xs mb-1.5 z-10 relative">
        <div className="flex items-center gap-1.5 font-bold tracking-tight text-slate-200">
          <span className="text-amber-400">⚡</span>
          <span>НЕДЕЛЯ АВТОМОБИЛИСТА</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-black border border-amber-500/30">
            ЭТАП {currentLevel}
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-400 font-bold">
          <span className="text-amber-400 font-black">{progressInCycle}</span> / {maxSpins} спинов
        </div>
      </div>

      {/* Track & Filled Progress with Shimmer and Leading Spark */}
      <div className="relative w-full h-3 bg-slate-900/90 rounded-full p-0.5 border border-slate-800 overflow-hidden shadow-inner">
        {/* Shimmering Fill */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 relative transition-all duration-300 ease-out shadow-[0_0_12px_rgba(245,158,11,0.6)]"
          style={{ width: `${percent}%` }}
        >
          {/* Animated Shimmer Wave */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-sweep pointer-events-none" />

          {/* Spark Particle Tip at the leading edge */}
          {percent > 2 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#fde047,0_0_18px_#f59e0b] animate-ping opacity-75 pointer-events-none" />
          )}
        </div>

        {/* Milestone Tick Markers */}
        {milestones.map((m) => {
          const reached = progressInCycle >= m.target;
          const leftPercent = (m.target / maxSpins) * 100;
          return (
            <div
              key={m.target}
              className="absolute top-0 bottom-0 w-0.5 bg-slate-700/80 -translate-x-1/2 pointer-events-none z-10"
              style={{ left: `${leftPercent}%` }}
            />
          );
        })}
      </div>

      {/* Milestone Icons Row */}
      <div className="relative w-full flex justify-between mt-1 text-[9px] font-bold text-slate-400 z-10">
        {milestones.map((m) => {
          const reached = progressInCycle >= m.target;
          const Icon = m.icon;
          return (
            <div
              key={m.target}
              className={`flex items-center gap-1 transition-colors ${
                reached ? 'text-amber-400 font-black' : 'text-slate-500'
              }`}
            >
              <Icon className={`w-3 h-3 ${reached ? 'text-amber-400 drop-shadow-[0_0_6px_#f59e0b]' : 'text-slate-600'}`} />
              <span>{m.reward}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
