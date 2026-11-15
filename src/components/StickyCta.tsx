import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SITE } from '../data/site';
import { useScrollDirection } from '../hooks/useScrollDirection';

export const StickyCta: React.FC = () => {
  const [contactVisible, setContactVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  // The hero book button is in the first screen. Start true so the pill does
  // not flash before the observer runs.
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  const direction = useScrollDirection();

  useEffect(() => {
    const contact = document.getElementById('contact');
    const footer = document.querySelector('.footer');
    const heroCta = document.querySelector('.hero-actions .btn-primary');

    const contactObs = contact
      ? new IntersectionObserver(([e]) => setContactVisible(e.isIntersecting), { threshold: 0.2 })
      : null;
    const footerObs = footer
      ? new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { threshold: 0.1 })
      : null;
    const heroObs = heroCta
      ? new IntersectionObserver(([e]) => setHeroCtaVisible(e.isIntersecting), { threshold: 0.15 })
      : null;

    if (contact) contactObs?.observe(contact);
    if (footer) footerObs?.observe(footer);
    if (heroCta) heroObs?.observe(heroCta);

    return () => {
      contactObs?.disconnect();
      footerObs?.disconnect();
      heroObs?.disconnect();
    };
  }, []);

  const hidden = contactVisible || footerVisible || direction === 'down' || heroCtaVisible;

  /**
   * The pill opens Calendly. It stays off while the hero book button is on
   * screen, and it comes back when that button has left and the reader scrolls
   * up. The phone Connect bar still scrolls to the form. Publishing which one
   * is on screen lets the stylesheet keep exactly one of them lit — the same
   * mechanism `data-theme` and `data-reduced-motion` use to carry state that
   * several components need.
   */
  useEffect(() => {
    document.documentElement.dataset.cta = hidden ? 'bar' : 'pill';
    return () => {
      document.documentElement.removeAttribute('data-cta');
    };
  }, [hidden]);

  return (
    <div className={`sticky-cta ${hidden ? 'sticky-cta--hidden' : ''}`}>
      <a
        href={SITE.calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-cta-btn"
      >
        <span>Book a route check</span>
        <ArrowRight size={16} />
      </a>
    </div>
  );
};
