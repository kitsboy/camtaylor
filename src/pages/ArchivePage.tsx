import { Link } from 'react-router-dom';
import { Mountain, Clock, Rss } from 'lucide-react';
import { SiteLayout } from '../components/SiteLayout';
import { usePageMeta } from '../hooks/usePageMeta';
import { DISPATCHES, formatDispatchDate, formatDispatchMonth } from '../utils/dispatches';

export function ArchivePage() {
  usePageMeta({
    title: 'Archive — the logged route',
    description: `Every dispatch in the expedition log, indexed by date — ${DISPATCHES.length} entries, each with its verdict and camp.`,
    path: '/archive',
  });

  const groups: { month: string; entries: typeof DISPATCHES }[] = [];
  for (const dispatch of DISPATCHES) {
    const month = formatDispatchMonth(dispatch.date);
    const group = groups.find((g) => g.month === month);
    if (group) group.entries.push(dispatch);
    else groups.push({ month, entries: [dispatch] });
  }

  return (
    <SiteLayout>
      <article className="legal-content archive-content">
        <p className="now-kicker">EXPEDITION LOG · INDEXED</p>
        <h1>Archive</h1>
        <p className="legal-updated">
          Every dispatch that has been filed, dated, and kept. {DISPATCHES.length} entries.
        </p>

        {groups.map((group) => (
          <section key={group.month}>
            <h2 className="archive-month">{group.month}</h2>
            <ul className="archive-list">
              {group.entries.map((dispatch) => (
                <li className="archive-row" key={dispatch.slug}>
                  <Link to={`/dispatch/${dispatch.slug}`} className="archive-main">
                    <span className="archive-title">{dispatch.title}</span>
                    <span className="archive-meta">
                      <time dateTime={dispatch.date}>{formatDispatchDate(dispatch.date)}</time>
                      <span aria-hidden="true"> · </span>
                      <Mountain size={11} aria-hidden="true" />
                      {dispatch.camp}
                      <span aria-hidden="true"> · </span>
                      <Clock size={11} aria-hidden="true" />
                      {dispatch.minutes} min
                    </span>
                    <span className="archive-summary">{dispatch.summary}</span>
                  </Link>
                  {dispatch.tags.length > 0 && (
                    <span className="log-tags">
                      {dispatch.tags.map((tag) => (
                        <span className="log-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="archive-foot">
          New dispatches land first on the route —{' '}
          <a href="/feed.xml">
            <Rss size={11} aria-hidden="true" /> subscribe by RSS
          </a>{' '}
          if you would rather be told.
        </p>
      </article>
    </SiteLayout>
  );
}
