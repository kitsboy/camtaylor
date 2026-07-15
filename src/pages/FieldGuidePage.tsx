import { Link } from 'react-router-dom';
import { Printer, Download } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SiteLayout } from '../components/SiteLayout';
import {
  FIELD_GUIDE_INTRO,
  FIELD_GUIDE_SHERPA,
  FIELD_GUIDE_WORKING_NORMS,
  FIELD_GUIDE_RED_FLAGS,
  FIELD_GUIDE_LAST_UPDATED,
  AXIOMS,
  DEAL_TIERS,
  ANTI_SERVICES,
} from '../data/fieldGuide';
import { SITE } from '../data/site';

export function FieldGuidePage() {
  usePageMeta({
    title: 'Sherpa Field Guide',
    description: 'One-page reference for working with Cam Taylor — expedition tiers, principles, and contact.',
    path: '/field-guide',
  });

  const handlePrint = () => window.print();

  return (
    <SiteLayout>
      <article className="legal-content field-guide-content">
        <h1>Sherpa Field Guide</h1>
        <p className="legal-updated">Last updated: {FIELD_GUIDE_LAST_UPDATED}</p>
        <p>{FIELD_GUIDE_INTRO}</p>

        <div className="field-guide-actions">
          <button type="button" className="btn-secondary" onClick={handlePrint}>
            <Printer size={14} />
            Print / Save as PDF
          </button>
          <a href="/field-guide" className="btn-secondary btn-ghost" download>
            <Download size={14} />
            Share link
          </a>
        </div>

        <h2>Who is a Sherpa?</h2>
        <p>{FIELD_GUIDE_SHERPA}</p>

        <h2>Three Principles</h2>
        <ol>
          {AXIOMS.map((a) => (
            <li key={a.id}>
              <strong>{a.title}</strong> — {a.description}
            </li>
          ))}
        </ol>

        <h2>Expedition Tiers</h2>
        <ul>
          {DEAL_TIERS.map((tier) => (
            <li key={tier.id}>
              <strong>{tier.label}</strong> ({tier.range}) — {tier.description}
              {tier.duration && <> · {tier.duration}</>}
            </li>
          ))}
        </ul>

        <h2>How we work</h2>
        <ul>
          {FIELD_GUIDE_WORKING_NORMS.map((norm) => (
            <li key={norm}>{norm}</li>
          ))}
        </ul>

        <h2>Red flags</h2>
        <ul className="red-flag-list">
          {FIELD_GUIDE_RED_FLAGS.map((flag) => (
            <li key={flag}>{flag}</li>
          ))}
        </ul>

        <h2>Not a fit</h2>
        <ul>
          {ANTI_SERVICES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>Contact</h2>
        <p>
          Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
          NOSTR: {SITE.nostr}<br />
          Response: {SITE.responseTime}
        </p>
        <p>
          <Link to="/#contact">Submit expedition form</Link> ·{' '}
          <Link to="/2026">2026 review</Link>
        </p>
      </article>
    </SiteLayout>
  );
}