import React from 'react';
import { motion } from 'framer-motion';
import { Ban } from 'lucide-react';
import { ANTI_SERVICES } from '../data/antiServices';

export const AntiServices: React.FC = () => {
  return (
    <div className="anti-services">
      <h3 className="anti-services-title">
        <Ban size={16} />
        What I don&apos;t do
      </h3>
      <ul className="anti-services-list">
        {ANTI_SERVICES.map((item, idx) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06 }}
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};