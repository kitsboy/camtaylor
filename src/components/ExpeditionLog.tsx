import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Mountain } from 'lucide-react';
import { EXPEDITION_LOG, ALTITUDE_LABELS } from '../data/expeditionLog';

const ALTITUDE_ICONS: Record<string, string> = {
  base: '◆',
  mid: '◆◆',
  summit: '▲',
  descent: '▼',
};

export const ExpeditionLog: React.FC = () => {
  return (
    <section className="expedition-section" id="expeditions">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">EXPEDITION LOG</h2>
        <p className="section-subtitle">
          Real routes. Real terrain. Not résumé bullets — journal entries from the field.
        </p>
      </div>

      <div className="expedition-timeline">
        {EXPEDITION_LOG.map((entry, idx) => (
          <motion.article
            key={entry.id}
            className="expedition-entry"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.08, duration: 0.45 }}
          >
            <div className="expedition-rail">
              <span className="expedition-flag" aria-hidden="true">
                <Flag size={12} />
              </span>
              {idx < EXPEDITION_LOG.length - 1 && <span className="expedition-line" />}
            </div>

            <div className="expedition-card glass-depth-2">
              <div className="expedition-meta">
                <time dateTime={entry.date}>{entry.date}</time>
                <span className="expedition-terrain">{entry.terrain}</span>
                <span className={`expedition-altitude altitude-${entry.altitude}`}>
                  <Mountain size={11} />
                  {ALTITUDE_LABELS[entry.altitude]}
                  <span className="expedition-alt-icon">{ALTITUDE_ICONS[entry.altitude]}</span>
                </span>
              </div>
              <h3 className="expedition-title">{entry.title}</h3>
              <p className="expedition-outcome">{entry.outcome}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};