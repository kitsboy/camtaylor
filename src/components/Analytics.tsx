import React, { useEffect } from 'react';
import { IS_PRIVATE_PREVIEW, PLAUSIBLE_DOMAIN, UMAMI_WEBSITE_ID } from '../data/site';

export const Analytics: React.FC = () => {
  useEffect(() => {
    if (IS_PRIVATE_PREVIEW || (!PLAUSIBLE_DOMAIN && !UMAMI_WEBSITE_ID)) return;

    const script = document.createElement('script');
    script.defer = true;
    if (PLAUSIBLE_DOMAIN) {
      script.dataset.domain = PLAUSIBLE_DOMAIN;
      script.src = 'https://plausible.io/js/script.js';
    } else if (UMAMI_WEBSITE_ID) {
      script.dataset.websiteId = UMAMI_WEBSITE_ID;
      script.src = 'https://analytics.giveabit.io/script.js';
    } else {
      return;
    }

    document.head.appendChild(script);
    return () => script.remove();
  }, []);

  return null;
};
