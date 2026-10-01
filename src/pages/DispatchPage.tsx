import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mountain, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SiteLayout } from '../components/SiteLayout';
import { DispatchBody } from '../components/DispatchBody';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  dispatchNeighbours,
  formatDispatchDate,
  getDispatch,
} from '../utils/dispatches';
import { SITE } from '../data/site';

export function DispatchPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = getDispatch(slug);
  const { newer, older } = dispatchNeighbours(slug ?? '');
  const [progress, setProgress] = useState(0);

  // Reading progress: a thin bar that fills as the reader scrolls through the
  // article. Long-form feels shorter when the eye can see how far along it is.
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('dispatch-article');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [slug]);

  usePageMeta({
    title: dispatch ? dispatch.title : 'Dispatch not found',
    description: dispatch
      ? dispatch.summary
      : 'That dispatch is not in the expedition log on camtaylor.ca.',
    path: dispatch ? `/dispatch/${dispatch.slug}` : '/dispatch',
    image: dispatch ? `/og/${dispatch.slug}.jpg` : undefined,
    // A dated, attributed dispatch is an Article to anything reading this page
    // mechanically — it was bare HTML to all of them before.
    schema: dispatch
      ? {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'BlogPosting',
              headline: dispatch.title,
              description: dispatch.summary,
              datePublished: dispatch.date,
              url: `${SITE.url}/dispatch/${dispatch.slug}`,
              articleSection: dispatch.terrain,
              author: { '@type': 'Person', name: SITE.name, url: SITE.url },
              publisher: { '@type': 'Person', name: SITE.name, url: SITE.url },
              image: `${SITE.url}/og-image.png`,
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
                { '@type': 'ListItem', position: 2, name: 'Sherpa', item: `${SITE.url}/#expeditions` },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: dispatch.title,
                  item: `${SITE.url}/dispatch/${dispatch.slug}`,
                },
              ],
            },
          ],
        }
      : undefined,
  });

  if (!dispatch) {
    return (
      <SiteLayout>
        <div className="dispatch-page">
          <h1>No such dispatch</h1>
          <p>
            That entry is not in the log — it may have been renamed. Browse the{' '}
            <Link to="/#expeditions">expedition log</Link> for what has actually been
            filed.
          </p>
          <Link to="/#expeditions" className="btn-primary">
            Back to the log
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="dispatch-progress" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>
      <article className="dispatch-page" id="dispatch-article">
        <Link to="/#expeditions" className="legal-back">
          <ArrowLeft size={16} />
          <span>Expedition log</span>
        </Link>

        <p className="dispatch-eyebrow">
          {dispatch.terrain}
          <span aria-hidden="true"> · </span>
          <Mountain size={11} /> {dispatch.camp}
        </p>
        <h1 className="dispatch-title">{dispatch.title}</h1>
        <p className="dispatch-meta">
          <time dateTime={dispatch.date}>{formatDispatchDate(dispatch.date)}</time>
          <span aria-hidden="true"> · </span>
          {dispatch.minutes} min read
          {dispatch.ventureId && (
            <>
              <span aria-hidden="true"> · </span>
              <Link to={`/route/${dispatch.ventureId}`}>Case file</Link>
            </>
          )}
        </p>

        <button
          type="button"
          className="dispatch-print"
          onClick={() => window.print()}
          aria-label="Save this dispatch as a PDF"
        >
          <Printer size={14} />
          Save as PDF
        </button>

        <p className="dispatch-summary">{dispatch.summary}</p>

        <DispatchBody body={dispatch.body} />

        {dispatch.tags.length > 0 && (
          <p className="dispatch-tags">
            <span className="log-tags">
              {dispatch.tags.map((tag) => (
                <span className="log-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </span>
          </p>
        )}

        <nav className="dispatch-nav" aria-label="Dispatch navigation">
          {older ? (
            <Link className="dispatch-nav-link" to={`/dispatch/${older.slug}`}>
              <ArrowLeft size={14} />
              <span>
                <small>Older</small>
                {older.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link className="dispatch-nav-link dispatch-nav-link--next" to={`/dispatch/${newer.slug}`}>
              <span>
                <small>Newer</small>
                {newer.title}
              </span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <p className="dispatch-feed">
          New dispatches land first on the date they happen —{' '}
          <a href="/feed.xml">subscribe by RSS</a> if you would rather be told.
        </p>
      </article>
    </SiteLayout>
  );
}
