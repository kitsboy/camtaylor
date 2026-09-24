import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { FAMILY_OFFERINGS } from '../data/family';

export const Family: React.FC = () => {
  const [selectedTone, setSelectedTone] = useState('all');
  const tones = useMemo(() => ['all', ...new Set(FAMILY_OFFERINGS.map((offering) => offering.tone))], []);
  const offerings = selectedTone === 'all' ? FAMILY_OFFERINGS : FAMILY_OFFERINGS.filter((offering) => offering.tone === selectedTone);

  return (
  <section className="family-section" id="family">
    <div className="section-divider section-divider--topo" aria-hidden="true" />
    <div className="section-header family-header">
      <p className="section-kicker">THE CONSTELLATION</p>
      <h2 className="section-title">The Give A Bit family</h2>
      <p className="section-subtitle">One mission, many useful tools. Each project stands on its own — together they return control to the people using them.</p>
    </div>
    <div className="family-filters" role="group" aria-label="Filter family offerings">
      {tones.map((tone) => <button key={tone} type="button" className={selectedTone === tone ? 'family-filter family-filter--active' : 'family-filter'} onClick={() => setSelectedTone(tone)} aria-pressed={selectedTone === tone}>{tone === 'all' ? 'All routes' : tone}</button>)}
    </div>
    <p className="family-count" aria-live="polite">Showing {offerings.length} of {FAMILY_OFFERINGS.length} routes</p>
    <div className={`family-grid ${selectedTone !== 'all' ? 'family-grid--spotlight' : ''}`} aria-live="polite">
      {offerings.map((offering, index) => (
        <motion.a
          key={offering.id}
          href={offering.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`family-card family-card--${offering.tone} ${selectedTone !== 'all' ? 'family-card--focused' : ''}`}
          style={{ '--family-color': offering.color } as React.CSSProperties}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ delay: index * 0.04, duration: 0.4 }}
        >
          <div className="family-card-top">
            <span className="family-card-index">0{index + 1}</span>
            <span className="family-card-label"><Compass size={11} /> {offering.label}</span>
          </div>
          <h3>{offering.name}</h3>
          <p>{offering.value}</p>
          <span className="family-visit">Visit <ArrowUpRight size={14} /></span>
          <span className="family-tooltip" role="tooltip">Open {offering.name} ↗</span>
        </motion.a>
      ))}
    </div>
  </section>
  );
};
