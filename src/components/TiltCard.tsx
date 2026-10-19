import React, { useRef, useState } from 'react';
import { TactileAudio, triggerTactileHaptic } from '../services/tactileAudio';

interface TiltCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  maxTilt?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  onClick,
  className = '',
  maxTilt = 12,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * maxTilt;
    const rotY = ((x - centerX) / centerX) * maxTilt;

    setTilt({ x: rotX, y: rotY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  const handleClick = () => {
    TactileAudio.tactileClick();
    triggerTactileHaptic('light');
    if (onClick) onClick();
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative select-none cursor-pointer transition-transform duration-150 ease-out [perspective:900px] active:scale-[0.97] ${className}`}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Specular Glare Layer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-overlay transition-opacity duration-200 z-20"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 40%, transparent 70%)`,
          opacity: glare.opacity,
        }}
      />
      {children}
    </div>
  );
};
