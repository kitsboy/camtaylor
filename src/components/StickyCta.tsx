import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { SITE } from '../data/site';
import { useScrollDirection } from '../hooks/useScrollDirection';

export const StickyCta: React.FC = () => {
  const [contactVisible, setContactVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const direction = useScrollDirection();

  useEffect(() => {
    const contact = document.getElementById('contact');
    const footer = document.querySelector('.footer');

    const contactObs = contact
      ? new IntersectionObserver(([e]) => setContactVisible(e.isIntersecting), { threshold: 0.2 })
      : null;
    const footerObs = footer
      ? new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting), { threshold: 0.1 })
      : null;

    if (contact) contactObs?.observe(contact);
    if (footer) footerObs?.observe(footer);

    return () => {
      contactObs?.disconnect();
      footerObs?.disconnect();
    };
  }, []);

  const hidden = contactVisible || footerVisible || direction === 'down';

  /**
   * The pill opens Calendly. The phone quick-nav Connect item still scrolls to
   * the form. Publishing which one is on screen lets the stylesheet keep exactly
   * one of them lit — the same mechanism `data-theme` and `data-reduced-motion`
   * use to carry state that several components need.
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
