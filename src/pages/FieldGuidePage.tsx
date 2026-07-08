import { LegalPage } from './LegalPage';
import { SITE } from '../data/site';
import { AXIOMS } from '../data/axioms';

export function FieldGuidePage() {
  return (
    <LegalPage title="Sherpa Field Guide">
      <p>
        A one-page reference for working with {SITE.name}. Download, share, or print.
      </p>

      <h2>Who is a Sherpa?</h2>
      <p>
        Not a consultant who waves from base camp. A Sherpa architects the deal, walks the cap table,
        and stays through the hard descent. Deal architecture, capital syndication, venture operations.
      </p>

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
        <li><strong>Day Hike</strong> — Quick advisory (&lt;$100K)</li>
        <li><strong>Multi-day</strong> — Structured engagement ($100K–$1M)</li>
        <li><strong>Expedition</strong> — Full deal architecture ($1M–$5M)</li>
        <li><strong>Rescue Mission</strong> — Special situations ($5M+)</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
        NOSTR: {SITE.nostr}<br />
        Response: {SITE.responseTime}
      </p>
    </LegalPage>
  );
}