import { Link } from 'react-router-dom';
import { Mountain, Terminal, ArrowLeft } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SiteLayout } from '../components/SiteLayout';

export function NotFoundPage() {
  usePageMeta({
    title: 'Route not found',
    description: 'This trail does not exist. Return to camtaylor.ca.',
    path: '/404',
  });

  return (
    <SiteLayout>
      <div className="not-found-page">
        <p className="not-found-code">404</p>
        <h1>Off the map</h1>
        <p className="not-found-desc">
          This route isn&apos;t on the Sherpa chart. Try the Command Deck on the homepage — type{' '}
          <code>/help</code> for available commands.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            <ArrowLeft size={15} />
            <span>Back to base camp</span>
          </Link>
          <Link to="/field-guide" className="btn-secondary">
            <Mountain size={14} />
            <span>Field Guide</span>
          </Link>
          <Link to="/#contact" className="btn-secondary btn-ghost">
            <Terminal size={14} />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}