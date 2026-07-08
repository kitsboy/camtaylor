import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cpu, Activity, Route } from 'lucide-react';
import { SITE, HERO_METRICS } from '../data/site';
import { HeroVideo } from './HeroVideo';
import { useCountUp } from '../hooks/useCountUp';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [metricsVisible, setMetricsVisible] = useState(false);
  const metricsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const expeditions = useCountUp(HERO_METRICS[0].value, metricsVisible);

  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setMetricsVisible(true); },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 90, damping: 18 },
    },
  };

  return (
    <section className="hero-section" id="hero" ref={sectionRef}>
      <div className="glow-orb" />
      <div className="glow-orb-cyan" />

      <motion.div
        className="hero-shell glass-depth-3"
        style={{ y: parallaxY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-badge-container" variants={itemVariants}>
          <div className="hero-badge">
            <Activity className="badge-icon pulse" size={11} />
            <span>ACCEPTING NEW EXPEDITIONS</span>
          </div>
        </motion.div>

        <motion.p className="hero-route-status" variants={itemVariants}>
          <Route size={13} />
          <span>{SITE.currentRoute}</span>
        </motion.p>

        <div className="hero-grid">
          <motion.div className="hero-copy" variants={itemVariants}>
            <h1 className="hero-title">
              <span className="title-name">{SITE.name}</span>
              <span className="title-role text-gradient">{SITE.title}.</span>
              <span className="title-tagline">&ldquo;{SITE.tagline}&rdquo;</span>
            </h1>
          </motion.div>

          <HeroVideo />
        </div>

        <motion.p className="hero-description" variants={itemVariants}>
          Guiding founders, capital, and companies through the most demanding terrain.
          From base camp to summit — deal architecture, venture operations, and the long descent home.
        </motion.p>

        <motion.div className="hero-actions" variants={itemVariants}>
          <button
            onClick={() => {
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary"
          >
            <span>See the Route</span>
            <ArrowRight size={15} />
          </button>

          <button onClick={onOpenTerminal} className="btn-secondary">
            <Cpu size={14} />
            <span>Command Deck</span>
          </button>

          <Link to="/field-guide" className="btn-secondary btn-ghost">
            Field Guide
          </Link>
        </motion.div>

        <motion.div className="hero-metrics" variants={itemVariants} ref={metricsRef}>
          <div className="metric-item">
            <span className="metric-label">{HERO_METRICS[0].label}</span>
            <span className="metric-value metric-value--count">
              {metricsVisible ? `${expeditions}${HERO_METRICS[0].suffix}` : HERO_METRICS[0].display}
            </span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-label">{HERO_METRICS[1].label}</span>
            <span className="metric-value">{HERO_METRICS[1].display}</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-label">{HERO_METRICS[2].label}</span>
            <span className="metric-value">{HERO_METRICS[2].display}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};