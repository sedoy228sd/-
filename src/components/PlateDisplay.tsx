import React, { useRef, useState } from 'react';
import { COUNTRIES, FRAMES, PLATE_TYPES, RARITIES } from '../data/constants';
import { Plate } from '../types';

interface PlateDisplayProps {
  plate: Plate;
  frameId: string;
  isSpinning?: boolean;
  isSlamming?: boolean;
  onClick?: () => void;
  scale?: number;
}

export const PlateDisplay: React.FC<PlateDisplayProps> = ({
  plate,
  frameId,
  isSpinning = false,
  isSlamming = false,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const frameObj = FRAMES.find((f) => f.id === frameId) || FRAMES[0];
  const countryObj = COUNTRIES.find((c) => c.id === plate.country) || COUNTRIES[0];
  const rarityObj = RARITIES[plate.i] || RARITIES[0];

  // Mouse / Touch 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 18;

    setRotateX(rotX);
    setRotateY(rotY);
    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 14;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);
    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setSheenPos({ x: 50, y: 50 });
  };

  // Color schemes for plate formats
  const getPlateTheme = () => {
    switch (plate.type) {
      case 'police':
        return {
          bg: 'linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 50%, #172554 100%)',
          text: '#ffffff',
          border: '#60a5fa',
          embossHighlight: 'rgba(255,255,255,0.4)',
          embossShadow: 'rgba(0,0,0,0.7)',
          plateClass: 'plate-police',
        };
      case 'taxi':
        return {
          bg: 'linear-gradient(180deg, #fde047 0%, #eab308 50%, #ca8a04 100%)',
          text: '#0f172a',
          border: '#a16207',
          embossHighlight: 'rgba(255,255,255,0.6)',
          embossShadow: 'rgba(0,0,0,0.5)',
          plateClass: 'plate-taxi',
        };
      case 'military':
        return {
          bg: 'linear-gradient(180deg, #262626 0%, #171717 50%, #0a0a0a 100%)',
          text: '#f8fafc',
          border: '#404040',
          embossHighlight: 'rgba(255,255,255,0.3)',
          embossShadow: 'rgba(0,0,0,0.9)',
          plateClass: 'plate-military',
        };
      case 'diplo':
        return {
          bg: 'linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #991b1b 100%)',
          text: '#ffffff',
          border: '#f87171',
          embossHighlight: 'rgba(255,255,255,0.4)',
          embossShadow: 'rgba(0,0,0,0.8)',
          plateClass: 'plate-diplo',
        };
      case 'retro':
        return {
          bg: 'linear-gradient(180deg, #292524 0%, #1c1917 50%, #0c0a09 100%)',
          text: '#facc15',
          border: '#ca8a04',
          embossHighlight: 'rgba(250,204,21,0.4)',
          embossShadow: 'rgba(0,0,0,0.9)',
          plateClass: 'plate-retro',
        };
      default:
        // Civil standard ГОСТ R 50577-2018
        return {
          bg: 'linear-gradient(180deg, #ffffff 0%, #f1f5f9 45%, #e2e8f0 75%, #cbd5e1 100%)',
          text: '#090d16',
          border: '#64748b',
          embossHighlight: 'rgba(255,255,255,0.9)',
          embossShadow: 'rgba(0,0,0,0.6)',
          plateClass: 'plate-civil',
        };
    }
  };

  const theme = getPlateTheme();

  // Outer frame styling
  const getFrameStyling = () => {
    switch (frameId) {
      case 'fsb':
        return 'border-2 border-red-700 bg-gradient-to-b from-[#180808] to-[#2a0c0c] shadow-[0_12px_32px_rgba(185,28,28,0.45)]';
      case 'gold':
        return 'border-2 border-amber-500 bg-gradient-to-b from-[#241a06] via-[#1a1304] to-[#2f2208] shadow-[0_12px_36px_rgba(245,158,11,0.55)]';
      case 'carbon':
        return 'border-2 border-neutral-600 bg-[repeating-linear-gradient(45deg,#0a0a0a,#0a0a0a_3px,#1c1c1c_3px,#1c1c1c_6px)] shadow-[0_12px_30px_rgba(0,0,0,0.9)]';
      case 'neon':
        return 'border-2 border-cyan-400 bg-[#06101c] shadow-[0_0_35px_rgba(6,182,212,0.65)]';
      default:
        return 'border-2 border-slate-700/90 bg-[#121624] shadow-[0_12px_28px_rgba(0,0,0,0.8)]';
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[530px] mx-auto select-none [perspective:1200px]"
    >
      <div
        className={`p-2.5 sm:p-3 rounded-2xl transition-transform duration-150 ease-out relative cursor-pointer ${getFrameStyling()} ${
          isSpinning ? 'anim-shake' : ''
        } ${isSlamming ? 'anim-slam' : ''}`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'scale(1.025)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
        }}
        onClick={onClick}
        title="Нажми, чтобы сгенерировать номер"
      >
        {/* Specular glare sheen layer across the frame & plate */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
          }}
        />

        {/* 3D Embossed License Plate (ГОСТ металлическая штамповка) */}
        <div
          className="relative flex aspect-[4.8/1] rounded-xl overflow-hidden p-1.5 border-[3px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.55),0_4px_12px_rgba(0,0,0,0.6)]"
          style={{
            background: theme.bg,
            color: theme.text,
            borderColor: theme.border,
          }}
        >
          {/* Holographic laser watermark strip (state security feature) */}
          <div
            className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none opacity-20 mix-blend-color-dodge"
            style={{
              background: `linear-gradient(${rotateY * 3 + 120}deg, transparent 20%, rgba(255,0,128,0.4) 40%, rgba(0,255,255,0.4) 60%, transparent 80%)`,
            }}
          />

          {/* Stamped Bolt Fasteners with hex screw head & slot */}
          <div className="absolute left-[17%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-white via-slate-400 to-slate-800 shadow-md border border-black/60 z-10 flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-slate-900 rounded-xs" />
          </div>
          <div className="absolute right-[22.5%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-white via-slate-400 to-slate-800 shadow-md border border-black/60 z-10 flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-slate-900 rounded-xs" />
          </div>

          {/* Main Stamped Number: e.g. А 777 АА */}
          <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2.5 font-plate font-black tracking-tight text-4xl sm:text-6xl leading-none px-2 z-10">
            <span
              className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
              style={{
                textShadow: `1px 1px 0 ${theme.embossHighlight}, -1px -1px 0 ${theme.embossShadow}`,
              }}
            >
              {plate.l[0]}
            </span>
            <span
              className="tracking-normal drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
              style={{
                textShadow: `1px 1px 0 ${theme.embossHighlight}, -1px -1px 0 ${theme.embossShadow}`,
              }}
            >
              {plate.d[0]}
              {plate.d[1]}
              {plate.d[2]}
            </span>
            <span
              className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
              style={{
                textShadow: `1px 1px 0 ${theme.embossHighlight}, -1px -1px 0 ${theme.embossShadow}`,
              }}
            >
              {plate.l[1]}
              {plate.l[2]}
            </span>
          </div>

          {/* Region code and country badge */}
          <div
            className="w-[24%] border-l-[2.5px] flex flex-col items-center justify-center py-0.5 px-1 leading-none font-plate z-10"
            style={{ borderColor: theme.text }}
          >
            <div
              className={`font-black tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)] ${
                plate.reg.length > 2 ? 'text-2xl sm:text-4xl' : 'text-3xl sm:text-5xl'
              }`}
              style={{
                textShadow: `1px 1px 0 ${theme.embossHighlight}, -1px -1px 0 ${theme.embossShadow}`,
              }}
            >
              {plate.reg}
            </div>

            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-xs font-black tracking-wider drop-shadow-xs">
                {countryObj.code}
              </span>
              {plate.country === 'ru' ? (
                <div className="w-4 h-2.5 sm:w-5 sm:h-3 rounded-[2px] overflow-hidden border border-black/40 flex flex-col shadow-xs">
                  <div className="h-1/3 bg-white" />
                  <div className="h-1/3 bg-blue-600" />
                  <div className="h-1/3 bg-red-600" />
                </div>
              ) : (
                <span className="text-xs">{countryObj.flag}</span>
              )}
            </div>
          </div>
        </div>

        {/* Frame Caption with metal badge lettering */}
        <div className="text-center text-[10px] sm:text-xs font-bold tracking-widest text-slate-300 mt-2 uppercase font-plate truncate px-2 drop-shadow-sm">
          {frameObj.cap}
        </div>

        {/* Dynamic Rarity Glow Halo under plate */}
        <div
          className="absolute -inset-1.5 rounded-2xl pointer-events-none -z-10 blur-2xl opacity-75 transition-all duration-500"
          style={{ background: rarityObj.glow }}
        />
      </div>
    </div>
  );
};
