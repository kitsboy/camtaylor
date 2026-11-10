import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Building2, Activity, MapPin, ChevronDown } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';
import { VENTURES } from '../data/ventures';
import { ScrollFade } from './ScrollFade';

// A verifiable proof strip, computed from the live ventures data so it can never
// drift from what the Ventures section actually shows. "Proof before promise" —
// the numbers are real, not vibes.
const liveCount = VENTURES.filter((v) => v.status === 'live').length;
const totalCount = VENTURES.length;
const markets = new Set(VENTURES.map((v) => v.tag)).size;

/**
 * The three quotes fold behind one honest control. The proof strip (the number
 * the reader actually lands on) always stays open; the quotes themselves are
 * secondary colour, so a reader who wants them taps and gets the same three — no
 * content lost, just not all rendered at full height on first paint.
 */
export const Testimonials: React.FC = () => {
  const [open, setOpen] = useState(false);
  const shown = open ? TESTIMONIALS : TESTIMONIALS.slice(0, 1);

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">SUMMIT JOURNAL</h2>
        <p className="section-subtitle">Notes from founders and partners on the route.</p>
      </div>

      <div className="proof-strip" aria-label="Proof by the numbers">
        <div className="proof-stat">
          <Building2 size={16} aria-hidden="true" />
          <strong>{totalCount}</strong>
          <span>ventures built</span>
        </div>
        <div className="proof-stat">
          <Activity size={16} aria-hidden="true" />
          <strong>{liveCount}</strong>
          <span>live today</span>
        </div>
        <div className="proof-stat">
          <MapPin size={16} aria-hidden="true" />
          <strong>{markets}</strong>
          <span>markets</span>
        </div>
      </div>

      <div className="testimonials-scroll-wrap">
        <ScrollFade />
        <div className={`testimonials-grid${open ? ' testimonials-grid--open' : ''}`}>
          {shown.map((t, idx) => (
            <motion.blockquote
              key={t.id}
              className="testimonial-card glass-depth-1"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Quote className="testimonial-quote-icon" size={20} />
              <p className="testimonial-text">&ldquo;{t.quote}&rdquo;</p>
              <footer className="testimonial-footer">
                <cite className="testimonial-author">{t.author}</cite>
                <span className="testimonial-role">
                  {t.role}
                  {t.venture ? ` · ${t.venture}` : ''}
                </span>
              </footer>
            </motion.blockquote>
          ))}
        </div>
        <button
          type="button"
          className={`journal-toggle${open ? ' journal-toggle--open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <ChevronDown size={14} aria-hidden="true" />
          {open ? 'A quieter route' : `${TESTIMONIALS.length - shown.length} more notes · tap to read`}
        </button>
      </div>
    </section>
  );
};
