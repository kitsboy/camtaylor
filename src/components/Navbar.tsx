import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Mountain, Menu, X, Bot, ArrowUpRight } from 'lucide-react';
import { IS_PRIVATE_PREVIEW, NAV_ITEMS, ROUTE_LEGS } from '../data/site';
import { WAYPOINTS, formatAltitude, getWaypoint } from '../data/waypoints';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
  onToggleTheme: () => void;
  isNight: boolean;
}

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/** Position on the route, 1–12, in ascent order. */
const ROUTE_INDEX = new Map(WAYPOINTS.map((waypoint, index) => [waypoint.id, index + 1]));

export const Navbar: React.FC<NavbarProps> = ({
  onToggleTerminal,
  isTerminalOpen,
  onToggleTheme,
  isNight,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartY = useRef(0);

  useBodyScrollLock(menuOpen);
  useFocusTrap(menuRef, menuOpen);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Main">
        <div className="nav-container">
          <div className="nav-identity-badge" aria-hidden="true">
            <span className="nav-signal-dot" />{' '}
            {IS_PRIVATE_PREVIEW ? 'LIVE / PRIVATE PREVIEW' : 'LIVE / CAMTAYLOR.CA'}
          </div>
          <div
            className="nav-brand"
            onClick={scrollTop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && scrollTop()}
          >
            <Mountain className="brand-icon" size={16} />
            <span className="nav-brand-text">CAM TAYLOR</span>
            <span className="brand-dot">SHERPA</span>
          </div>

          <a className="nav-agents-cta" href="https://agents.giveabit.io" target="_blank" rel="noopener noreferrer">
            <Bot size={14} /><span>Meet agents</span><ArrowUpRight size={12} />
          </a>

          <div className="nav-links">
            {NAV_ITEMS.filter(({ id }) => ['about', 'agents', 'family', 'proof', 'signal', 'services', 'kit', 'contact'].includes(id)).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="nav-link"
                aria-current={activeId === id ? 'true' : undefined}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            <ThemeToggle isNight={isNight} onToggle={onToggleTheme} />

            <button
              type="button"
              onClick={onToggleTerminal}
              className={`terminal-toggle-btn ${isTerminalOpen ? 'active' : ''}`}
              aria-label="Toggle Command Deck"
            >
              <Terminal size={14} />
              <span className="terminal-toggle-label">{isTerminalOpen ? 'Exit' : 'Command Deck'}</span>
              <kbd className="nav-keycap" aria-hidden="true">/</kbd>
            </button>

            <button
              ref={menuBtnRef}
              type="button"
              className="nav-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* The whole line, in three legs. This is the only surface that
            carries all twelve camps — the bottom bar carries the six a thumb
            needs, and the desktop rail carries them on a spine.

            It is the whole screen, so there is no backdrop: nothing is left
            "outside" to click, and a second full-screen control named "Close
            menu" was competing with this sheet's own toggle. */}
        <div
          id="mobile-nav-menu"
          ref={menuRef}
          className={`nav-mobile-menu ${menuOpen ? 'nav-mobile-menu--open' : ''}`}
          role="dialog"
          aria-modal={menuOpen}
          aria-hidden={!menuOpen}
          // `aria-hidden` alone leaves the fourteen controls inside this sheet in the tab
          // order: a keyboard reader tabs into a closed menu and hears nothing, because
          // every label in it is hidden from them. `inert` takes the subtree out of focus
          // and pointer reach as well, which is what "closed" has to mean.
          inert={!menuOpen}
          aria-label="Route sheet"
          onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientY - touchStartY.current;
            // Dismiss on a pull *down*, and only from the top of the sheet.
            // The old check fired on any upward swipe — which is how you scroll
            // a twelve-item list, so scrolling the menu used to close it.
            const atTop = (menuRef.current?.scrollTop ?? 0) <= 0;
            if (delta > 72 && atTop) setMenuOpen(false);
          }}
        >
          <div className="nav-mobile-head">
            <span className="nav-mobile-kicker">Route sheet</span>
            <span className="nav-mobile-note">Twelve camps · the whole line, one tap</span>
          </div>

          <a className="nav-mobile-agents" href="https://agents.giveabit.io" target="_blank" rel="noopener noreferrer">
            <Bot size={15} /> Meet the agents <ArrowUpRight size={14} />
          </a>

          {ROUTE_LEGS.map((leg, legIndex) => (
            <section className="nav-mobile-leg" key={leg.id} aria-label={leg.name}>
              <p className="nav-mobile-leg-name">
                <span className="nav-mobile-leg-index">
                  Leg {String(legIndex + 1).padStart(2, '0')}
                </span>
                {leg.name}
                <span className="nav-mobile-leg-note">{leg.note}</span>
              </p>
              <ol className="nav-mobile-stops">
                {leg.ids.map((id) => {
                  const item = NAV_ITEMS.find((nav) => nav.id === id);
                  if (!item) return null;
                  const waypoint = getWaypoint(id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => scrollTo(id)}
                        className="nav-mobile-link"
                        aria-current={activeId === id ? 'true' : undefined}
                        aria-label={`Travel to ${waypoint?.camp ?? item.label} — ${item.label}`}
                      >
                        <span className="nav-mobile-index" aria-hidden="true">
                          {String(ROUTE_INDEX.get(id) ?? 0).padStart(2, '0')}
                        </span>
                        <span className="nav-mobile-copy">
                          <strong className="nav-mobile-camp">{waypoint?.camp ?? item.label}</strong>
                          <small className="nav-mobile-meta">
                            {item.label}
                            {waypoint ? ` · ${formatAltitude(waypoint.altitude)} · ${waypoint.condition}` : ''}
                          </small>
                        </span>
                        <ArrowUpRight className="nav-mobile-go" size={14} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}

          <div className="nav-mobile-footer">
            <ThemeToggle isNight={isNight} onToggle={onToggleTheme} />
            <button type="button" className="nav-mobile-terminal" onClick={() => { setMenuOpen(false); onToggleTerminal(); }}>
              <Terminal size={14} />
              Command Deck
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};