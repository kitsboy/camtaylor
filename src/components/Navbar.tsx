import React from 'react';
import { Terminal, Shield } from 'lucide-react';

interface NavbarProps {
  onToggleTerminal: () => void;
  isTerminalOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleTerminal, isTerminalOpen }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Shield className="brand-icon" size={18} />
          <span>CAMERON TAYLOR</span>
          <span className="brand-dot">.CA</span>
        </div>

        <div className="nav-links">
          <button onClick={() => scrollTo('manifesto')} className="nav-link">Manifesto</button>
          <button onClick={() => scrollTo('services')} className="nav-link">Expertise</button>
          <button onClick={() => scrollTo('ventures')} className="nav-link">Ventures</button>
          <button onClick={() => scrollTo('contact')} className="nav-link">Connect</button>
        </div>

        <button 
          onClick={onToggleTerminal} 
          className={`terminal-toggle-btn ${isTerminalOpen ? 'active' : ''}`}
          aria-label="Toggle Command Deck"
        >
          <Terminal size={16} />
          <span>{isTerminalOpen ? 'Exit Deck' : 'Command Deck'}</span>
        </button>
      </div>
    </nav>
  );
};
