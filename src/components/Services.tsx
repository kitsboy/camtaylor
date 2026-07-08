import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Briefcase, Zap, Flame } from 'lucide-react';
import { SERVICES } from '../data/services';
import { AntiServices } from './AntiServices';

const ICONS = [Layers, Briefcase, Zap, Flame] as const;

export const Services: React.FC = () => {
  return (
    <section className="services-section" id="services">
      <div className="section-divider section-divider--topo" aria-hidden="true" />
      <div className="section-header">
        <h2 className="section-title text-gradient">AREAS OF EXPERTISE</h2>
        <p className="section-subtitle">
          A multi-disciplinary approach to engineering digital and financial alpha.
        </p>
      </div>

      <div className="services-grid">
        {SERVICES.map((service, idx) => {
          const Icon = ICONS[idx];
          return (
            <motion.div
              key={service.id}
              className="service-card glass-depth-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="service-icon-container">
                <Icon size={28} />
              </div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>

              <div className="service-features">
                {service.features.map((feat) => (
                  <span key={feat} className="service-feature-tag">
                    {feat}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AntiServices />
    </section>
  );
};