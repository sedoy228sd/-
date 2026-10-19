import React from 'react';
import { BarChart3, Trophy, X } from 'lucide-react';
import { RARITIES } from '../data/constants';
import { SFX } from '../services/sound';
import { GameStats } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  level: number;
  xp: number;
  nextLevelXp: number;
  totalSpins: number;
  recordPrice: number;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  level,
  xp,
  nextLevelXp,
  totalSpins,
  recordPrice,
}) => {
  if (!isOpen) return null;

  const xpPercent = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[88vh] bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Подробная Статистика</h3>
          </div>
          <button
            onClick={() => {
              SFX.click();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Level Progression */}
          <div className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800">
            <div className="flex items-center justify-between font-bold text-sm mb-1.5">
              <span className="text-purple-400">Уровень {level}</span>
              <span className="text-slate-400 font-mono-num">{xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Big Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-black font-mono-num text-white">
                {totalSpins.toLocaleString('ru-RU')}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Всего сгенерировано</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181d2f] border border-slate-800 text-center">
              <div className="text-xl sm:text-2xl font-black font-mono-num text-amber-400">
                {recordPrice.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Рекорд стоимости номера</div>
            </div>
          </div>

          {/* Rarity Distribution */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2">
              Распределение по редкостям:
            </div>
            {RARITIES.map((r) => {
              const count = stats[r.key] || 0;
              return (
                <div
                  key={r.key}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#181d2f] border border-slate-800/60"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="font-semibold text-slate-200">{r.name}</span>
                  </div>
                  <span className="font-mono-num font-bold text-white">{count.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          {/* Special Combinations */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-2">
              Особые комбинации:
            </div>
            {[
              { label: '3 одинаковые цифры', val: stats.sameDigits },
              { label: '3 одинаковые буквы', val: stats.sameLetters },
              { label: 'Зеркальные цифры (палиндромы)', val: stats.mirrorDigits },
              { label: 'Малые номера (001-009)', val: stats.smallNum },
              { label: 'Цифры по порядку', val: stats.orderDigits },
              { label: 'Блатные спецсерии (ЕКХ, АМР, ВОР)', val: stats.blat },
              { label: 'Цифры совпадают с кодом региона', val: stats.matchReg },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-[#181d2f] border border-slate-800/60"
              >
                <span className="text-slate-300">{item.label}</span>
                <span className="font-mono-num font-bold text-white">{item.val.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
