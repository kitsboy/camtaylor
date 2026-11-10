import { Link } from 'react-router-dom';
import { Mail, Bitcoin, Zap, Calendar, ArrowUpRight, Compass } from 'lucide-react';
import { usePageMeta } from '../hooks/usePageMeta';
import { SiteLayout } from '../components/SiteLayout';
import { SITE } from '../data/site';
import { VENTURES } from '../data/ventures';
import { NOW_FOCUS, NOW_FOOTNOTE, NOW_INTRO, NOW_LAST_UPDATED } from '../data/now';

/** Everything live or in motion is on the desk; never-published work stays off it. */
const ACTIVE_VENTURES = VENTURES.filter((v) => v.status !== 'stealth');

export function NowPage() {
  usePageMeta({
    title: 'Now',
    description: `Where Cam Taylor's route stands — active ventures, current focus, and how to reach the desk. Updated ${NOW_LAST_UPDATED}.`,
    path: '/now',
  });

  return (
    <SiteLayout>
      <article className="legal-content now-content">
        <div className="now-kicker">ROUTE READING · {NOW_LAST_UPDATED}</div>
        <h1>What I&apos;m working on now</h1>
        <p className="legal-updated">{NOW_INTRO}</p>

        <h2 className="now-h">Currently on the route</h2>
        <ul className="now-list">
          {NOW_FOCUS.map((line) => (
            <li key={line}>
              <Compass size={14} className="now-dot" aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <h2 className="now-h">Active ventures</h2>
        <ul className="now-ventures">
          {ACTIVE_VENTURES.map((venture) => (
            <li className="now-venture" key={venture.id}>
              <span className="now-venture-head">
                <span className="now-venture-name">{venture.name}</span>
                <span className={`now-venture-status now-venture-status--${venture.status}`}>
                  {venture.status}
                </span>
                <a className="now-venture-url" href={venture.url} target="_blank" rel="noreferrer">
                  <ArrowUpRight size={13} />
                </a>
              </span>
              <span className="now-venture-role">{venture.role}</span>
              <span className="now-venture-desc">{venture.desc}</span>
            </li>
          ))}
        </ul>

        <h2 className="now-h">Reach the desk</h2>
        <ul className="now-reach">
          <li>
            <Mail size={14} className="now-dot" aria-hidden="true" />
            <a href={`mailto:${SITE.familyEmail}`}>{SITE.familyEmail}</a>
            <span className="now-reach-note">the monitored inbox</span>
          </li>
          <li>
            <Bitcoin size={14} className="now-dot" aria-hidden="true" />
            <span>Bitcoin / Lightning first</span>
            <span className="now-reach-note">direct, no KYC, no rails</span>
          </li>
          <li>
            <Zap size={14} className="now-dot" aria-hidden="true" />
            <span>NOSTR: {SITE.nostr}</span>
          </li>
          <li>
            <Calendar size={14} className="now-dot" aria-hidden="true" />
            <a href={SITE.calendlyUrl} target="_blank" rel="noreferrer">
              Book a 15-minute route check
            </a>
            <span className="now-reach-note">{SITE.responseTime}</span>
          </li>
        </ul>

        <p className="now-footnote">
          {NOW_FOOTNOTE} <Link to="/">Back to the summit walk</Link>.
        </p>
      </article>
    </SiteLayout>
  );
}
