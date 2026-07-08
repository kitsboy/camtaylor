import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Shield, TrendingUp } from 'lucide-react';
import { AXIOMS, MANIFESTO_QUOTE } from '../data/axioms';
import { SITE } from '../data/site';

const ICONS = [Compass, Shield, TrendingUp] as const;

export const Manifesto: React.FC = () => {
  return (
    <section className="manifesto-section" id="manifesto">
      <div className="section-divider" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">THE SHERPA PHILOSOPHY</h2>
        <p className="section-subtitle">Three principles. One compass. Every expedition.</p>
      </div>

      <div className="axioms-grid">
        {AXIOMS.map((axiom, idx) => {
          const Icon = ICONS[idx];
          return (
            <motion.div
              key={axiom.id}
              className="axiom-card glass-depth-2"
              initial={{ opacity: 0, y: 32, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 60, delay: idx * 0.12 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="axiom-flag"
                initial={{ scale: 0, rotate: -20 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: idx * 0.12 + 0.2 }}
              >
                🚩
              </motion.div>
              <div className="axiom-num">{axiom.number}</div>
              <div className="axiom-icon-wrapper">
                <Icon className="axiom-icon" size={20} />
              </div>
              <h3 className="axiom-title">{axiom.title}</h3>
              <p className="axiom-description">{axiom.description}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="manifesto-quote-wrapper"
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="manifesto-quote-border" />
        <blockquote className="manifesto-quote">&ldquo;{MANIFESTO_QUOTE}&rdquo;</blockquote>
        <cite className="manifesto-cite">— {SITE.name}</cite>
      </motion.div>
    </section>
  );
};