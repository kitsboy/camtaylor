import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe,
  ArrowUpRight,
  Award,
  Zap,
  Code,
  ShieldAlert,
  ShoppingBag,
  Map,
  TrendingUp,
} from 'lucide-react';
import { VENTURES, VENTURE_STATUS_LABELS, type VentureStatus } from '../data/ventures';
import { VentureLiveDot } from './VentureLiveDot';

const ICONS = [Award, Code, Globe, Zap, ShieldAlert, Map, ShoppingBag] as const;

const FILTERS: Array<{ id: 'all' | VentureStatus; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'building', label: 'Building' },
  { id: 'syndicating', label: 'Syndicating' },
  { id: 'stealth', label: 'Stealth' },
];

function AltitudeMeter({ value }: { value: number }) {
  return (
    <div className="altitude-meter" title={`Altitude: ${value}%`}>
      <div className="altitude-meter-track">
        <motion.div
          className="altitude-meter-fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </div>
      <span className="altitude-meter-label">{value}%</span>
    </div>
  );
}

/**
 * Ventures used to be a horizontal carousel with an inline case-study modal.
 * The full case file now lives on its own route page (`/route/:id`), so the
 * homepage keeps a compact, static grid whose cards open that page — same
 * information, one less layer of JavaScript, and a shorter section. A static
 * grid is never parked off a horizontal viewport, so the reveal cascade can
 * never strand a card the way the old carousel did.
 */
export const Ventures: React.FC = () => {
  const [filter, setFilter] = useState<'all' | VentureStatus>('all');

  const filtered = filter === 'all' ? VENTURES : VENTURES.filter((v) => v.status === filter);

  return (
    <section className="ventures-section" id="ventures">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">ACTIVE VENTURES</h2>
        <p className="section-subtitle">
          Companies, protocols, and platforms engineered or backed. Each card opens its route file — the case
          study, live reachability, and provenance.
        </p>
      </div>

      <div className="venture-filters" role="group" aria-label="Filter ventures by status">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`venture-filter-btn ${filter === f.id ? 'venture-filter-btn--active' : ''}`}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ventures-scroll-wrap">
        <motion.div
          className="ventures-slider"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((vent) => {
            const Icon = ICONS[VENTURES.indexOf(vent)] ?? Globe;
            return (
              <motion.div
                key={vent.id}
                className="venture-card glass-depth-2"
                data-accent={vent.accent ? '' : undefined}
                style={vent.accent ? { '--venture-accent': vent.accent } as React.CSSProperties : undefined}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
                }}
                whileHover={{ y: -4 }}
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
                    <VentureLiveDot url={vent.url} />
                    <span className="venture-tag">{vent.tag}</span>
                    {vent.needsTalent && (
                      <span className="venture-talent-badge">Hiring</span>
                    )}
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
                  <Link to={`/route/${vent.id}`} className="venture-case-btn">
                    <TrendingUp size={13} />
                    Route file
                  </Link>
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
        </motion.div>
      </div>
    </section>
  );
};
