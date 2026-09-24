import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mountain } from 'lucide-react';
import { SiteLayout } from '../components/SiteLayout';
import { DispatchBody } from '../components/DispatchBody';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  dispatchNeighbours,
  formatDispatchDate,
  getDispatch,
} from '../utils/dispatches';

export function DispatchPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = getDispatch(slug);
  const { newer, older } = dispatchNeighbours(slug ?? '');

  usePageMeta({
    title: dispatch ? dispatch.title : 'Dispatch not found',
    description: dispatch
      ? dispatch.summary
      : 'That dispatch is not in the expedition log on camtaylor.ca.',
    path: dispatch ? `/dispatch/${dispatch.slug}` : '/dispatch',
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
      <article className="dispatch-page">
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
