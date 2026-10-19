import React, { useEffect, useRef, useState } from 'react';
import { Award, Compass, Sparkles, X } from 'lucide-react';
import { SFX, triggerHaptic } from '../services/sound';

interface WheelOfFortuneProps {
  isOpen: boolean;
  onClose: () => void;
  onReward: (type: 'rub' | 'bon' | 'reb' | 'energy', amount: number) => void;
}

const SECTORS = [
  { text: '250 000 ₽', color: '#1e293b', type: 'rub' as const, amount: 250000 },
  { text: '5 ◆ Кристаллов', color: '#0284c7', type: 'bon' as const, amount: 5 },
  { text: '1 500 000 ₽', color: '#047857', type: 'rub' as const, amount: 1500000 },
  { text: '1 👑 Корона', color: '#db2777', type: 'reb' as const, amount: 1 },
  { text: '50 000 ₽', color: '#334155', type: 'rub' as const, amount: 50000 },
  { text: '⚡ Полная Энергия', color: '#10b981', type: 'energy' as const, amount: 50 },
];

export const WheelOfFortune: React.FC<WheelOfFortuneProps> = ({ isOpen, onClose, onReward }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWon, setLastWon] = useState<string | null>(null);

  const drawWheel = (curAngle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    const center = size / 2;
    const radius = center - 10;
    const arc = (2 * Math.PI) / SECTORS.length;

    ctx.clearRect(0, 0, size, size);

    SECTORS.forEach((sec, idx) => {
      const sectorAngle = curAngle + idx * arc;
      ctx.beginPath();
      ctx.fillStyle = sec.color;
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, sectorAngle, sectorAngle + arc);
      ctx.lineTo(center, center);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text label inside sector
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(sectorAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Roboto Condensed, sans-serif';
      ctx.fillText(sec.text, radius - 15, 4);
      ctx.restore();
    });

    // Center hub pin
    ctx.beginPath();
    ctx.arc(center, center, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => drawWheel(angle), 50);
    }
  }, [isOpen, angle]);

  if (!isOpen) return null;

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setLastWon(null);
    SFX.rev();
    triggerHaptic(25);

    let curAngle = angle;
    let speed = 0.5 + Math.random() * 0.25;

    const frame = () => {
      curAngle += speed;
      speed *= 0.985;
      setAngle(curAngle);
      drawWheel(curAngle);

      if (speed > 0.002) {
        requestAnimationFrame(frame);
      } else {
        setIsSpinning(false);
        const arc = (2 * Math.PI) / SECTORS.length;
        const normalized = ((2 * Math.PI - (curAngle % (2 * Math.PI)) + 1.5 * Math.PI) % (2 * Math.PI));
        const sectorIndex = Math.floor(normalized / arc) % SECTORS.length;
        const won = SECTORS[sectorIndex];

        setLastWon(won.text);
        onReward(won.type, won.amount);
        SFX.tierUp(3);
        triggerHaptic(40);
      }
    };

    requestAnimationFrame(frame);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#121522] border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#161a29]">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Колесо Фортуны</h3>
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

        {/* Wheel body */}
        <div className="p-5 flex flex-col items-center">
          <div className="relative my-2">
            {/* Top pointer needle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 z-10 drop-shadow-md" />
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="rounded-full shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_12px_rgba(245,158,11,0.3)] bg-neutral-900"
            />
          </div>

          {lastWon && (
            <div className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black animate-bounce text-center">
              🎉 ВЫИГРЫШ: {lastWon}!
            </div>
          )}

          <button
            disabled={isSpinning}
            onClick={spin}
            className={`w-full mt-4 py-3.5 rounded-xl font-extrabold text-sm transition shadow-xl ${
              isSpinning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black'
            }`}
          >
            {isSpinning ? 'ВРАЩЕНИЕ...' : 'ВРАЩАТЬ КОЛЕСО ФОРТУНЫ'}
          </button>
        </div>
      </div>
    </div>
  );
};
