import { Link } from 'react-router-dom';
import { Mountain, ArrowLeft } from 'lucide-react';
import { SITE } from '../data/site';
import { ThemeToggle } from './ThemeToggle';
import { useThemeContext } from '../context/ThemeContext';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const { toggle, isNight } = useThemeContext();

  return (
    <div className="site-layout">
      <a href="#site-main" className="skip-link">
        Skip to content
      </a>

      <header className="site-layout-header glass-depth-2">
        <Link to="/" className="legal-back">
          <ArrowLeft size={16} />
          <span>Back to {SITE.domain}</span>
        </Link>
        <div className="legal-brand">
          <Mountain size={16} />
          <span>{SITE.name}</span>
        </div>
        <ThemeToggle isNight={isNight} onToggle={toggle} />
      </header>

      <main id="site-main" className="site-layout-main">
        {children}
      </main>

      <footer className="legal-footer">
        <p>© {new Date().getFullYear()} {SITE.domain}</p>
        <div className="legal-footer-links">
          <Link to="/field-guide">Field Guide</Link>
          <Link to="/2026">2026</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}