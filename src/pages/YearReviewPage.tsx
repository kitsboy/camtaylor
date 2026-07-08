import { LegalPage } from './LegalPage';
import { EXPEDITION_LOG } from '../data/expeditionLog';
import { VENTURES } from '../data/ventures';

export function YearReviewPage() {
  return (
    <LegalPage title="State of the Route — 2026">
      <p>
        Annual review of ventures, deals, and lessons from the field. Updated as the year progresses.
      </p>

      <h2>Highlights</h2>
      <ul>
        <li>camtaylor.ca Sherpa command centre launched</li>
        <li>Give A Bit constellation at 7 active ventures</li>
        <li>OpenStrata syndication round in progress</li>
        <li>NOSTR identity layer live at @giveabit.io</li>
      </ul>

      <h2>Expedition Log</h2>
      <ul>
        {EXPEDITION_LOG.map((e) => (
          <li key={e.id}>
            <strong>{e.date}</strong> — {e.title}: {e.outcome}
          </li>
        ))}
      </ul>

      <h2>Venture Altitudes</h2>
      <ul>
        {VENTURES.map((v) => (
          <li key={v.id}>
            {v.name}: {v.altitude}% — {v.status}
          </li>
        ))}
      </ul>

      <h2>Lessons</h2>
      <p>
        Skin in the game beats hourly advice. Structure before scale. The descent matters as much as the summit.
      </p>
    </LegalPage>
  );
}