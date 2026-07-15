import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';
import { SiteLayout } from '../components/SiteLayout';
import { EXPEDITION_LOG } from '../data/expeditionLog';
import { VENTURES, VENTURE_STATUS_LABELS } from '../data/ventures';
import {
  YEAR_REVIEW_HIGHLIGHTS,
  YEAR_REVIEW_LESSONS,
  YEAR_REVIEW_QUARTERS,
  YEAR_REVIEW_LAST_UPDATED,
} from '../data/yearReview';

export function YearReviewPage() {
  usePageMeta({
    title: 'State of the Route — 2026',
    description: 'Annual review of ventures, deals, and lessons from the field.',
    path: '/2026',
  });

  const currentQuarter = `q${Math.ceil((new Date().getMonth() + 1) / 3)}` as keyof typeof YEAR_REVIEW_QUARTERS;

  return (
    <SiteLayout>
      <article className="legal-content year-review-content">
        <h1>State of the Route — 2026</h1>
        <p className="legal-updated">Last updated: {YEAR_REVIEW_LAST_UPDATED}</p>
        <p>
          Annual review of ventures, deals, and lessons from the field. Updated as the year progresses.
        </p>

        <h2>Highlights</h2>
        <ul>
          {YEAR_REVIEW_HIGHLIGHTS.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>

        <h2>Current quarter ({currentQuarter.toUpperCase()})</h2>
        <ul>
          {YEAR_REVIEW_QUARTERS[currentQuarter].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2>Expedition Log</h2>
        <ul>
          {EXPEDITION_LOG.map((e) => (
            <li key={e.id}>
              <strong>{e.date}</strong> — {e.title}: {e.outcome}
            </li>
          ))}
        </ul>
        <p>
          <Link to="/#expeditions">View full log on homepage</Link>
        </p>

        <h2>Venture Altitudes</h2>
        <ul>
          {VENTURES.map((v) => (
            <li key={v.id}>
              <Link to={`/route/${v.id}`}>{v.name}</Link>: {v.altitude}% — {VENTURE_STATUS_LABELS[v.status]}
            </li>
          ))}
        </ul>
        <p>
          <Link to="/#ventures">Portfolio on homepage</Link>
        </p>

        <h2>Lessons</h2>
        <ul>
          {YEAR_REVIEW_LESSONS.map((lesson) => (
            <li key={lesson.id}>
              <strong>{lesson.title}</strong> — {lesson.context}
            </li>
          ))}
        </ul>
      </article>
    </SiteLayout>
  );
}