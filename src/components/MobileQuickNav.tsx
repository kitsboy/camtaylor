import React from 'react';
import { User, BookOpen, Briefcase, Rocket, MessageCircle, Map, Quote } from 'lucide-react';
import { MOBILE_QUICK_NAV } from '../data/site';
import { useScrollSpy } from '../hooks/useScrollSpy';

const ICONS: Record<string, React.FC<{ size?: number; strokeWidth?: number }>> = {
  about: User,
  expeditions: Map,
  manifesto: BookOpen,
  services: Briefcase,
  testimonials: Quote,
  ventures: Rocket,
  contact: MessageCircle,
};

export const MobileQuickNav: React.FC = () => {
  const activeId = useScrollSpy(MOBILE_QUICK_NAV.map((i) => i.id));

  const scrollTo = (id: string) => {
    navigator.vibrate?.(8);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="mobile-quick-nav" aria-label="Quick section navigation">
      {MOBILE_QUICK_NAV.map(({ id, mobileLabel }) => {
        const Icon = ICONS[id] ?? User;
        const isActive = activeId === id;
        return (
          <button
            key={id}
            type="button"
            className={`mobile-quick-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-current={isActive ? 'true' : undefined}
            aria-label={mobileLabel}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            <span>{mobileLabel}</span>
          </button>
        );
      })}
    </nav>
  );
};