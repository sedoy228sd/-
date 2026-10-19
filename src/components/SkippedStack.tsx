import React from 'react';
import { COUNTRIES } from '../data/constants';
import { Plate } from '../types';

interface SkippedStackProps {
  skippedList: Plate[];
}

export const SkippedStack: React.FC<SkippedStackProps> = ({ skippedList }) => {
  if (!skippedList.length) {
    return <div className="h-10 w-full" />;
  }

  return (
    <div className="flex flex-col items-center h-11 relative w-full max-w-[260px] mx-auto select-none">
      <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1 opacity-80">
        Пропущено ({skippedList.length})
      </div>
      <div className="relative w-40 h-7">
        {skippedList.slice(0, 4).map((p, idx) => {
          const yOff = -idx * 6;
          const scale = 1 - idx * 0.06;
          const opacity = idx === 0 ? 1 : idx === 1 ? 0.75 : idx === 2 ? 0.5 : 0.25;
          const country = COUNTRIES.find((c) => c.id === p.country) || COUNTRIES[0];

          return (
            <div
              key={p.id || idx}
              className="absolute inset-0 flex items-center justify-between px-2 py-0.5 rounded-sm bg-gradient-to-b from-white via-neutral-200 to-neutral-300 text-neutral-900 border border-neutral-700 shadow-md font-plate font-black text-xs transition-all duration-300 pointer-events-none"
              style={{
                transform: `translateY(${yOff}px) scale(${scale})`,
                opacity,
                zIndex: 10 - idx,
              }}
            >
              <span className="tracking-tight">
                {p.l[0]}
                {p.d.join('')}
                {p.l[1]}
                {p.l[2]}
              </span>
              <div className="flex items-center gap-1 border-l border-neutral-800 pl-1.5 text-[9px] leading-tight">
                <span>{p.reg}</span>
                <span className="text-[8px]">{country.flag}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
