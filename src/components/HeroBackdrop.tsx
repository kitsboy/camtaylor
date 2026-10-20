import React from 'react';
import { usePageVisible } from '../hooks/usePageVisible';

export const HeroBackdrop: React.FC = () => {
  const visible = usePageVisible();
  return (
    <div className={`hero-backdrop-wrap${visible ? '' : ' is-paused'}`} aria-hidden="true">
      <div className="hero-backdrop-aurora" />
      <div className="hero-backdrop-contours" />
      <div className="hero-backdrop-stars" />
      <div className="hero-backdrop-fade" />
    </div>
  );
};
