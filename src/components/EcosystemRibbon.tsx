import React from 'react';
import { ECOSYSTEM_LINKS } from '../data/ventures';

export const EcosystemRibbon: React.FC = () => {
  return (
    <div className="ecosystem-ribbon">
      <p className="ecosystem-ribbon-label">Give A Bit constellation</p>
      <div className="ecosystem-scroll-wrap">
      <div className="ecosystem-ribbon-links">
        {ECOSYSTEM_LINKS.map((v) => (
          <a
            key={v.id}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ecosystem-chip"
          >
            {v.name}
          </a>
        ))}
      </div>
      </div>
    </div>
  );
};