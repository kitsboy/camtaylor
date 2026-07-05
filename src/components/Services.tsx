import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Briefcase, Zap, Flame } from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      icon: <Layers size={28} />,
      title: 'Deal Architecture',
      description: 'Engineering high-leverage transaction structures, joint ventures, and capital allocation frameworks designed for asymmetric returns.',
      features: ['Arbitrage Mapping', 'Jurisdictional Optimization', 'Risk Structuring']
    },
    {
      icon: <Briefcase size={28} />,
      title: 'Capital Syndication',
      description: 'Orchestrating private deal flow, venture investments, and connecting strategic resources with high-conviction founders.',
      features: ['Private Placements', 'LP Syndicate Management', 'Growth Capital Alignments']
    },
    {
      icon: <Zap size={28} />,
      title: 'Venture Operations',
      description: 'Hands-on scaling, tech architecture, and operational excellence for digital assets and modern web projects.',
      features: ['AI Systems Integration', 'Token Economics Design', 'Product Launch Runbooks']
    },
    {
      icon: <Flame size={28} />,
      title: 'Special Situations',
      description: 'Navigating complex restructurings, digital asset buyouts, and resolving distressed technical or corporate dependencies.',
      features: ['IP Reclamation', 'Technical Auditing', 'Arbitrage Exploitation']
    }
  ];

  return (
    <section className="services-section" id="services">
      <div className="section-header">
        <h2 className="section-title text-gradient">AREAS OF EXPERTISE</h2>
        <p className="section-subtitle">A multi-disciplinary approach to engineering digital and financial alpha.</p>
      </div>

      <div className="services-grid">
        {services.map((service, idx) => (
          <motion.div 
            key={idx}
            className="service-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ 
              scale: 1.02,
              borderColor: 'rgba(197, 160, 89, 0.4)',
              boxShadow: '0 10px 30px rgba(197, 160, 89, 0.05)',
            }}
          >
            <div className="service-icon-container">
              {service.icon}
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            
            <div className="service-features">
              {service.features.map((feat, fidx) => (
                <span key={fidx} className="service-feature-tag">
                  {feat}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
