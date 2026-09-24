import React from 'react';
import { Clock, Mountain } from 'lucide-react';
import { ROUTE_CONDITIONS } from '../data/liveSignal';
import { usePacificClock } from '../hooks/usePacificClock';

/**
 * Route conditions band: a low-key marquee of standing conditions plus the
 * live Pacific clock, so the page always carries one honest moving part.
 */
export const RouteTicker: React.FC = () => {
  const { shortTime, zone } = usePacificClock(15_000);

  const track = (
    <div className="route-ticker-track">
      {ROUTE_CONDITIONS.map((condition) => (
        <span className="route-ticker-item" key={condition}>
          <i aria-hidden="true">◆</i>
          {condition}
        </span>
      ))}
    </div>
  );

  return (
    <aside className="route-ticker" aria-label="Route conditions">
      <div className="route-ticker-cap">
        <Mountain size={13} aria-hidden="true" />
        <span className="route-ticker-cap-label">ROUTE CONDITIONS</span>
        <span className="route-ticker-clock">
          <Clock size={12} aria-hidden="true" />
          {shortTime} <small>{zone}</small>
        </span>
      </div>
      <div className="route-ticker-viewport">
        <div className="route-ticker-rail">
          {track}
          <div className="route-ticker-track" aria-hidden="true">
            {ROUTE_CONDITIONS.map((condition) => (
              <span className="route-ticker-item" key={`dup-${condition}`}>
                <i aria-hidden="true">◆</i>
                {condition}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
