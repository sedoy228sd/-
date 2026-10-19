import React, { useEffect, useRef, useState } from 'react';
import { TactileAudio } from '../services/tactileAudio';

interface AnimatedBalanceCounterProps {
  value: number;
  className?: string;
}

export const AnimatedBalanceCounter: React.FC<AnimatedBalanceCounterProps> = ({
  value,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [status, setStatus] = useState<'idle' | 'up' | 'down'>('idle');
  const [diff, setDiff] = useState<number | null>(null);
  const prevValueRef = useRef(value);
  const animRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const prev = prevValueRef.current;
    if (prev === value) return;

    const delta = value - prev;
    prevValueRef.current = value;
    setDiff(delta);

    const isUp = delta > 0;
    setStatus(isUp ? 'up' : 'down');

    // Smooth count interpolation
    const startVal = displayValue;
    const endVal = value;
    const startTime = performance.now();
    const duration = Math.min(600, Math.max(250, Math.abs(delta) > 5000 ? 500 : 350));

    let lastTickVal = startVal;

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (endVal - startVal) * ease);
      setDisplayValue(current);

      // Play soft audio tick every interval
      if (Math.abs(current - lastTickVal) >= Math.max(1, Math.abs(delta) / 12)) {
        TactileAudio.balanceTick(isUp);
        lastTickVal = current;
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(update);
      } else {
        setDisplayValue(endVal);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setStatus('idle');
          setDiff(null);
        }, 600);
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(update);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  return (
    <div
      className={`relative inline-flex items-center gap-1 font-mono tabular-nums transition-all duration-200 select-none ${className} ${
        status === 'down' ? 'anim-micro-shake' : ''
      }`}
    >
      <span
        className={`font-black tracking-tight transition-all duration-300 ${
          status === 'up'
            ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.85)] scale-105'
            : status === 'down'
            ? 'text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.85)] scale-98'
            : 'text-amber-400'
        }`}
      >
        {displayValue.toLocaleString('ru-RU')}
      </span>
      <span className="text-slate-400 text-xs">₽</span>

      {/* Floating diff bubble (+15 000 ₽ or -500 ₽) */}
      {diff !== null && (
        <span
          className={`absolute -top-5 right-0 text-[11px] font-black pointer-events-none whitespace-nowrap transition-all duration-500 animate-float-fade ${
            diff > 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {diff > 0 ? `+${diff.toLocaleString('ru-RU')} ₽` : `${diff.toLocaleString('ru-RU')} ₽`}
        </span>
      )}
    </div>
  );
};
