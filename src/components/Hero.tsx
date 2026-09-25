import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cpu, Activity, Orbit, ShieldCheck, MapPin } from 'lucide-react';
import { SITE, HERO_SIGNALS } from '../data/site';
import { HeroVideo } from './HeroVideo';
import { RouteStatusRotator } from './RouteStatusRotator';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 40]);

  useEffect(() => {
    const el = metricsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(() => undefined, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /**
   * The phone hero re-orders nine children with CSS `order`, but a stagger walks
   * DOM order — so on a phone the cascade runs in a sequence the eye cannot
   * follow, and at 0.12s the primary button lands at 0.8s and the metrics at
   * 0.96s, a second after the screen that exists to show that button. Halving it
   * on phones keeps the whole entrance inside 0.5s, where the mismatch reads as
   * one cascade instead of a queue. Read once at mount, like the variants.
   */
  const stagger = !reduced && typeof window !== 'undefined'
    && window.matchMedia('(max-width: 768px)').matches ? 0.05 : 0.12;

  const containerVariants = reduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: stagger } } };

  const itemVariants = reduced
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: 'spring' as const, stiffness: 90, damping: 18 },
        },
      };

  return (
    <section className="hero-section" id="hero" ref={sectionRef}>
      {/* Two soft tints that run off the edge on purpose. They are clipped by
          this layer rather than by `body { overflow-x: hidden }`: clipping them
          where they are drawn bounds the bleed, so the document cannot end up
          wider than the viewport with nothing left to notice it. */}
      <div className="glow-field" aria-hidden="true">
        <div className="glow-orb" />
        <div className="glow-orb-cyan" />
      </div>

      <motion.div
        className="hero-shell glass-depth-3"
        style={{ y: parallaxY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-card-meta" variants={itemVariants}>
          <span><MapPin size={12} /> BRITISH COLUMBIA / PT</span>
          <span><ShieldCheck size={12} /> PROOF-FIRST PRACTICE</span>
        </motion.div>

        <motion.div className="hero-badge-container" variants={itemVariants}>
          <div className="hero-badge">
            <span className="badge-icon pulse" aria-hidden="true">●</span>
            <span>{HERO_SIGNALS.badge}</span>
          </div>
        </motion.div>

        <motion.div className="hero-route-wrap" variants={itemVariants}>
          <RouteStatusRotator />
        </motion.div>

        <div className="hero-grid">
          <motion.div className="hero-copy" variants={itemVariants}>
            <h1 className="hero-title">
              <span className="title-name">{SITE.name}</span>
              <span className="title-role text-gradient">{SITE.title}.</span>
              <span className="title-tagline">&ldquo;{SITE.tagline}&rdquo;</span>
            </h1>
          </motion.div>

          <HeroVideo />
        </div>          <motion.div className="hero-intelligence-strip" variants={itemVariants} aria-label="Route intelligence">
            <div className="intelligence-label"><Activity size={13} /> {HERO_SIGNALS.intelligenceLabel}</div>
            <div className="intelligence-bars" aria-hidden="true">
              {[42, 68, 54, 82, 71, 94, 78, 100, 88, 96, 84, 100].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="intelligence-value"><Orbit size={13} /> {HERO_SIGNALS.intelligenceValue}</div>
          </motion.div>

          <motion.p className="hero-description" variants={itemVariants}>
          <strong className="hero-lead">Guiding founders, capital, and companies through demanding terrain.</strong>{' '}
          Deal architecture, capital syndication, and venture operations.
        </motion.p>

        <motion.div className="hero-actions" variants={itemVariants}>
          <button
            onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
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
          {HERO_SIGNALS.metrics.map((metric, idx) => (
            <React.Fragment key={metric.label}>
              {idx > 0 && <div className="metric-divider" />}
              <div className="metric-item">
                <span className="metric-label">{metric.label}</span>
                <span className="metric-value">
                  {metric.display}
                </span>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};