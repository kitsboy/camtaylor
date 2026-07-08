import React from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div className="scroll-rope" aria-hidden="true">
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