import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, TrendingUp } from 'lucide-react';

export const Manifesto: React.FC = () => {
  const axioms = [
    {
      number: '01',
      icon: <Sparkles className="axiom-icon" size={24} />,
      title: 'Value is Asymmetric',
      description: 'The greatest yield comes from finding information asymmetries, optimizing risk structures, and executing where others see complexity.'
    },
    {
      number: '02',
      icon: <Shield className="axiom-icon" size={24} />,
      title: 'Structural Architecture Over Effort',
      description: 'A well-designed transaction structure will produce 10x the returns of brute force execution. Leverage, syntax, and jurisdiction matter.'
    },
    {
      number: '03',
      icon: <TrendingUp className="axiom-icon" size={24} />,
      title: 'Infinite Horizon Alignment',
      description: 'True value agent operations align interests long-term. We structure deals where all partners win on the upside, compounding capital.'
    }
  ];

  return (
    <section className="manifesto-section" id="manifesto">
      <div className="section-header">
        <h2 className="section-title text-gradient">THE VALUE MANIFESTO</h2>
        <p className="section-subtitle">The foundational principles that guide every transaction and investment.</p>
      </div>

      <div className="axioms-grid">
        {axioms.map((axiom, idx) => (
          <motion.div 
            key={idx}
            className="axiom-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ type: 'spring', stiffness: 50, delay: idx * 0.15 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <div className="axiom-num">{axiom.number}</div>
            <div className="axiom-icon-wrapper">{axiom.icon}</div>
            <h3 className="axiom-title">{axiom.title}</h3>
            <p className="axiom-description">{axiom.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="manifesto-quote-wrapper"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="manifesto-quote-border" />
        <blockquote className="manifesto-quote">
          "The role of the Value Agent is not simply to facilitate, but to reveal, create, and capture structural alpha in complex environments."
        </blockquote>
        <cite className="manifesto-cite">— Cameron Taylor</cite>
      </motion.div>
    </section>
  );
};
