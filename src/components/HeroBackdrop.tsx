import React from 'react';

export const HeroBackdrop: React.FC = () => {
  return (
    <div className="hero-backdrop-wrap" aria-hidden="true">
      <div className="hero-backdrop-motion" />
      <div className="hero-backdrop-shimmer" />
      <div className="hero-backdrop-fade" />
    </div>
  );
};