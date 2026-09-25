import React from 'react';
import { User, Briefcase, Rocket, ShieldCheck, Map, MessageCircle } from 'lucide-react';
import { MOBILE_QUICK_NAV } from '../data/site';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useScrollProgress } from '../hooks/useScrollProgress';

/**
 * The phone's navigation, and the only one it needs: six camps, always on
 * screen, plus a hairline showing how far up the route you are.
 *
 * It used to hold ten items, and ten 44px targets need 440px — more than the
 * whole viewport at 320–430px, so the last two (Ventures and Connect) sat
 * entirely off the right edge. Nothing caught it: the bar is `position: fixed`,
 * so it contributes nothing to the document's `scrollWidth`, and a 44px sweep
 * passes anyway because each *button* is 44px — it is the row that overflows.
 *
 * Connect is the bar's call to action, which is why the floating "Start a
 * conversation" pill is off on a phone. Two CTAs for one action, one of which
 * depends on which way you last scrolled, is one too many.
 */
const ICONS: Record<string, React.FC<{ size?: number; strokeWidth?: number }>> = {
  about: User,
  services: Briefcase,
  ventures: Rocket,
  proof: ShieldCheck,
  expeditions: Map,
  contact: MessageCircle,
};

const SECTION_IDS = MOBILE_QUICK_NAV.map((item) => item.id);

export const MobileQuickNav: React.FC = () => {
  const activeId = useScrollSpy(SECTION_IDS);
  const progress = useScrollProgress();

  const scrollTo = (id: string) => {
    navigator.vibrate?.(8);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="mobile-quick-nav" aria-label="Quick section navigation">
      <span
        className="mobile-quick-nav-progress"
        aria-hidden="true"
        style={{ transform: `scaleX(${progress.toFixed(4)})` }}
      />
      {MOBILE_QUICK_NAV.map(({ id, mobileLabel }) => {
        const Icon = ICONS[id] ?? User;
        const isActive = activeId === id;
        return (
          <button
            key={id}
            type="button"
            className={[
              'mobile-quick-nav-btn',
              isActive ? 'active' : '',
              id === 'contact' ? 'mobile-quick-nav-btn--cta' : '',
            ]
              .filter(Boolean)
              .join(' ')}
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
