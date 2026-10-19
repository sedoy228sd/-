import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  sparkle?: boolean;
  isSmoke?: boolean;
}

interface ParticleCanvasProps {
  rarityGlow?: string;
  burstTier?: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  rarityGlow = 'rgba(148,163,184,0.3)',
  burstTier = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial ambient dust motes & gentle mist puffs
    particlesRef.current = [];

    // Ambient floating golden/dust motes
    const ambientCount = 35;
    for (let i = 0; i < ambientCount; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -Math.random() * 0.25 - 0.05,
        size: Math.random() * 2.2 + 0.8,
        color: '#94a3b8',
        alpha: Math.random() * 0.4 + 0.15,
        decay: 0,
      });
    }

    // Gentle animated smoke/mist puffs on the floor and behind the plate
    const smokeCount = 14;
    for (let i = 0; i < smokeCount; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: height * 0.45 + (Math.random() - 0.5) * height * 0.4,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.15 - 0.02,
        size: Math.random() * 80 + 50,
        color: '#3b82f6',
        alpha: Math.random() * 0.06 + 0.02,
        decay: 0,
        isSmoke: true,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric background: midnight obsidian with central royal illumination
      const bgGradient = ctx.createRadialGradient(
        width / 2,
        height * 0.35,
        width * 0.05,
        width / 2,
        height * 0.45,
        width * 0.75
      );
      bgGradient.addColorStop(0, rarityGlow);
      bgGradient.addColorStop(0.45, 'rgba(15, 20, 36, 0.45)');
      bgGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Update & draw particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.decay > 0) {
          p.alpha -= p.decay;
          p.size *= 0.985;
          if (p.alpha <= 0.01) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          // Ambient wrap around
          if (p.x < -p.size) p.x = width + p.size;
          if (p.x > width + p.size) p.x = -p.size;
          if (p.y < -p.size) p.y = height + p.size;
          if (p.y > height + p.size) p.y = -p.size;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.isSmoke) {
          // Soft diffused smoke puff gradient
          const smokeGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          smokeGrad.addColorStop(0, 'rgba(148, 163, 184, 0.08)');
          smokeGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.03)');
          smokeGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = smokeGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.sparkle ? 9 : 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [rarityGlow]);

  // Trigger burst on tier drop
  useEffect(() => {
    if (burstTier >= 2 && canvasRef.current) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      const count = burstTier >= 5 ? 85 : burstTier >= 4 ? 55 : 28;
      const colors =
        burstTier >= 5
          ? ['#ec4899', '#f43f5e', '#a855f7', '#38bdf8', '#fbbf24']
          : burstTier >= 4
          ? ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff']
          : ['#38bdf8', '#818cf8', '#c084fc'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2.5;
        particlesRef.current.push({
          x: width / 2 + (Math.random() - 0.5) * 80,
          y: height * 0.45 + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3.5 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.022 + 0.015,
          sparkle: true,
        });
      }
    }
  }, [burstTier]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: 'transform' }}
    />
  );
};
