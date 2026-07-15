import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Mountain, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '../data/site';
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
      {menuOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Main">
        <div className="nav-container">
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

          <div className="nav-links">
            {NAV_ITEMS.map(({ id, label }) => (
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

        <div
          id="mobile-nav-menu"
          ref={menuRef}
          className={`nav-mobile-menu ${menuOpen ? 'nav-mobile-menu--open' : ''}`}
          role="dialog"
          aria-modal={menuOpen}
          aria-hidden={!menuOpen}
          onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => {
            const delta = e.changedTouches[0].clientY - touchStartY.current;
            if (delta < -60) setMenuOpen(false);
          }}
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(id)}
              className="nav-mobile-link"
              aria-current={activeId === id ? 'true' : undefined}
            >
              <span className="nav-mobile-indicator" aria-hidden="true" />
              {label}
            </button>
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