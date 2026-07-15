import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Users } from 'lucide-react';
import { VENTURES, VENTURE_STATUS_LABELS } from '../data/ventures';
import { usePageMeta } from '../hooks/usePageMeta';
import { SiteLayout } from '../components/SiteLayout';

export function VentureRoutePage() {
  const { ventureId } = useParams<{ ventureId: string }>();
  const venture = VENTURES.find((v) => v.id === ventureId);

  usePageMeta({
    title: venture ? `Route — ${venture.name}` : 'Venture not found',
    description: venture
      ? `${venture.name}: ${venture.role}. ${venture.desc}`
      : 'Venture route not found on camtaylor.ca.',
    path: venture ? `/route/${venture.id}` : '/route',
  });

  if (!venture) {
    return (
      <SiteLayout>
        <div className="venture-route-page">
          <h1>Venture not found</h1>
          <p>Try <code>/route giveabit</code> in the Command Deck, or browse ventures on the homepage.</p>
          <Link to="/#ventures" className="btn-primary">View ventures</Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="venture-route-page">
        <Link to="/#ventures" className="legal-back">
          <ArrowLeft size={16} />
          <span>All ventures</span>
        </Link>

        <p className="venture-route-eyebrow">{venture.tag}</p>
        <h1>{venture.name}</h1>
        <p className="venture-route-role">{venture.role}</p>
        <p className="venture-route-status">
          {VENTURE_STATUS_LABELS[venture.status]} · Altitude {venture.altitude}%
        </p>
        <p>{venture.desc}</p>

        <div className="venture-route-case">
          <h2>Case study</h2>
          <div className="venture-slide">
            <span className="venture-slide-num">01</span>
            <h3>Problem</h3>
            <p>{venture.caseStudy.problem}</p>
          </div>
          <div className="venture-slide">
            <span className="venture-slide-num">02</span>
            <h3>Structure</h3>
            <p>{venture.caseStudy.structure}</p>
          </div>
          <div className="venture-slide">
            <span className="venture-slide-num">03</span>
            <h3>Outcome</h3>
            <p>{venture.caseStudy.outcome}</p>
          </div>
        </div>

        <div className="venture-route-actions">
          <a href={venture.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Visit platform <ArrowUpRight size={14} />
          </a>
          {venture.needsTalent && (
            <Link to="/#contact" className="btn-secondary">
              <Users size={14} /> Join expedition
            </Link>
          )}
        </div>
      </article>
    </SiteLayout>
  );
}