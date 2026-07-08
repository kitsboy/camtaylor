import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Film } from 'lucide-react';
import { SITE } from '../data/site';

export const HeroVideo: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const thumbUrl = `https://i.ytimg.com/vi/${SITE.heroVideoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${SITE.heroVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  const startPlay = () => {
    setPlaying(true);
  };

  return (
    <motion.div
      className="hero-video-wrap"
      initial={{ opacity: 0, x: 28, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 70, damping: 16, delay: 0.25 }}
    >
      <div className="hero-video-frame-outer">
        <div className="hero-video-corner hero-video-corner--tl" aria-hidden="true" />
        <div className="hero-video-corner hero-video-corner--tr" aria-hidden="true" />
        <div className="hero-video-corner hero-video-corner--bl" aria-hidden="true" />
        <div className="hero-video-corner hero-video-corner--br" aria-hidden="true" />

        <div ref={frameRef} className="hero-video-frame">
          <div className="hero-video-header">
            <Film size={13} />
            <span>{SITE.heroVideoLabel}</span>
            <span className="hero-video-live">TEMP</span>
          </div>

          <div className="hero-video-viewport">
            {playing ? (
              <iframe
                src={embedUrl}
                title={`${SITE.name} — ${SITE.heroVideoLabel}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="hero-video-iframe"
              />
            ) : (
              <button
                type="button"
                className="hero-video-poster"
                onClick={startPlay}
                aria-label={`Play ${SITE.heroVideoLabel}`}
              >
                <img
                  src={thumbUrl}
                  alt=""
                  className="hero-video-thumb"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
                <span className="hero-video-play-ring" aria-hidden="true">
                  <span className="hero-video-play-btn">
                    <Play size={22} fill="currentColor" />
                  </span>
                </span>
                <span className="hero-video-shine" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};