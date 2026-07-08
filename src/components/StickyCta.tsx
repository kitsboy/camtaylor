import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

export const StickyCta: React.FC = () => {
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById('contact');
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`sticky-cta ${contactVisible ? 'sticky-cta--hidden' : ''}`}>
      <button type="button" onClick={scrollToContact} className="sticky-cta-btn">
        <span>Start a conversation</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};