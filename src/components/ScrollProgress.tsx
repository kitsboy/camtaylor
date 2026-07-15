import React from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();
  const percent = Math.round(progress * 100);

  return (
    <div className="scroll-rope" aria-hidden="true">
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
        className="sr-only"
      />
      <div className="scroll-rope-track">
        <div
          className="scroll-rope-fill"
          style={{ transform: `scaleY(${progress})` }}
        />
      </div>
      <div
        className="scroll-rope-carabiner"
        style={{ top: `calc(${progress * 100}% - 6px)` }}
      />
    </div>
  );
};