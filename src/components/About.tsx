import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import { SITE } from '../data/site';
import { NostrIdentities } from './NostrIdentities';

export const About: React.FC = () => {
  return (
    <section className="about-section" id="about">
      <div className="section-divider" aria-hidden="true" />
      <div className="about-container">
        <motion.div
          className="about-visual"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/cam-profile.jpg"
            alt={SITE.name}
            className="about-photo"
            width={160}
            height={160}
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="about-eyebrow">About</p>
          <h2 className="about-title">
            {SITE.name} — <span className="text-gradient">{SITE.title}</span>
          </h2>
          <p className="about-bio">{SITE.bio}</p>

          <div className="about-meta">
            <div className="about-meta-item">
              <MapPin size={15} aria-hidden="true" />
              <span>{SITE.location}</span>
            </div>
            <div className="about-meta-item">
              <Clock size={15} aria-hidden="true" />
              <span>{SITE.timezone}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <NostrIdentities />
    </section>
  );
};