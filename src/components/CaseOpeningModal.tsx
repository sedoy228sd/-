import React, { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Box, Sparkles, Trophy, X, Zap } from 'lucide-react';
import { RARITIES } from '../data/constants';
import { generatePlate } from '../services/plateGenerator';
import { SFX, triggerHaptic } from '../services/sound';
import { Plate } from '../types';

interface CaseOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onDeductFunds: (amount: number) => boolean;
  onAddPlateToInventory: (plate: Plate) => void;
}

interface CaseType {
  id: string;
  name: string;
  cost: number;
  icon: string;
  color: string;
  desc: string;
  luckMult: number;
}

const CASES: CaseType[] = [
  {
    id: 'bronze',
    name: 'Кейс «Перекуп»',
    cost: 50000,
    icon: '📦',
    color: '#94a3b8',
    desc: 'Шанс на редкие серии и зеркальные цифры',
    luckMult: 1.2,
  },
  {
    id: 'gold',
    name: 'Кейс «Олигарх»',
    cost: 500000,
    icon: '👑',
    color: '#f59e0b',
    desc: 'Повышенный шанс на ЕКХ, АМР и три топора 777',
    luckMult: 2.8,
  },
  {
    id: 'syndicate',
    name: 'Кейс «Синдикат ФСБ»',
    cost: 5000000,
    icon: '🔥',
    color: '#ec4899',
    desc: 'Эксклюзив: Эпические, Легендарные и GODLIKE знаки',
    luckMult: 6.5,
  },
];

export const CaseOpeningModal: React.FC<CaseOpeningModalProps> = ({
  isOpen,
  onClose,
  balance,
  onDeductFunds,
  onAddPlateToInventory,
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseType>(CASES[1]);
  const [isOpening, setIsOpening] = useState(false);
  const [stripPlates, setStripPlates] = useState<Plate[]>([]);
  const [winningPlate, setWinningPlate] = useState<Plate | null>(null);
  const [stripOffset, setStripOffset] = useState(0);

  if (!isOpen) return null;

  const startCaseOpening = () => {
    if (isOpening) return;
    if (!onDeductFunds(selectedCase.cost)) return;

    setIsOpening(true);
    setWinningPlate(null);
    setStripOffset(0);

    SFX.rev();
    triggerHaptic(25);

    // Generate 45 items in roulette strip
    const newStrip: Plate[] = [];
    for (let i = 0; i < 45; i++) {
      newStrip.push(generatePlate('ru', '77', 'civil', undefined, selectedCase.luckMult));
    }

    // Index 38 will be the winner!
    const winner = generatePlate('ru', '77', 'civil', undefined, selectedCase.luckMult * 1.5);
    newStrip[38] = winner;
    setStripPlates(newStrip);

    // Calculate scroll offset
    // Each card is 108px wide (100px width + 8px gap)
    const cardWidth = 108;
    const targetCardIndex = 38;
    const randomCardJitter = Math.floor(Math.random() * 50) - 25;
    const targetOffset = -(targetCardIndex * cardWidth - 170 + randomCardJitter);

    // Animate strip after short delay
    setTimeout(() => {
      setStripOffset(targetOffset);

      // Play ticking sound while passing cards
      let ticks = 0;
      const tickInterval = setInterval(() => {
        ticks++;
        SFX.tick(ticks * 8);
        if (ticks >= 28) {
          clearInterval(tickInterval);
        }
      }, 140);
    }, 100);

    // Reveal winner
    setTimeout(() => {
      setIsOpening(false);
      setWinningPlate(winner);
      onAddPlateToInventory(winner);

      if (winner.i >= 4) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      SFX.tierUp(winner.i + 1);
      triggerHaptic(50);
    }, 4700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Контейнеры & Кейсы с номерами</h3>
              <div className="text-[11px] text-slate-400">Рулетка редких и эксклюзивных госзнаков</div>
            </div>
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
        <div className="p-4 sm:p-5 space-y-4">
          {/* Case Selection Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {CASES.map((c) => {
              const isSelected = selectedCase.id === c.id;
              return (
                <button
                  key={c.id}
                  disabled={isOpening}
                  onClick={() => {
                    setSelectedCase(c);
                    SFX.click();
                  }}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-lg'
                      : 'bg-[#181d2f] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">{c.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{c.desc}</div>
                  </div>
                  <div className="font-mono-num font-black text-amber-400 text-xs sm:text-sm mt-2">
                    {c.cost.toLocaleString('ru-RU')} ₽
                  </div>
                </button>
              );
            })}
          </div>

          {/* Roulette Strip Viewer */}
          <div className="relative w-full h-28 bg-[#0a0c14] border-2 border-slate-800 rounded-2xl overflow-hidden shadow-inner flex items-center">
            {/* Center pointer indicator */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-rose-500 z-20 shadow-[0_0_12px_#ef4444]">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-rose-500 -ml-[4px]" />
            </div>

            {/* Sliding strip */}
            <div
              className="flex gap-2 absolute left-1/2 transition-transform duration-[4500ms] ease-[cubic-bezier(0.12,0.8,0.2,1)]"
              style={{
                transform: `translateX(${stripOffset}px)`,
              }}
            >
              {stripPlates.length > 0 ? (
                stripPlates.map((p, idx) => {
                  const rar = RARITIES[p.i] || RARITIES[0];
                  return (
                    <div
                      key={idx}
                      className="w-[100px] h-[86px] shrink-0 rounded-xl bg-[#141824] border border-slate-800 p-2 flex flex-col justify-between items-center shadow-md"
                      style={{ borderBottom: `3px solid ${rar.color}` }}
                    >
                      <div className="px-1.5 py-0.5 rounded bg-white text-black font-plate font-black text-xs">
                        {p.l[0]}{p.d.join('')}{p.l[1]}{p.l[2]}
                      </div>
                      <div className="text-[9px] font-bold uppercase truncate" style={{ color: rar.color }}>
                        {rar.name}
                      </div>
                      <div className="text-[10px] font-mono-num font-bold text-amber-400">
                        {p.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-slate-500 text-xs font-semibold px-4 whitespace-nowrap">
                  Нажмите «ОТКРЫТЬ КЕЙС», чтобы запустить рулетку номеров
                </div>
              )}
            </div>
          </div>

          {/* Winning Announcement */}
          {winningPlate && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-amber-950/40 to-slate-900 border border-amber-500/50 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <div className="text-xs text-slate-300 font-semibold">Выпал номер из кейса:</div>
                  <div className="text-sm font-black text-white font-plate">
                    {winningPlate.l[0]} {winningPlate.d.join('')} {winningPlate.l[1]}{winningPlate.l[2]} {winningPlate.reg}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-xs font-extrabold uppercase"
                  style={{ color: RARITIES[winningPlate.i].color }}
                >
                  {RARITIES[winningPlate.i].name}
                </div>
                <div className="text-sm font-mono-num font-black text-amber-400">
                  +{winningPlate.price.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>
          )}

          {/* Open Button */}
          <button
            disabled={isOpening || balance < selectedCase.cost}
            onClick={startCaseOpening}
            className={`w-full py-4 rounded-xl font-black text-sm transition shadow-xl flex items-center justify-center gap-2 ${
              balance >= selectedCase.cost && !isOpening
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-amber-500/25'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isOpening
              ? 'РУЛЕТКА ВРАЩАЕТСЯ...'
              : `ОТКРЫТЬ ${selectedCase.name.toUpperCase()} (${selectedCase.cost.toLocaleString('ru-RU')} ₽)`}
          </button>
        </div>
      </div>
    </div>
  );
};
