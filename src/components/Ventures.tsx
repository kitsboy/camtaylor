import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowUpRight, Award, Zap, Code, ShieldAlert, ShoppingBag, Map } from 'lucide-react';

interface Venture {
  name: string;
  role: string;
  desc: string;
  tag: string;
  icon: React.ReactNode;
  url?: string;
}

export const Ventures: React.FC = () => {
  const ventures: Venture[] = [
    {
      name: 'Satohash',
      role: 'Co-Founder & Deal Architect',
      desc: 'High-performance Bitcoin infrastructure, decentralized nodes, and yield orchestration layers.',
      tag: 'Crypto Infrastructure',
      icon: <Award className="vent-icon text-gold" size={20} />,
    },
    {
      name: 'Katoa',
      role: 'Principal Agent',
      desc: 'Bespoke software architecture, product development pipelines, and elite systems engineering.',
      tag: 'Engineering',
      icon: <Code className="vent-icon" size={20} />,
    },
    {
      name: 'GiveABit',
      role: 'Sponsor & Architect',
      desc: 'A modern, high-transparency micro-donation platform engineering asymmetric social impact.',
      tag: 'Social Yield',
      icon: <Globe className="vent-icon" size={20} />,
      url: 'https://giveabit.io'
    },
    {
      name: 'OpenStrata',
      role: 'Venture Architect',
      desc: 'Decentralized strata management, property asset coordination, and automated legal pipelines.',
      tag: 'PropTech',
      icon: <Zap className="vent-icon" size={20} />,
    },
    {
      name: 'Motopass',
      role: 'Strategic Investor',
      desc: 'Secured digital vehicle passport registry tracking ownership chain, specs, and maintenance history.',
      tag: 'AutoTech',
      icon: <ShieldAlert className="vent-icon" size={20} />,
    },
    {
      name: 'Sherpacarta',
      role: 'Technical Advisor',
      desc: 'Advanced geo-routing, expedition mapping and customized topographic coordination stacks.',
      tag: 'MapTech',
      icon: <Map className="vent-icon" size={20} />,
    },
    {
      name: 'Tadbuy',
      role: 'Deal Sponsor',
      desc: 'Intelligent e-commerce purchasing rails optimizing retail arbitrage and volume procurement.',
      tag: 'E-Commerce',
      icon: <ShoppingBag className="vent-icon" size={20} />,
    }
  ];

  return (
    <section className="ventures-section" id="ventures">
      <div className="section-header">
        <h2 className="section-title text-gradient">ACTIVE VENTURES</h2>
        <p className="section-subtitle">A showcase of companies, protocols, and digital platforms engineered or backed.</p>
      </div>

      <div className="ventures-slider">
        {ventures.map((vent, idx) => (
          <motion.div 
            key={idx}
            className="venture-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -6, borderColor: 'rgba(197, 160, 89, 0.3)' }}
          >
            <div className="venture-card-header">
              <div className="venture-icon-wrapper">
                {vent.icon}
              </div>
              <span className="venture-tag">{vent.tag}</span>
            </div>
            
            <h3 className="venture-name">{vent.name}</h3>
            <p className="venture-role">{vent.role}</p>
            <p className="venture-desc">{vent.desc}</p>
            
            {vent.url && (
              <a 
                href={vent.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="venture-link-btn"
              >
                <span>Visit Platform</span>
                <ArrowUpRight size={14} />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
