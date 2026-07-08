import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, ArrowLeft } from 'lucide-react';
import { SITE } from '../data/site';

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

export const LegalPage: React.FC<LegalPageProps> = ({ title, children }) => {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <Link to="/" className="legal-back">
          <ArrowLeft size={16} />
          <span>Back to {SITE.domain}</span>
        </Link>
        <div className="legal-brand">
          <Mountain size={16} />
          <span>{SITE.name}</span>
        </div>
      </header>

      <main className="legal-content">
        <h1>{title}</h1>
        <p className="legal-updated">Last updated: July 5, 2026</p>
        {children}
      </main>

      <footer className="legal-footer">
        <p>© {new Date().getFullYear()} {SITE.domain}</p>
        <div className="legal-footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
};