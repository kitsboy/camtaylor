import React, { useEffect } from 'react';
import { PLAUSIBLE_DOMAIN } from '../data/site';

export const Analytics: React.FC = () => {
  useEffect(() => {
    if (!PLAUSIBLE_DOMAIN) return;

    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = PLAUSIBLE_DOMAIN;
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
};