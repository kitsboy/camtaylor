import React from 'react';
import { ArrowUp, ArrowUpRight, Bot, Compass, Gauge, Mail, Mountain, ShieldCheck, Terminal, Copy, Check, ExternalLink, Heart, KeyRound, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IS_PRIVATE_PREVIEW, SITE } from '../data/site';
import { FAMILY_OFFERINGS } from '../data/family';
import { EcosystemRibbon } from './EcosystemRibbon';

interface FooterProps {
  onToggleTerminal: () => void;
}

const GitHubIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const NostrIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3.2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13.6c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onToggleTerminal }) => {
  const [copied, setCopied] = React.useState(false);
  const [sitemapOpen, setSitemapOpen] = React.useState(false);
  const [quoteIndex, setQuoteIndex] = React.useState(0);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const footerQuotes = ['Hard yet humble, wise yet we can dance.', 'We\'d rather show you old truth than new lies.'];
  React.useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  React.useEffect(() => {
    const timer = window.setInterval(() => setQuoteIndex((index) => (index + 1) % footerQuotes.length), 7000);
    return () => window.clearInterval(timer);
  }, [footerQuotes.length]);

  const copyEmail = async () => {
    await navigator.clipboard?.writeText(SITE.familyEmail);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer className="footer footer--basecamp">
      <EcosystemRibbon />
      <div className="footer-container">
        <div className="footer-hero">
          <div>
            <p className="footer-kicker"><Mountain size={14} /> BASE CAMP / CAM TAYLOR</p>
            <h2 className="footer-big-title">Keep climbing.<br /><span>Keep your keys.</span></h2>
            <p className="footer-wise-line" aria-live="polite">{footerQuotes[quoteIndex]}</p>
          </div>
          <a href={SITE.agentsUrl} target="_blank" rel="noopener noreferrer" className="footer-hero-cta footer-agents-panel">
            <Bot size={17} />
            <span>Meet the agents</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="footer-manifesto-strip">
          <div className="footer-manifesto-mark"><KeyRound size={15} /></div>
          <div><strong>Sovereignty is a practice.</strong><span>Keep the keys. Keep asking good questions.</span></div>
          <Heart size={15} className="footer-manifesto-heart" aria-hidden="true" />
        </div>

        <div className="footer-signal-row">
          <div className="footer-signal">
            <span className="footer-signal-dot" />{' '}
            {IS_PRIVATE_PREVIEW ? 'PRIVATE PREVIEW / LOCAL BUILD' : 'PUBLIC / LIVE'}
          </div>
          <div className="footer-signal-line" />
          <div className="footer-signal"><ShieldCheck size={13} /> PROOF OVER PROMISE</div>
        </div>

        <div className="footer-main-grid">
          <div className="footer-brand-block">
            <h3>{SITE.name}<span> · {SITE.title}</span></h3>
            <p>Tools, people, and principles for a more sovereign digital life.</p>
            <div className="footer-email-cta">
              <span><Mail size={13} /> {SITE.familyEmail}</span>
              <button type="button" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy family email'} title={copied ? 'Copied' : 'Copy email'}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
            <div className="footer-social footer-social--large" aria-label="Social links">
              <a href={SITE.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><GitHubIcon /></a>
              <a href={SITE.social.x} target="_blank" rel="noopener noreferrer" aria-label="X" title="X"><XIcon /></a>
              <a href={SITE.social.nostr} target="_blank" rel="noopener noreferrer" aria-label="Nostr" title="Nostr"><NostrIcon /></a>
              <a href={`mailto:${SITE.familyEmail}`} aria-label="Email the Give A Bit family" title={SITE.familyEmail}><Mail size={16} /></a>
            </div>
          </div>

          <nav className="footer-link-column" aria-label="Explore">
            <h4><Compass size={13} /> Explore</h4>
            <a href="#about">About Cam <ArrowUpRight size={12} /></a>
            <a href="#agents">Agents <ArrowUpRight size={12} /></a>
            <a href="#family">Family <ArrowUpRight size={12} /></a>
            <a href="#proof">Proof / truth <ArrowUpRight size={12} /></a>
            <a href="#signal">Live signal <ArrowUpRight size={12} /></a>
            <a href="#kit">Trail kit <ArrowUpRight size={12} /></a>
          </nav>

          <nav className="footer-link-column" aria-label="Read and connect">
            <h4><Terminal size={13} /> Read / connect</h4>
            <Link to="/field-guide">Field Guide <ArrowUpRight size={12} /></Link>
            <Link to="/2026">2026 Review <ArrowUpRight size={12} /></Link>
            <a href={SITE.agentsUrl} target="_blank" rel="noopener noreferrer">Agents front door <ArrowUpRight size={12} /></a>
            <a href={`mailto:${SITE.familyEmail}`}>hello@giveabit.io <ArrowUpRight size={12} /></a>
          </nav>

          <div className="footer-palette" aria-label="Give A Bit family identity color chart">
            <div className="footer-palette-heading"><span><Gauge size={13} /> FAMILY SPECTRUM</span><small><Sparkles size={11} /> identity colors, not performance stats</small></div>
            <div className="footer-palette-chart">
              {FAMILY_OFFERINGS.map((offering, index) => (
                <a key={offering.id} href={offering.url} target="_blank" rel="noopener noreferrer" className="footer-palette-bar" style={{ '--palette-color': offering.color, '--palette-height': `${42 + (index % 5) * 11}%` } as React.CSSProperties} title={`${offering.name} · ${offering.label}`} aria-label={`Visit ${offering.name}, ${offering.label}`}>
                  <ExternalLink className="footer-palette-arrow" size={10} aria-hidden="true" />
                  <span className="footer-palette-fill" />
                  <span className="sr-only">{offering.name}, {offering.label}</span>
                </a>
              ))}
            </div>
            <div className="footer-palette-labels"><span>HUB</span><span>AGENTS</span><span>PROOF</span><span>CREATORS</span><span>RIGHTS</span><span>TRUST</span><span>RESILIENCE</span><span>DATA</span><span>LIGHTNING</span><span>OPS</span></div>
          </div>
        </div>

        <div className={`footer-sitemap ${sitemapOpen ? 'footer-sitemap--open' : ''}`}>
          <button type="button" className="footer-sitemap-toggle" aria-expanded={sitemapOpen} aria-controls="footer-sitemap-list" onClick={() => setSitemapOpen((open) => !open)}>
            <span><Compass size={14} /> All Give A Bit routes <small>10 properties / one family</small></span>
            <ChevronDown size={17} aria-hidden="true" />
          </button>
          <div id="footer-sitemap-list" className="footer-sitemap-list" hidden={!sitemapOpen}>
            {FAMILY_OFFERINGS.map((offering, index) => (
              <a key={offering.id} href={offering.url} target="_blank" rel="noopener noreferrer" className="footer-sitemap-item">
                <span className="footer-sitemap-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="footer-sitemap-color" style={{ background: offering.color }} />
                <span className="footer-sitemap-copy"><strong>{offering.name}</strong><small>{offering.label}</small></span>
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-divider" />
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} {SITE.domain} — All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy" className="footer-legal-link">Privacy</Link>
            <Link to="/terms" className="footer-legal-link">Terms</Link>
            <button onClick={onToggleTerminal} className="footer-terminal-link"><Terminal size={12} /> <span>Command Deck</span></button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="back-to-top back-to-top--progress" aria-label="Back to top" style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties}><ArrowUp size={14} /></button>
          </div>
        </div>
      </div>
    </footer>
  );
};
