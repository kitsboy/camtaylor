import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
   * This pill and the route bar's Connect item are the same door. Both are right
   * on their own; both lit at once is the page shouting the same thing twice.
   * Publishing which one is on screen lets the stylesheet keep exactly one of
   * them lit — the same mechanism `data-theme` and `data-reduced-motion` use to
   * carry state that several components need.
   */
  useEffect(() => {
    document.documentElement.dataset.cta = hidden ? 'bar' : 'pill';
    return () => {
      document.documentElement.removeAttribute('data-cta');
    };
  }, [hidden]);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`sticky-cta ${hidden ? 'sticky-cta--hidden' : ''}`}>
      <button type="button" onClick={scrollToContact} className="sticky-cta-btn">
        <span>Start a conversation</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};