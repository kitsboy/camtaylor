import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Activity } from 'lucide-react';

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 80, damping: 15 }
    },
  };

  return (
    <section className="hero-section" id="hero">
      <div className="glow-orb" />
      <div className="glow-orb-cyan" />
      
      <motion.div 
        className="hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-badge-container" variants={itemVariants}>
          <div className="hero-badge">
            <Activity className="badge-icon pulse" size={12} />
            <span>AGENT PROFILE LOADED</span>
          </div>
        </motion.div>

        <motion.h1 className="hero-title" variants={itemVariants}>
          <span className="title-subtle">CAMERON TAYLOR</span>
          <br />
          <span className="title-bold text-gradient">VALUE AGENT</span>
        </motion.h1>

        <motion.p className="hero-description" variants={itemVariants}>
          We don't broker transactions. We orchestrate leverage, structure high-yield ventures, and align the capital stack. Strategically active in tech assets, special situations, and bespoke deal mechanics.
        </motion.p>

        <motion.div className="hero-actions" variants={itemVariants}>
          <button 
            onClick={() => {
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary"
          >
            <span>Explore Capabilities</span>
            <ArrowRight size={16} />
          </button>
          
          <button onClick={onOpenTerminal} className="btn-secondary">
            <Cpu size={16} />
            <span>Launch Command Deck</span>
          </button>
        </motion.div>

        <motion.div className="hero-metrics" variants={itemVariants}>
          <div className="metric-item">
            <span className="metric-label">Status</span>
            <span className="metric-value">Active Brokerage</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-label">Core Target</span>
            <span className="metric-value">Maximal Leverage</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-label">Jurisdiction</span>
            <span className="metric-value">camtaylor.ca</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
