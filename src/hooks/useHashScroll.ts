import { useEffect } from 'react';

const VALID_HASHES = [
  'hero',
  'about',
  'expeditions',
  'manifesto',
  'services',
  'testimonials',
  'ventures',
  'contact',
] as const;

export function useHashScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const scrollToHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || !VALID_HASHES.includes(hash as (typeof VALID_HASHES)[number])) return;

      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      });
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, [enabled]);
}