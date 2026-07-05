import React from 'react';
import { ArrowUp, Terminal } from 'lucide-react';

interface FooterProps {
  onToggleTerminal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onToggleTerminal }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-info">
            <h4 className="footer-title">Cameron Taylor</h4>
            <p className="footer-tagline">Value Brokerage & Deal Architecture</p>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="back-to-top"
            aria-label="Back to Top"
          >
            <ArrowUp size={16} />
          </button>
        </div>
        
        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} camtaylor.ca. All rights reserved.
          </p>
          <div className="footer-links">
            <button onClick={onToggleTerminal} className="footer-terminal-link">
              <Terminal size={12} />
              <span>Agent Command Deck</span>
            </button>
            <span className="footer-status-dot"></span>
            <span className="footer-status-text">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
