import React from 'react';

/** Gradient fade hints for horizontal scroll containers on mobile */
export const ScrollFade: React.FC<{ className?: string }> = ({ className = '' }) => (
  <>
    <span className={`scroll-fade scroll-fade--left ${className}`} aria-hidden="true" />
    <span className={`scroll-fade scroll-fade--right ${className}`} aria-hidden="true" />
  </>
);