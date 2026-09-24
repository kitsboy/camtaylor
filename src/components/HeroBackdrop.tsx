import React from 'react';

export const HeroBackdrop: React.FC = () => (
  <div className="hero-backdrop-wrap" aria-hidden="true">
    <div className="hero-backdrop-aurora" />
    <div className="hero-backdrop-contours" />
    <div className="hero-backdrop-stars" />
    <div className="hero-backdrop-fade" />
  </div>
);
