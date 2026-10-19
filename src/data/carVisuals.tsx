import React from 'react';

export interface CarVisualData {
  id: number;
  name: string;
  category: string;
  colorName: string;
  gradient: string;
  svgPath: (accentColor: string) => React.ReactNode;
}

// Highly detailed SVG renders for each iconic vehicle with studio lighting, realistic wheels, reflections and aero
export const CAR_VISUALS: Record<number, {
  accent: string;
  bgGradient: string;
  renderCar: (isHeadlightsOn?: boolean) => React.ReactNode;
}> = {
  // 1. ВАЗ-2101 «Копейка»
  1: {
    accent: '#cbd5e1',
    bgGradient: 'radial-gradient(circle at 50% 60%, rgba(203,213,225,0.15) 0%, transparent 70%)',
    renderCar: (headlights = false) => (
      <svg viewBox="0 0 500 200" className="w-full h-auto drop-shadow-[0_15px_20px_rgba(0,0,0,0.85)]">
        <defs>
          <linearGradient id="vaz01Body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        {/* Floor Shadow */}
        <ellipse cx="250" cy="180" rx="210" ry="14" fill="rgba(0,0,0,0.75)" filter="blur(6px)" />
        {/* Wheels */}
        <circle cx="120" cy="160" r="30" fill="#171717" stroke="#404040" strokeWidth="4" />
        <circle cx="120" cy="160" r="16" fill="url(#chrome)" stroke="#111" strokeWidth="2" />
        <circle cx="380" cy="160" r="30" fill="#171717" stroke="#404040" strokeWidth="4" />
        <circle cx="380" cy="160" r="16" fill="url(#chrome)" stroke="#111" strokeWidth="2" />
        {/* Main Body */}
        <path d="M40 145 C45 130 65 125 110 125 L150 90 C170 75 220 72 320 72 L370 120 C420 120 450 125 460 140 C465 150 455 160 440 160 L395 160 C385 140 345 140 335 160 L165 160 C155 140 115 140 105 160 L60 160 C45 160 38 152 40 145 Z" fill="url(#vaz01Body)" stroke="#475569" strokeWidth="2" />
        {/* Roof & Windows */}
        <path d="M158 92 L230 92 L230 122 L120 122 Z" fill="#0f172a" opacity="0.85" />
        <path d="M236 92 L315 92 L360 122 L236 122 Z" fill="#0f172a" opacity="0.85" />
        {/* Chrome Bumpers */}
        <rect x="25" y="146" width="30" height="9" rx="4" fill="url(#chrome)" stroke="#334155" />
        <rect x="445" y="146" width="30" height="9" rx="4" fill="url(#chrome)" stroke="#334155" />
        {/* Classic Round Headlights */}
        <circle cx="452" cy="134" r="8" fill={headlights ? '#fef08a' : '#f1f5f9'} stroke="url(#chrome)" strokeWidth="2" />
        {headlights && <ellipse cx="480" cy="134" rx="25" ry="10" fill="rgba(254,240,138,0.3)" filter="blur(4px)" />}
      </svg>
    ),
  },

  // 5. Lada Priora «БПАН»
  13: {
    accent: '#10b981',
    bgGradient: 'radial-gradient(circle at 50% 60%, rgba(16,185,129,0.18) 0%, transparent 70%)',
    renderCar: (headlights = false) => (
      <svg viewBox="0 0 500 200" className="w-full h-auto drop-shadow-[0_15px_22px_rgba(0,0,0,0.9)]">
        <defs>
          <linearGradient id="prioraBlack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="40%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>
        {/* Slammed Floor Shadow */}
        <ellipse cx="250" cy="182" rx="220" ry="12" fill="rgba(0,0,0,0.9)" filter="blur(5px)" />
        {/* Deep Tucked Wheels (БПАН Stance) */}
        <circle cx="120" cy="164" r="28" fill="#090d16" stroke="#334155" strokeWidth="4" />
        <circle cx="120" cy="164" r="14" fill="#64748b" />
        <circle cx="380" cy="164" r="28" fill="#090d16" stroke="#334155" strokeWidth="4" />
        <circle cx="380" cy="164" r="14" fill="#64748b" />
        {/* Slammed Body */}
        <path d="M40 148 C45 132 75 126 120 124 L165 85 C190 70 240 68 335 68 L390 120 C435 122 460 128 470 144 C475 152 465 162 445 162 L395 162 C385 146 345 146 335 162 L165 162 C155 146 115 146 105 162 L55 162 C42 162 38 155 40 148 Z" fill="url(#prioraBlack)" stroke="#334155" strokeWidth="1.5" />
        {/* Bunker 5% Tint Windows */}
        <path d="M172 88 L240 88 L240 120 L132 120 Z" fill="#000000" />
        <path d="M246 88 L325 88 L375 120 L246 120 Z" fill="#000000" />
        {/* Xenon Headlights */}
        <polygon points="450,132 468,136 462,144 445,142" fill={headlights ? '#67e8f9' : '#e2e8f0'} />
        {headlights && <ellipse cx="485" cy="138" rx="30" ry="12" fill="rgba(6,182,212,0.4)" filter="blur(5px)" />}
      </svg>
    ),
  },

  // 8. Toyota Supra A80 2JZ
  33: {
    accent: '#f59e0b',
    bgGradient: 'radial-gradient(circle at 50% 60%, rgba(245,158,11,0.2) 0%, transparent 70%)',
    renderCar: (headlights = false) => (
      <svg viewBox="0 0 500 200" className="w-full h-auto drop-shadow-[0_18px_24px_rgba(0,0,0,0.9)]">
        <defs>
          <linearGradient id="supraSilver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="182" rx="225" ry="14" fill="rgba(0,0,0,0.85)" filter="blur(6px)" />
        {/* Massive TRD Wing */}
        <path d="M50 115 L40 68 L70 68 L60 115 Z" fill="#475569" />
        <rect x="35" y="66" width="55" height="6" rx="2" fill="#0f172a" />
        {/* Wheels */}
        <circle cx="125" cy="160" r="30" fill="#090d16" stroke="#94a3b8" strokeWidth="5" />
        <circle cx="125" cy="160" r="14" fill="#e2e8f0" />
        <circle cx="375" cy="160" r="30" fill="#090d16" stroke="#94a3b8" strokeWidth="5" />
        <circle cx="375" cy="160" r="14" fill="#e2e8f0" />
        {/* Aerodynamic Body */}
        <path d="M45 145 C50 128 85 120 135 118 L190 80 C215 65 270 65 345 68 L405 115 C450 118 475 126 480 144 C485 154 472 162 445 162 L405 162 C395 142 355 142 345 162 L155 162 C145 142 105 142 95 162 L55 162 C45 162 42 154 45 145 Z" fill="url(#supraSilver)" stroke="#475569" strokeWidth="2" />
        {/* Windows */}
        <path d="M195 82 L260 82 L260 115 L145 115 Z" fill="#020617" opacity="0.9" />
        <path d="M266 82 L335 82 L385 115 L266 115 Z" fill="#020617" opacity="0.9" />
        {/* Quad Projector Headlights */}
        <ellipse cx="455" cy="130" rx="14" ry="7" fill={headlights ? '#fef08a' : '#1e293b'} stroke="#cbd5e1" strokeWidth="1.5" />
        {headlights && <ellipse cx="485" cy="130" rx="30" ry="12" fill="rgba(254,240,138,0.4)" filter="blur(6px)" />}
      </svg>
    ),
  },

  // 10. Mercedes-AMG G63 «Гелик»
  48: {
    accent: '#ef4444',
    bgGradient: 'radial-gradient(circle at 50% 60%, rgba(239,68,68,0.2) 0%, transparent 70%)',
    renderCar: (headlights = false) => (
      <svg viewBox="0 0 500 200" className="w-full h-auto drop-shadow-[0_20px_26px_rgba(0,0,0,0.95)]">
        <defs>
          <linearGradient id="gelikBlack" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="30%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="186" rx="230" ry="15" fill="rgba(0,0,0,0.9)" filter="blur(6px)" />
        {/* Massive Offroad Rims with Red Calipers */}
        <circle cx="120" cy="158" r="34" fill="#0a0a0a" stroke="#262626" strokeWidth="6" />
        <circle cx="120" cy="158" r="18" fill="#171717" stroke="#ef4444" strokeWidth="2" />
        <circle cx="380" cy="158" r="34" fill="#0a0a0a" stroke="#262626" strokeWidth="6" />
        <circle cx="380" cy="158" r="18" fill="#171717" stroke="#ef4444" strokeWidth="2" />
        {/* Boxy G-Class Body */}
        <path d="M45 152 L45 88 L145 88 L152 48 L370 48 L385 88 L465 88 L465 152 L420 152 C410 130 350 130 340 152 L160 152 C150 130 90 130 80 152 Z" fill="url(#gelikBlack)" stroke="#334155" strokeWidth="2" />
        {/* Square Windows */}
        <rect x="160" y="55" width="60" height="30" rx="3" fill="#000000" stroke="#1e293b" />
        <rect x="228" y="55" width="65" height="30" rx="3" fill="#000000" stroke="#1e293b" />
        <rect x="300" y="55" width="65" height="30" rx="3" fill="#000000" stroke="#1e293b" />
        {/* Panamericana Grille & Round LED Rings */}
        <circle cx="455" cy="115" r="12" fill={headlights ? '#ffffff' : '#0f172a'} stroke="#38bdf8" strokeWidth="2.5" />
        {headlights && <ellipse cx="488" cy="115" rx="32" ry="14" fill="rgba(255,255,255,0.4)" filter="blur(6px)" />}
        {/* Twin Side-Exit Exhausts with glow */}
        <rect x="220" y="156" width="22" height="6" rx="2" fill="#94a3b8" stroke="#ef4444" strokeWidth="1" />
      </svg>
    ),
  },

  // 12. Bugatti Chiron Super Sport
  69: {
    accent: '#38bdf8',
    bgGradient: 'radial-gradient(circle at 50% 60%, rgba(56,189,248,0.25) 0%, transparent 70%)',
    renderCar: (headlights = false) => (
      <svg viewBox="0 0 500 200" className="w-full h-auto drop-shadow-[0_20px_28px_rgba(0,0,0,0.95)]">
        <defs>
          <linearGradient id="chironBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#1e40af" />
            <stop offset="80%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="182" rx="230" ry="14" fill="rgba(0,0,0,0.95)" filter="blur(6px)" />
        {/* Forged Carbon Wheels */}
        <circle cx="125" cy="158" r="32" fill="#020617" stroke="#1e3a8a" strokeWidth="5" />
        <circle cx="125" cy="158" r="15" fill="#38bdf8" opacity="0.8" />
        <circle cx="375" cy="158" r="32" fill="#020617" stroke="#1e3a8a" strokeWidth="5" />
        <circle cx="375" cy="158" r="15" fill="#38bdf8" opacity="0.8" />
        {/* Hypercar Silhouette */}
        <path d="M40 148 C45 125 90 115 140 112 L200 78 C235 60 295 60 360 70 L425 110 C465 115 485 125 488 142 C490 152 478 160 450 160 L405 160 C395 138 355 138 345 160 L155 160 C145 138 105 138 95 160 L50 160 C42 160 38 154 40 148 Z" fill="url(#chironBlue)" stroke="#60a5fa" strokeWidth="1.5" />
        {/* Iconic Bugatti C-Line */}
        <path d="M290 68 C220 68 190 100 190 140 C190 160 210 160 230 160" fill="none" stroke="#ffffff" strokeWidth="4" />
        {/* Quad Jewel LED Headlights */}
        <rect x="445" y="125" width="25" height="6" rx="2" fill={headlights ? '#ffffff' : '#60a5fa'} />
        {headlights && <ellipse cx="488" cy="128" rx="35" ry="14" fill="rgba(255,255,255,0.5)" filter="blur(7px)" />}
      </svg>
    ),
  },
};

// Fallback high-performance renderer for other cars
export function getCarIllustration(carId: number, isHeadlightsOn = false): React.ReactNode {
  const custom = CAR_VISUALS[carId];
  if (custom) return custom.renderCar(isHeadlightsOn);

  // Generic hyper-tuned sports silhouette with metallic gradient
  return (
    <svg viewBox="0 0 500 200" className="w-full h-auto drop-shadow-[0_15px_20px_rgba(0,0,0,0.85)]">
      <defs>
        <linearGradient id="genCarGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>
      <ellipse cx="250" cy="180" rx="215" ry="13" fill="rgba(0,0,0,0.8)" filter="blur(6px)" />
      <circle cx="125" cy="160" r="30" fill="#111" stroke="#475569" strokeWidth="4" />
      <circle cx="125" cy="160" r="14" fill="#94a3b8" />
      <circle cx="375" cy="160" r="30" fill="#111" stroke="#475569" strokeWidth="4" />
      <circle cx="375" cy="160" r="14" fill="#94a3b8" />
      <path d="M45 146 C50 128 85 120 135 118 L185 82 C210 68 265 66 345 68 L405 115 C450 118 475 126 480 144 C485 154 472 162 445 162 L405 162 C395 142 355 142 345 162 L155 162 C145 142 105 142 95 162 L55 162 C45 162 42 154 45 146 Z" fill="url(#genCarGrad)" stroke="#475569" strokeWidth="1.5" />
      <path d="M192 84 L260 84 L260 115 L145 115 Z" fill="#020617" opacity="0.9" />
      <path d="M266 84 L335 84 L385 115 L266 115 Z" fill="#020617" opacity="0.9" />
      <polygon points="450,132 468,136 462,144 445,142" fill={isHeadlightsOn ? '#fef08a' : '#cbd5e1'} />
      {isHeadlightsOn && <ellipse cx="485" cy="138" rx="28" ry="10" fill="rgba(254,240,138,0.4)" filter="blur(5px)" />}
    </svg>
  );
}
