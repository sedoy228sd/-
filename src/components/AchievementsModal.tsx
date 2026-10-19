import React from 'react';
import { ArrowLeft, Check, Trophy } from 'lucide-react';
import { SFX, triggerHaptic } from '../services/sound';
import { GameState } from '../types';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onClaimReward: (reward: number) => void;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  reward: number;
  isUnlocked: (s: GameState) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blat',
    title: 'Первый блат',
    desc: 'Выбить спецсерию ЕКХ, АМР или ВОР',
    icon: '👑',
    reward: 50000,
    isUnlocked: (s) => s.stats.blat > 0,
  },
  {
    id: 'triple_seven',
    title: 'Три топора 777',
    desc: 'Выбить номер с тремя семерками',
    icon: '🎰',
    reward: 100000,
    isUnlocked: (s) => s.rec >= 2500000 || s.stats.sameDigits > 0,
  },
  {
    id: 'millionaire',
    title: 'Первый миллион',
    desc: 'Заработать суммарно более 1 000 000 ₽',
    icon: '💰',
    reward: 250000,
    isUnlocked: (s) => s.earn >= 1000000,
  },
  {
    id: 'car_collector',
    title: 'Автопарк олигарха',
    desc: 'Купить не менее 3 автомобилей в гараж',
    icon: '🏎️',
    reward: 150000,
    isUnlocked: (s) => s.garageCars.length >= 3,
  },
  {
    id: 'hundred_spins',
    title: 'Неутомимый перекуп',
    desc: 'Сделать более 100 генераций номеров',
    icon: '⚡',
    reward: 75000,
    isUnlocked: (s) => s.sp >= 100,
  },
];

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  state,
  onClaimReward,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080a10] text-white animate-fade-in select-none">
      <header className="px-4 py-3.5 flex items-center gap-4 border-b border-slate-800 bg-[#080a10]/95 backdrop-blur-md sticky top-0 z-10">
        <button
          onClick={() => {
            SFX.click();
            onClose();
          }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-300 hover:text-white transition"
          aria-label="Назад"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">
          Достижения
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = ach.isUnlocked(state);
          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                unlocked
                  ? 'bg-[#181d2f] border-amber-500/50 shadow-md'
                  : 'bg-[#121522] border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ach.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {ach.title}
                    {unlocked && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ВЫПОЛНЕНО
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{ach.desc}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono-num font-bold text-amber-400">
                  +{ach.reward.toLocaleString('ru-RU')} ₽
                </div>
                {unlocked && (
                  <button
                    onClick={() => {
                      onClaimReward(ach.reward);
                      SFX.coin();
                      triggerHaptic(25);
                    }}
                    className="mt-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-sm transition"
                  >
                    Забрать
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
