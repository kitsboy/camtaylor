import React from 'react';
import { User, BookOpen, Briefcase, Rocket, MessageCircle } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';

const ITEMS = [
  { id: 'about', label: 'About', Icon: User },
  { id: 'manifesto', label: 'Philosophy', Icon: BookOpen },
  { id: 'services', label: 'Expertise', Icon: Briefcase },
  { id: 'ventures', label: 'Ventures', Icon: Rocket },
  { id: 'contact', label: 'Connect', Icon: MessageCircle },
] as const;

export const MobileQuickNav: React.FC = () => {
  const activeId = useScrollSpy(ITEMS.map((i) => i.id));

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="mobile-quick-nav" aria-label="Quick section navigation">
      {ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          className={`mobile-quick-nav-btn ${activeId === id ? 'active' : ''}`}
          onClick={() => scrollTo(id)}
          aria-current={activeId === id ? 'true' : undefined}
          aria-label={label}
        >
          <Icon size={18} strokeWidth={activeId === id ? 2.5 : 2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
};