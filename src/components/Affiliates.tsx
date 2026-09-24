import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Wrench } from 'lucide-react';
import {
  AFFILIATE_TOOLS,
  AFFILIATE_INTRO,
  AFFILIATE_DISCLOSURE,
  AFFILIATE_LAST_REVIEWED,
} from '../data/affiliates';

export const Affiliates: React.FC = () => {
  if (AFFILIATE_TOOLS.length === 0) return null;

  return (
    <section className="kit-section" id="kit" aria-labelledby="kit-title">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header kit-header">
        <p className="section-kicker">TRAIL KIT / HUMBLE SUGGESTIONS</p>
        <h2 className="section-title" id="kit-title">
          Tools I actually use
        </h2>
        <p className="section-subtitle">{AFFILIATE_INTRO}</p>
      </div>

      <p className="kit-count" aria-live="polite">
        {AFFILIATE_TOOLS.length} {AFFILIATE_TOOLS.length === 1 ? 'tool' : 'tools'} · reviewed {AFFILIATE_LAST_REVIEWED}
      </p>

      <div className="kit-grid">
        {AFFILIATE_TOOLS.map((tool, index) => (
          <motion.a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="kit-card"
            style={{ '--kit-color': tool.color, '--kit-ink': tool.ink } as React.CSSProperties}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <div className="kit-card-top">
              <span className="kit-mark" aria-hidden="true">
                {tool.name.slice(0, 1)}
              </span>
              <span className="kit-chip">{tool.label}</span>
            </div>

            <h3 className="kit-name">{tool.name}</h3>
            <p className="kit-tagline">{tool.tagline}</p>
            <p className="kit-note">{tool.note}</p>

            <span className="kit-foot">
              <span className="kit-open">
                Open link
                <ArrowUpRight size={14} aria-hidden="true" />
              </span>
              <span className={`kit-flag ${tool.referral ? 'kit-flag--ref' : ''}`}>
                {tool.referral ? 'Referral' : 'Direct'}
              </span>
            </span>
          </motion.a>
        ))}
      </div>

      <p className="kit-disclosure">
        <Wrench size={12} aria-hidden="true" /> {AFFILIATE_DISCLOSURE}
      </p>
    </section>
  );
};
