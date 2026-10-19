import React, { useState } from 'react';
import { Plate } from '../types';

interface GostPlateProps {
  plate: Plate;
  isSpinning?: boolean;
  onClick?: () => void;
  scale?: number;
  interactive?: boolean;
}

export const GostPlate: React.FC<GostPlateProps> = ({
  plate,
  isSpinning = false,
  onClick,
  scale = 1,
  interactive = true,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Handle subtle 3D tilt reaction to pointer movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 14;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Determine color scheme based on plate type
  const isPolice = plate.type === 'police';
  const isTaxi = plate.type === 'taxi';
  const isMilitary = plate.type === 'military';
  const isDiplo = plate.type === 'diplo';
  const isRetro = plate.type === 'retro';

  let bgColor = '#ffffff';
  let textColor = '#111827';
  let borderColor = '#111827';
  let dividerColor = '#111827';

  if (isPolice) {
    bgColor = '#1e3a8a';
    textColor = '#ffffff';
    borderColor = '#ffffff';
    dividerColor = '#ffffff';
  } else if (isTaxi) {
    bgColor = '#facc15';
    textColor = '#111827';
    borderColor = '#111827';
    dividerColor = '#111827';
  } else if (isMilitary) {
    bgColor = '#171717';
    textColor = '#ffffff';
    borderColor = '#525252';
    dividerColor = '#525252';
  } else if (isDiplo) {
    bgColor = '#dc2626';
    textColor = '#ffffff';
    borderColor = '#ffffff';
    dividerColor = '#ffffff';
  } else if (isRetro) {
    bgColor = '#1c1917';
    textColor = '#facc15';
    borderColor = '#facc15';
    dividerColor = '#facc15';
  }

  // Format letters & digits
  const l1 = plate.l[0] || 'А';
  const dStr = plate.d.join('');
  const l2 = (plate.l[1] || 'А') + (plate.l[2] || 'А');
  const regStr = plate.reg || '77';

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none transition-transform duration-150 ease-out ${
        interactive ? 'cursor-pointer active:scale-[0.97]' : ''
      } ${isSpinning ? 'anim-shake' : ''}`}
      style={{
        transform: `perspective(800px) scale(${scale}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        width: '100%',
        maxWidth: '440px',
      }}
    >
      {/* Outer plate metal rim with soft shadow and embossed bevel */}
      <div
        className="w-full aspect-[4.85/1] rounded-[10px] p-[3px] shadow-[0_12px_32px_rgba(0,0,0,0.85),0_2px_8px_rgba(0,0,0,0.6)] flex items-stretch transition-shadow duration-300"
        style={{
          backgroundColor: borderColor,
          boxShadow: isHovered
            ? '0 20px 40px rgba(0,0,0,0.95), 0 0 20px rgba(56,189,248,0.25)'
            : '0 12px 32px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.6)',
        }}
      >
        {/* Inner Plate Surface */}
        <div
          className="w-full h-full rounded-[8px] flex items-stretch overflow-hidden relative"
          style={{
            backgroundColor: bgColor,
            color: textColor,
          }}
        >
          {/* Subtle horizontal gradient highlight across metal */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/15 pointer-events-none" />

          {/* Dynamic Metallic Sheen Flare that sweeps across the plate */}
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/35 to-transparent transition-opacity duration-300"
            style={{
              transform: `translateX(${tilt.y * 12}px)`,
              opacity: isHovered || isSpinning ? 0.7 : 0.2,
            }}
          />

          {/* Mounting Bolt Holes on Russian GOST Plates */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 w-2 h-2 rounded-full bg-black/40 border border-white/30 shadow-inner pointer-events-none" />
          <div className="absolute top-1/2 right-[27%] -translate-y-1/2 w-2 h-2 rounded-full bg-black/40 border border-white/30 shadow-inner pointer-events-none" />

          {/* Left section: Series Letters & Number */}
          <div className="flex-1 flex items-center justify-center px-3 sm:px-4 font-plate font-black leading-none tracking-tight z-10">
            {isPolice ? (
              // Police format: А 0001
              <div className="flex items-center gap-2 sm:gap-3 text-4xl sm:text-5xl drop-shadow-sm">
                <span>{l1}</span>
                <span className="font-extrabold tracking-normal">
                  {plate.d[0]}
                  {plate.d[1]}
                  {plate.d[2]}
                  {plate.d[0]}
                </span>
              </div>
            ) : isTaxi ? (
              // Taxi format: АА 001
              <div className="flex items-center gap-2 sm:gap-3 text-4xl sm:text-5xl drop-shadow-sm">
                <span>{l2}</span>
                <span className="font-extrabold tracking-normal">{dStr}</span>
              </div>
            ) : isMilitary ? (
              // Military format: 0001 АА
              <div className="flex items-center gap-2 sm:gap-3 text-4xl sm:text-5xl drop-shadow-sm">
                <span className="font-extrabold tracking-normal">
                  {plate.d[0]}
                  {plate.d[1]}
                  {plate.d[2]}
                  {plate.d[0]}
                </span>
                <span>{l2}</span>
              </div>
            ) : (
              // Standard Civil format: В 175 КХ
              <div className="flex items-center gap-1.5 sm:gap-2.5 text-4xl sm:text-[54px] drop-shadow-sm">
                <span className="drop-shadow-xs">{l1}</span>
                <span className="font-extrabold tracking-normal drop-shadow-xs">{dStr}</span>
                <span className="drop-shadow-xs">{l2}</span>
              </div>
            )}
          </div>

          {/* Vertical divider line */}
          <div
            className="w-[2.5px] self-stretch my-[3px] z-10"
            style={{ backgroundColor: dividerColor }}
          />

          {/* Right section: Region code + RUS + Flag */}
          <div className="w-[24%] flex flex-col items-center justify-between py-1.5 px-1 font-plate z-10">
            {/* Region Number */}
            <div
              className={`font-black leading-none drop-shadow-xs ${
                regStr.length > 2 ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
              }`}
            >
              {regStr}
            </div>

            {/* RUS + Russian Flag */}
            <div className="flex items-center justify-center gap-1.5 w-full pb-0.5">
              <span className="text-[10px] sm:text-xs font-black tracking-wider leading-none drop-shadow-xs">
                RUS
              </span>
              <div className="w-4 h-2.5 sm:w-5 sm:h-3 rounded-[1.5px] overflow-hidden border border-black/50 flex flex-col shadow-xs">
                <div className="h-1/3 bg-white" />
                <div className="h-1/3 bg-[#0039a6]" />
                <div className="h-1/3 bg-[#d52b1e]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
