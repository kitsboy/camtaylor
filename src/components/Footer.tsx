import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Terminal, Gauge } from 'lucide-react';
import { SITE } from '../data/site';
import { EcosystemRibbon } from './EcosystemRibbon';

interface FooterProps {
  onToggleTerminal: () => void;
}

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onToggleTerminal }) => {
  return (
    <footer className="footer">
      <EcosystemRibbon />

      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-info">
            <h4 className="footer-title">{SITE.name}</h4>
            <p className="footer-tagline">&ldquo;{SITE.tagline}&rdquo;</p>
            <div className="footer-social">
              <a href={SITE.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </a>
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href={SITE.social.x} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <XIcon />
              </a>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="back-to-top"
            aria-label="Back to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {SITE.domain} — All rights reserved.
          </p>
          <div className="footer-links">
            <span className="perf-badge" title="Lean static site">
              <Gauge size={11} />
              Lighthouse-ready
            </span>
            <Link to="/2026" className="footer-legal-link">2026 Review</Link>
            <Link to="/field-guide" className="footer-legal-link">Field Guide</Link>
            <Link to="/privacy" className="footer-legal-link">Privacy</Link>
            <Link to="/terms" className="footer-legal-link">Terms</Link>
            <button onClick={onToggleTerminal} className="footer-terminal-link">
              <Terminal size={11} />
              <span>Command Deck</span>
            </button>
            <span className="footer-status-dot" />
            <span className="footer-status-text">Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};