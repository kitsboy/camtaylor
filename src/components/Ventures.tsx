import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  ArrowUpRight,
  Award,
  Zap,
  Code,
  ShieldAlert,
  ShoppingBag,
  Map,
  X,
  Users,
  TrendingUp,
} from 'lucide-react';
import { VENTURES, VENTURE_STATUS_LABELS, type Venture } from '../data/ventures';
import { ScrollFade } from './ScrollFade';

const ICONS = [Award, Code, Globe, Zap, ShieldAlert, Map, ShoppingBag] as const;

function AltitudeMeter({ value }: { value: number }) {
  return (
    <div className="altitude-meter" title={`Altitude: ${value}%`}>
      <div className="altitude-meter-track">
        <motion.div
          className="altitude-meter-fill"
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      <span className="altitude-meter-label">{value}%</span>
    </div>
  );
}

function VentureModal({ venture, onClose }: { venture: Venture; onClose: () => void }) {
  return (
    <motion.div
      className="venture-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="venture-modal glass-depth-3"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${venture.name} case study`}
      >
        <button type="button" className="venture-modal-close" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
        <p className="venture-modal-eyebrow">{venture.tag}</p>
        <h3 className="venture-modal-title">{venture.name}</h3>
        <p className="venture-modal-role">{venture.role}</p>

        <div className="venture-modal-slides">
          <div className="venture-slide">
            <span className="venture-slide-num">01</span>
            <h4>Problem</h4>
            <p>{venture.caseStudy.problem}</p>
          </div>
          <div className="venture-slide">
            <span className="venture-slide-num">02</span>
            <h4>Structure</h4>
            <p>{venture.caseStudy.structure}</p>
          </div>
          <div className="venture-slide">
            <span className="venture-slide-num">03</span>
            <h4>Outcome</h4>
            <p>{venture.caseStudy.outcome}</p>
          </div>
        </div>

        <div className="venture-modal-actions">
          <a href={venture.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Visit platform <ArrowUpRight size={14} />
          </a>
          {venture.needsTalent && (
            <a href="#contact" className="btn-secondary" onClick={onClose}>
              <Users size={14} /> Join expedition
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export const Ventures: React.FC = () => {
  const [activeVenture, setActiveVenture] = useState<Venture | null>(null);

  return (
    <section className="ventures-section" id="ventures">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">ACTIVE VENTURES</h2>
        <p className="section-subtitle">
          Companies, protocols, and platforms engineered or backed.
        </p>
      </div>

      <div className="ventures-scroll-wrap">
        <ScrollFade />
        <div className="ventures-slider">
        {VENTURES.map((vent, idx) => {
          const Icon = ICONS[idx];
          return (
            <motion.div
              key={vent.id}
              className="venture-card glass-depth-2"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <div className="venture-route-trace" aria-hidden="true" />

              <div className="venture-card-header">
                <div className="venture-icon-wrapper">
                  <Icon className={`vent-icon ${vent.id === 'satohash' ? 'text-gold' : ''}`} size={20} />
                </div>
                <div className="venture-badges">
                  <span className={`venture-status venture-status--${vent.status}`}>
                    {VENTURE_STATUS_LABELS[vent.status]}
                  </span>
                  <span className="venture-tag">{vent.tag}</span>
                </div>
              </div>

              <h3 className="venture-name">{vent.name}</h3>
              <p className="venture-role">{vent.role}</p>
              <p className="venture-desc">{vent.desc}</p>

              <AltitudeMeter value={vent.altitude} />

              {vent.stacks && (
                <div className="venture-stacks">
                  {vent.stacks.map((s) => (
                    <span key={s} className="venture-stack-tag">{s}</span>
                  ))}
                </div>
              )}

              <div className="venture-card-actions">
                <button
                  type="button"
                  className="venture-case-btn"
                  onClick={() => setActiveVenture(vent)}
                >
                  <TrendingUp size={13} />
                  Case study
                </button>
                <a
                  href={vent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="venture-link-btn"
                >
                  <span>Visit</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </motion.div>
          );
        })}
        </div>
      </div>

      <AnimatePresence>
        {activeVenture && (
          <VentureModal venture={activeVenture} onClose={() => setActiveVenture(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};