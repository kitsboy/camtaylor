import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  color: string;
}

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const particleCount    = Math.min(55, Math.floor((width * height) / 26000));
    const connectionDistance = 110;
    const mouse = { x: -1000, y: -1000, radius: 160, active: false };

    // Muted dark-on-light tones
    const COLORS = {
      primary: 'rgba(30, 69, 52, 0.55)',   // forest green
      secondary: 'rgba(184, 135, 42, 0.4)', // amber gold
    };

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 1.6 + 0.6;
      particles.push({
        x:           Math.random() * width,
        y:           Math.random() * height,
        vx:          (Math.random() - 0.5) * 0.3,
        vy:          (Math.random() - 0.5) * 0.3,
        radius,
        baseRadius:  radius,
        alpha:       Math.random() * 0.4 + 0.15,
        color:       Math.random() > 0.82 ? COLORS.secondary : COLORS.primary,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    const handleMouseMove  = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; };
    const handleMouseLeave = ()               => { mouse.x = -1000; mouse.y = -1000; mouse.active = false; };
    const handleMouseClick = (e: MouseEvent) => {
      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.8;
        particles.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2.5 + 0.8,
          baseRadius: Math.random() * 1.2 + 0.4,
          alpha: 0.8,
          color: Math.random() > 0.5 ? COLORS.primary : COLORS.secondary,
        });
      }
      if (particles.length > particleCount + 40) particles.splice(particleCount, particles.length - (particleCount + 40));
    };

    window.addEventListener('resize',     handleResize);
    window.addEventListener('mousemove',  handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click',      handleMouseClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Very faint topographic-style grid
      ctx.strokeStyle = 'rgba(24, 22, 15, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 90;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (mouse.active) {
          const dx   = mouse.x - p.x;
          const dy   = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 0.5;
            p.y += (dy / dist) * force * 0.5;
            p.radius = p.baseRadius + force * 1.2;
          } else {
            p.radius = p.baseRadius;
          }
        } else {
          p.radius = p.baseRadius;
        }

        if (particles.length > particleCount && index >= particleCount) {
          p.alpha -= 0.012;
          if (p.alpha <= 0) { particles.splice(index, 1); return; }
        }

        if (p.x < 0 || p.x > width)  p.vx *= -1;
        if (p.y < 0 || p.y > height)  p.vy *= -1;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i], p2 = particles[j];
          const dx   = p1.x - p2.x;
          const dy   = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const a = (1 - dist / connectionDistance) * 0.06;
            ctx.strokeStyle = `rgba(30, 69, 52, ${a})`;
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize',     handleResize);
      window.removeEventListener('mousemove',  handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click',      handleMouseClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
};
