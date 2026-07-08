import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';
import { ScrollFade } from './ScrollFade';

export const Testimonials: React.FC = () => {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">SUMMIT JOURNAL</h2>
        <p className="section-subtitle">Notes from founders and partners on the route.</p>
      </div>

      <div className="testimonials-scroll-wrap">
        <ScrollFade />
        <div className="testimonials-grid">
        {TESTIMONIALS.map((t, idx) => (
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
      </div>
    </section>
  );
};