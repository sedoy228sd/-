import React from 'react';
import { RARITIES } from '../data/constants';
import { Plate } from '../types';

interface EvaluationBarProps {
  plate: Plate;
  displayedPrice: number;
  currentTierIndex: number;
  revealedCriteria: string[];
  isCounting: boolean;
}

export const EvaluationBar: React.FC<EvaluationBarProps> = ({
  displayedPrice,
  currentTierIndex,
  revealedCriteria,
  isCounting,
}) => {
  const currentRarity = RARITIES[currentTierIndex] || RARITIES[0];

  return (
    <div className="w-full max-w-[480px] mx-auto flex flex-col items-center gap-2">
      {/* Top Rarity Badge and Price */}
      <div
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#121522]/90 backdrop-blur-md border shadow-lg transition-all duration-300"
        style={{ borderColor: currentRarity.color + '55' }}
      >
        <div>
          <div
            className="text-xs font-black uppercase tracking-wider transition-colors duration-300"
            style={{ color: currentRarity.color }}
          >
            {currentRarity.name}
          </div>
          {/* Dashes rating */}
          <div className="flex gap-1 mt-1">
            {Array.from({ length: currentTierIndex + 1 }).map((_, idx) => (
              <span
                key={idx}
                className="w-3.5 h-1 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: currentRarity.color,
                  boxShadow: `0 0 8px ${currentRarity.color}`,
                }}
              />
            ))}
          </div>
        </div>

        <div
          className={`text-xl sm:text-2xl font-black font-mono-num transition-all duration-200 ${
            isCounting ? 'text-cyan-400 scale-105' : 'text-amber-400'
          }`}
        >
          {displayedPrice.toLocaleString('ru-RU')} ₽
        </div>
      </div>

      {/* Matched Criteria Chips Container */}
      <div className="w-full min-h-[58px] flex flex-col-reverse items-center justify-start gap-1.5 px-2">
        {revealedCriteria.length > 0 ? (
          revealedCriteria.map((crit, idx) => (
            <div
              key={idx}
              className="text-xs sm:text-sm font-bold text-slate-100 px-3 py-1 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md shadow-md animate-fade-in truncate max-w-full"
              style={{
                borderColor: currentRarity.color + '88',
                boxShadow: `0 0 12px ${currentRarity.color}33`,
              }}
            >
              ★ {crit}
            </div>
          ))
        ) : (
          <div className="text-xs text-slate-400 font-medium py-1">
            Нажми на знак или пробел для генерации
          </div>
        )}
      </div>
    </div>
  );
};
