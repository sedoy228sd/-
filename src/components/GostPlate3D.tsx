import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { COUNTRIES, FRAMES, RARITIES, RUSSIAN_LETTERS } from '../data/constants';
import { TactileAudio, triggerTactileHaptic } from '../services/tactileAudio';
import { Plate } from '../types';

interface GostPlate3DProps {
  plate: Plate;
  frameId?: string;
  isSpinning?: boolean;
  onSpinEnd?: (finalPlate: Plate) => void;
  onClick?: () => void;
  interactive?: boolean;
  scale?: number;
}

export const GostPlate3D: React.FC<GostPlate3DProps> = ({
  plate,
  frameId = 'std',
  isSpinning = false,
  onSpinEnd,
  onClick,
  interactive = true,
  scale = 1,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D Pointer Tracking
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Animation & Physics States
  // status: 'idle' | 'fling_up' | 'drop_in' | 'roulette' | 'complete'
  const [animPhase, setAnimPhase] = useState<'idle' | 'fling_up' | 'roulette'>('idle');
  const [previousPlate, setPreviousPlate] = useState<Plate>(plate);
  const [displayedPlate, setDisplayedPlate] = useState<Plate>(plate);

  // Slot Machine Lock States (true = locked to target character)
  // Index 0: L1, 1: D1, 2: D2, 3: D3, 4: L2, 5: L3, 6: Region
  const [lockedSlots, setLockedSlots] = useState<boolean[]>([true, true, true, true, true, true, true]);
  const [reelDisplay, setReelDisplay] = useState<{
    l1: string;
    d1: number;
    d2: number;
    d3: number;
    l2: string;
    l3: string;
    reg: string;
  }>({
    l1: plate.l[0] || 'А',
    d1: plate.d[0] ?? 7,
    d2: plate.d[1] ?? 7,
    d3: plate.d[2] ?? 7,
    l2: plate.l[1] || 'А',
    l3: plate.l[2] || 'А',
    reg: plate.reg || '777',
  });

  // Screen shake & Screen flash trigger
  const [isShaking, setIsShaking] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // Sync plate when not spinning
  useEffect(() => {
    if (!isSpinning && animPhase === 'idle') {
      setDisplayedPlate(plate);
      setReelDisplay({
        l1: plate.l[0] || 'А',
        d1: plate.d[0] ?? 7,
        d2: plate.d[1] ?? 7,
        d3: plate.d[2] ?? 7,
        l2: plate.l[1] || 'А',
        l3: plate.l[2] || 'А',
        reg: plate.reg || '777',
      });
      setLockedSlots([true, true, true, true, true, true, true]);
    }
  }, [plate, isSpinning, animPhase]);

  // Handle pointer 3D tilt
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || isSpinning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 15;
    const rotY = ((x - centerX) / centerX) * 18;

    setTilt({ x: rotX, y: rotY });
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50 });
  };

  // MAIN PHYSICS & ROULETTE SEQUENCE
  useEffect(() => {
    if (!isSpinning) return;

    // STEP 1: Fling previous plate UP into the air with 3D arc & motion blur
    setPreviousPlate(displayedPlate);
    setAnimPhase('fling_up');
    TactileAudio.flingUpWhoosh();
    triggerTactileHaptic('light');

    // STEP 2: After 220ms, drop new plate in from below with spring bounce and start roulette
    const flingTimer = setTimeout(() => {
      setAnimPhase('roulette');
      setLockedSlots([false, false, false, false, false, false, false]);
      TactileAudio.plateLand();
      triggerTactileHaptic('slam');

      // Rapid symbols cycling interval
      const reelInterval = setInterval(() => {
        TactileAudio.reelTick(1);
        setReelDisplay((prev) => ({
          l1: RUSSIAN_LETTERS[Math.floor(Math.random() * RUSSIAN_LETTERS.length)],
          d1: Math.floor(Math.random() * 10),
          d2: Math.floor(Math.random() * 10),
          d3: Math.floor(Math.random() * 10),
          l2: RUSSIAN_LETTERS[Math.floor(Math.random() * RUSSIAN_LETTERS.length)],
          l3: RUSSIAN_LETTERS[Math.floor(Math.random() * RUSSIAN_LETTERS.length)],
          reg: String(Math.floor(Math.random() * 899) + 100),
        }));
      }, 35);

      // STAGGERED LOCK SEQUENCE FROM LEFT TO RIGHT
      // 0: L1 (at 120ms)
      const t0 = setTimeout(() => {
        setLockedSlots((s) => [true, s[1], s[2], s[3], s[4], s[5], s[6]]);
        setReelDisplay((r) => ({ ...r, l1: plate.l[0] || 'А' }));
        TactileAudio.slotLock(0);
        triggerTactileHaptic('lock');
      }, 120);

      // 1: D1 (at 200ms)
      const t1 = setTimeout(() => {
        setLockedSlots((s) => [true, true, s[2], s[3], s[4], s[5], s[6]]);
        setReelDisplay((r) => ({ ...r, d1: plate.d[0] ?? 7 }));
        TactileAudio.slotLock(1);
        triggerTactileHaptic('lock');
      }, 200);

      // 2: D2 (at 280ms)
      const t2 = setTimeout(() => {
        setLockedSlots((s) => [true, true, true, s[3], s[4], s[5], s[6]]);
        setReelDisplay((r) => ({ ...r, d2: plate.d[1] ?? 7 }));
        TactileAudio.slotLock(2);
        triggerTactileHaptic('lock');
      }, 280);

      // 3: D3 (at 360ms)
      const t3 = setTimeout(() => {
        setLockedSlots((s) => [true, true, true, true, s[4], s[5], s[6]]);
        setReelDisplay((r) => ({ ...r, d3: plate.d[2] ?? 7 }));
        TactileAudio.slotLock(3);
        triggerTactileHaptic('lock');
      }, 360);

      // 4: L2 (at 430ms)
      const t4 = setTimeout(() => {
        setLockedSlots((s) => [true, true, true, true, true, s[5], s[6]]);
        setReelDisplay((r) => ({ ...r, l2: plate.l[1] || 'А' }));
        TactileAudio.slotLock(4);
        triggerTactileHaptic('lock');
      }, 430);

      // 5: L3 (at 500ms)
      const t5 = setTimeout(() => {
        setLockedSlots((s) => [true, true, true, true, true, true, s[6]]);
        setReelDisplay((r) => ({ ...r, l3: plate.l[2] || 'А' }));
        TactileAudio.slotLock(5);
        triggerTactileHaptic('lock');
      }, 500);

      // 6: Region (at 590ms) - Final Lock & Impact
      const t6 = setTimeout(() => {
        clearInterval(reelInterval);
        setLockedSlots([true, true, true, true, true, true, true]);
        setReelDisplay({
          l1: plate.l[0] || 'А',
          d1: plate.d[0] ?? 7,
          d2: plate.d[1] ?? 7,
          d3: plate.d[2] ?? 7,
          l2: plate.l[1] || 'А',
          l3: plate.l[2] || 'А',
          reg: plate.reg || '777',
        });
        setDisplayedPlate(plate);
        setAnimPhase('idle');
        TactileAudio.slotLock(6);
        triggerTactileHaptic('slam');

        // Check if rare plate (777, 001, 666, or tier >= 3)
        const dStr = plate.d.join('');
        const isJackpotNumber =
          dStr === '777' ||
          dStr === '001' ||
          dStr === '666' ||
          dStr === '999' ||
          plate.i >= 3;

        if (isJackpotNumber) {
          setIsShaking(true);
          setShowFlash(true);
          TactileAudio.jackpotFanfare();
          triggerTactileHaptic('jackpot');

          try {
            confetti({
              particleCount: plate.i >= 4 ? 90 : 50,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#a855f7', '#ffffff'],
            });
          } catch {}

          setTimeout(() => setIsShaking(false), 550);
          setTimeout(() => setShowFlash(false), 350);
        }

        if (onSpinEnd) {
          onSpinEnd(plate);
        }
      }, 590);

      return () => {
        clearInterval(reelInterval);
        clearTimeout(t0);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
        clearTimeout(t6);
      };
    }, 220);

    return () => clearTimeout(flingTimer);
  }, [isSpinning, plate]);

  // Current Frame & Rarity
  const frameObj = FRAMES.find((f) => f.id === frameId) || FRAMES[0];
  const countryObj = COUNTRIES.find((c) => c.id === displayedPlate.country) || COUNTRIES[0];
  const rarityObj = RARITIES[displayedPlate.i] || RARITIES[0];

  // Theme styling for plate types (Civil, Police, Taxi, Military, etc.)
  const isPolice = displayedPlate.type === 'police';
  const isTaxi = displayedPlate.type === 'taxi';
  const isMilitary = displayedPlate.type === 'military';
  const isDiplo = displayedPlate.type === 'diplo';
  const isRetro = displayedPlate.type === 'retro';

  let plateBg = 'linear-gradient(180deg, #ffffff 0%, #f8fafc 40%, #e2e8f0 75%, #cbd5e1 100%)';
  let textColor = '#090d16';
  let borderStampingColor = '#475569';
  let dividerColor = '#090d16';
  let embossTopLight = 'rgba(255,255,255,0.95)';
  let embossBottomShadow = 'rgba(0,0,0,0.85)';

  if (isPolice) {
    plateBg = 'linear-gradient(180deg, #1e40af 0%, #1e3a8a 50%, #172554 100%)';
    textColor = '#ffffff';
    borderStampingColor = '#93c5fd';
    dividerColor = '#ffffff';
    embossTopLight = 'rgba(255,255,255,0.5)';
    embossBottomShadow = 'rgba(0,0,0,0.8)';
  } else if (isTaxi) {
    plateBg = 'linear-gradient(180deg, #fde047 0%, #eab308 50%, #ca8a04 100%)';
    textColor = '#0f172a';
    borderStampingColor = '#a16207';
    dividerColor = '#0f172a';
    embossTopLight = 'rgba(255,255,255,0.7)';
    embossBottomShadow = 'rgba(0,0,0,0.6)';
  } else if (isMilitary) {
    plateBg = 'linear-gradient(180deg, #262626 0%, #171717 50%, #0a0a0a 100%)';
    textColor = '#f8fafc';
    borderStampingColor = '#525252';
    dividerColor = '#525252';
    embossTopLight = 'rgba(255,255,255,0.4)';
    embossBottomShadow = 'rgba(0,0,0,0.95)';
  } else if (isDiplo) {
    plateBg = 'linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #991b1b 100%)';
    textColor = '#ffffff';
    borderStampingColor = '#fca5a5';
    dividerColor = '#ffffff';
    embossTopLight = 'rgba(255,255,255,0.5)';
    embossBottomShadow = 'rgba(0,0,0,0.8)';
  } else if (isRetro) {
    plateBg = 'linear-gradient(180deg, #292524 0%, #1c1917 50%, #0c0a09 100%)';
    textColor = '#facc15';
    borderStampingColor = '#ca8a04';
    dividerColor = '#ca8a04';
    embossTopLight = 'rgba(250,204,21,0.5)';
    embossBottomShadow = 'rgba(0,0,0,0.95)';
  }

  // Frame outer border styling
  const getFrameStyling = () => {
    switch (frameId) {
      case 'fsb':
        return 'border-[3px] border-red-700 bg-gradient-to-b from-[#1c0808] via-[#120404] to-[#260a0a] shadow-[0_16px_40px_rgba(185,28,28,0.5),inset_0_2px_4px_rgba(255,255,255,0.2)]';
      case 'gold':
        return 'border-[3px] border-amber-500 bg-gradient-to-b from-[#2a1e08] via-[#191204] to-[#36270a] shadow-[0_16px_44px_rgba(245,158,11,0.6),inset_0_2px_4px_rgba(255,255,255,0.25)]';
      case 'carbon':
        return 'border-[3px] border-neutral-600 bg-[repeating-linear-gradient(45deg,#0a0a0a,#0a0a0a_3px,#1e1e1e_3px,#1e1e1e_6px)] shadow-[0_16px_36px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.15)]';
      case 'neon':
        return 'border-[3px] border-cyan-400 bg-[#06121f] shadow-[0_0_40px_rgba(6,182,212,0.7),inset_0_2px_4px_rgba(255,255,255,0.3)]';
      default:
        return 'border-[3px] border-slate-700/90 bg-gradient-to-b from-[#1b1f2e] via-[#111422] to-[#0c0e18] shadow-[0_16px_36px_rgba(0,0,0,0.9),inset_0_2px_3px_rgba(255,255,255,0.15)]';
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className={`w-full max-w-[500px] mx-auto select-none relative [perspective:1200px] ${
        isShaking ? 'anim-screen-shake' : ''
      }`}
      style={{ transform: `scale(${scale})` }}
    >
      {/* SCREEN FLASH OVERLAY FOR TOP/JACKPOT NUMBERS */}
      {showFlash && (
        <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-b from-white/80 via-amber-200/50 to-transparent animate-flash-decay" />
      )}

      {/* 3D FLOATING PEDESTAL / SURFACE FLOOR WITH CONTACT SHADOW */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[92%] h-14 pointer-events-none [perspective:800px]">
        {/* Contact shadow that expands, blurs and lightens as plate lifts into air */}
        <div
          className="w-full h-full rounded-[50%] transition-all duration-300 ease-out"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, transparent 75%)`,
            transform:
              animPhase === 'fling_up'
                ? 'scaleX(1.35) scaleY(1.3) translateY(20px)'
                : isHovered
                ? 'scaleX(1.08) scaleY(1.05)'
                : 'scaleX(1) scaleY(1)',
            opacity: animPhase === 'fling_up' ? 0.15 : 0.85,
            filter: animPhase === 'fling_up' ? 'blur(30px)' : 'blur(9px)',
          }}
        />

        {/* Ambient Floor Glow matching rarity color */}
        <div
          className="absolute inset-0 rounded-[50%] blur-2xl transition-all duration-500 opacity-60"
          style={{
            backgroundColor: rarityObj.color,
            transform: 'scaleX(1.15) scaleY(0.9)',
          }}
        />
      </div>

      {/* PREVIOUS PLATE FLINGING UP (GHOST LAYER IN FLIGHT) */}
      {animPhase === 'fling_up' && (
        <div
          className="absolute inset-0 pointer-events-none z-30 animate-plate-fling-up"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div className={`p-2.5 sm:p-3 rounded-2xl ${getFrameStyling()} opacity-75 blur-[2px]`}>
            <div
              className="relative flex aspect-[4.85/1] rounded-xl overflow-hidden p-1.5 border-[3px]"
              style={{ background: plateBg, color: textColor }}
            >
              <div className="flex-1 flex items-center justify-center font-plate font-black text-4xl sm:text-6xl">
                {previousPlate.l[0]} {previousPlate.d.join('')} {previousPlate.l[1]}
                {previousPlate.l[2]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE 3D PLATE CONTAINER */}
      <div
        onClick={onClick}
        className={`p-2.5 sm:p-3 rounded-2xl relative cursor-pointer transition-transform duration-150 ease-out ${getFrameStyling()} ${
          animPhase === 'roulette' ? 'animate-plate-bounce-in' : ''
        }`}
        style={{
          transform:
            animPhase === 'fling_up'
              ? 'translateY(-180px) rotateX(60deg) scale(0.82) opacity(0)'
              : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
                  isHovered ? 'scale(1.025)' : 'scale(1)'
                }`,
          transformStyle: 'preserve-3d',
          transition: animPhase === 'fling_up' ? 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
        }}
        title="Нажми для генерации номера"
      >
        {/* Dynamic Specular Sheen (Glides with pointer movement) */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-45 mix-blend-overlay transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.15) 35%, transparent 65%)`,
          }}
        />

        {/* 3D EMBOSSED ALUMINUM LICENSE PLATE (ГОСТ Р 50577) */}
        <div
          className="relative flex aspect-[4.85/1] rounded-xl overflow-hidden p-1.5 border-[3px] shadow-[inset_0_3px_5px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.6),0_6px_16px_rgba(0,0,0,0.7)]"
          style={{
            background: plateBg,
            color: textColor,
            borderColor: borderStampingColor,
          }}
        >
          {/* Embossed Outer Perimeter Bead (Выдавленная окантовка пластины по ГОСТу) */}
          <div className="absolute inset-[2.5px] rounded-[9px] border-[2px] border-black/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.5)] pointer-events-none z-10" />

          {/* Micro-Prismatic Retroreflective Sheeting Texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
            style={{
              backgroundImage: `radial-gradient(#000000 0.75px, transparent 0.75px)`,
              backgroundSize: '4px 4px',
            }}
          />

          {/* Holographic Security Feature ("RUS" laser watermark with iridescent color-dodge) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25 mix-blend-color-dodge transition-all duration-300"
            style={{
              background: `linear-gradient(${
                tilt.y * 3 + 125
              }deg, transparent 15%, rgba(255,0,128,0.5) 35%, rgba(0,255,255,0.5) 55%, transparent 75%)`,
            }}
          />

          {/* 3D MOUNTING BOLTS (Chrome hex screw with bevel, washer and cross slot) */}
          <div className="absolute left-[16%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-white via-slate-300 to-slate-700 shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-black/60 z-20 flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-slate-900 rounded-xs" />
          </div>
          <div className="absolute right-[23%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-white via-slate-300 to-slate-700 shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-black/60 z-20 flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-slate-900 rounded-xs" />
          </div>

          {/* MAIN CHARACTERS STAGE: SLOT MACHINE REELS (L1 · D1 D2 D3 · L2 L3) */}
          <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2.5 font-plate font-black tracking-tight text-4xl sm:text-[56px] leading-none px-2 z-10">
            {/* Slot 0: Series Letter 1 */}
            <div
              className={`transition-all duration-150 inline-flex items-center justify-center min-w-[28px] sm:min-w-[38px] ${
                !lockedSlots[0] ? 'blur-[1.5px] scale-105 opacity-80' : 'scale-100 opacity-100'
              }`}
              style={{
                textShadow: `0 1px 0 ${embossTopLight}, 0 -1px 0 ${embossBottomShadow}, 1px 2px 2px rgba(0,0,0,0.6)`,
              }}
            >
              {reelDisplay.l1}
            </div>

            {/* Digits Cluster: D1, D2, D3 */}
            <div className="flex items-center tracking-normal">
              {/* Slot 1: Digit 1 */}
              <span
                className={`transition-all duration-150 inline-flex items-center justify-center min-w-[22px] sm:min-w-[30px] ${
                  !lockedSlots[1] ? 'blur-[1.5px] scale-105 opacity-80' : 'scale-100 opacity-100'
                }`}
                style={{
                  textShadow: `0 1px 0 ${embossTopLight}, 0 -1px 0 ${embossBottomShadow}, 1px 2px 2px rgba(0,0,0,0.6)`,
                }}
              >
                {reelDisplay.d1}
              </span>

              {/* Slot 2: Digit 2 */}
              <span
                className={`transition-all duration-150 inline-flex items-center justify-center min-w-[22px] sm:min-w-[30px] ${
                  !lockedSlots[2] ? 'blur-[1.5px] scale-105 opacity-80' : 'scale-100 opacity-100'
                }`}
                style={{
                  textShadow: `0 1px 0 ${embossTopLight}, 0 -1px 0 ${embossBottomShadow}, 1px 2px 2px rgba(0,0,0,0.6)`,
                }}
              >
                {reelDisplay.d2}
              </span>

              {/* Slot 3: Digit 3 */}
              <span
                className={`transition-all duration-150 inline-flex items-center justify-center min-w-[22px] sm:min-w-[30px] ${
                  !lockedSlots[3] ? 'blur-[1.5px] scale-105 opacity-80' : 'scale-100 opacity-100'
                }`}
                style={{
                  textShadow: `0 1px 0 ${embossTopLight}, 0 -1px 0 ${embossBottomShadow}, 1px 2px 2px rgba(0,0,0,0.6)`,
                }}
              >
                {reelDisplay.d3}
              </span>
            </div>

            {/* Trailing Letters: L2 & L3 */}
            <div className="flex items-center">
              {/* Slot 4: Letter 2 */}
              <span
                className={`transition-all duration-150 inline-flex items-center justify-center min-w-[26px] sm:min-w-[34px] ${
                  !lockedSlots[4] ? 'blur-[1.5px] scale-105 opacity-80' : 'scale-100 opacity-100'
                }`}
                style={{
                  textShadow: `0 1px 0 ${embossTopLight}, 0 -1px 0 ${embossBottomShadow}, 1px 2px 2px rgba(0,0,0,0.6)`,
                }}
              >
                {reelDisplay.l2}
              </span>

              {/* Slot 5: Letter 3 */}
              <span
                className={`transition-all duration-150 inline-flex items-center justify-center min-w-[26px] sm:min-w-[34px] ${
                  !lockedSlots[5] ? 'blur-[1.5px] scale-105 opacity-80' : 'scale-100 opacity-100'
                }`}
                style={{
                  textShadow: `0 1px 0 ${embossTopLight}, 0 -1px 0 ${embossBottomShadow}, 1px 2px 2px rgba(0,0,0,0.6)`,
                }}
              >
                {reelDisplay.l3}
              </span>
            </div>
          </div>

          {/* VERTICAL SEPARATION GROOVE (Pressed Divider Bar) */}
          <div
            className="w-[3px] self-stretch my-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.6)] z-10"
            style={{ backgroundColor: dividerColor }}
          />

          {/* RIGHT SECTION: REGION CODE + RUS + RUSSIAN FLAG */}
          <div className="w-[24%] flex flex-col items-center justify-between py-1 px-1 font-plate z-10 leading-none">
            {/* Slot 6: Region Code (e.g. 777 or 197) */}
            <div
              className={`font-black tracking-tighter transition-all duration-150 ${
                reelDisplay.reg.length > 2 ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'
              } ${!lockedSlots[6] ? 'blur-[1px] opacity-80' : 'opacity-100'}`}
              style={{
                textShadow: `0 1px 0 ${embossTopLight}, 0 -1px 0 ${embossBottomShadow}, 1px 2px 2px rgba(0,0,0,0.6)`,
              }}
            >
              {reelDisplay.reg}
            </div>

            {/* Country Identifier & Flag */}
            <div className="flex items-center justify-center gap-1.5 w-full pb-0.5">
              <span className="text-[10px] sm:text-xs font-black tracking-wider leading-none drop-shadow-xs">
                {countryObj.code}
              </span>
              {displayedPlate.country === 'ru' ? (
                <div className="w-4 h-2.5 sm:w-5 sm:h-3 rounded-[2px] overflow-hidden border border-black/60 flex flex-col shadow-xs">
                  <div className="h-1/3 bg-white" />
                  <div className="h-1/3 bg-[#0039a6]" />
                  <div className="h-1/3 bg-[#d52b1e]" />
                </div>
              ) : (
                <span className="text-xs leading-none">{countryObj.flag}</span>
              )}
            </div>
          </div>
        </div>

        {/* Frame Caption Lettering (e.g. "РОССИЯ ГОСТ" or "ФСБ РФ") */}
        <div className="text-center text-[10px] sm:text-xs font-bold tracking-widest text-slate-300 mt-2 uppercase font-plate truncate px-2 drop-shadow-sm">
          {frameObj.cap}
        </div>

        {/* MULTI-LAYER PULSATING RARITY AURA (Common, Rare, Epic, Legendary) */}
        <div
          className="absolute -inset-2.5 rounded-3xl pointer-events-none -z-10 blur-2xl opacity-75 animate-aura-pulse transition-all duration-700"
          style={{
            background: rarityObj.glow,
            boxShadow: `0 0 45px ${rarityObj.color}`,
          }}
        />
      </div>
    </div>
  );
};
