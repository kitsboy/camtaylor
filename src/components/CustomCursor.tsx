import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduced) return;

    setEnabled(true);
    document.body.classList.add('custom-cursor-on');

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setActive(!!t.closest('a, button, [role="button"], input, textarea, select, .venture-card'));
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });

    return () => {
      document.body.classList.remove('custom-cursor-on');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      className={`custom-cursor ${active ? 'custom-cursor--active' : ''}`}
      style={{ left: pos.x, top: pos.y }}
      aria-hidden="true"
    />
  );
};