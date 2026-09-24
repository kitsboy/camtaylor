import React from 'react';
import { NAV_ITEMS } from '../data/site';
import { formatAltitude, getWaypoint } from '../data/waypoints';
import { useScrollSpy } from '../hooks/useScrollSpy';

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

/**
 * Desktop-only route map: one waypoint per section, a filled spine showing how
 * far up the route you are, and the camp, framing altitude and conditions for
 * whichever waypoint you are standing on. Hidden under 1200px.
 */
export const RouteRail: React.FC = () => {
  const activeId = useScrollSpy(SECTION_IDS);
  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) => item.id === activeId),
  );
  const progress = NAV_ITEMS.length > 1 ? activeIndex / (NAV_ITEMS.length - 1) : 0;

  return (
    <nav className="route-rail" aria-label="Route map">
      <span className="route-rail-spine" aria-hidden="true" />
      <span
        className="route-rail-progress"
        aria-hidden="true"
        style={{ height: `calc((100% - 32px) * ${progress.toFixed(3)})` }}
      />

      {NAV_ITEMS.map(({ id, label }, index) => {
        const waypoint = getWaypoint(id);
        const isActive = activeId === id;
        return (
          <button
            key={id}
            type="button"
            data-section={id}
            className={`route-rail-marker ${isActive ? 'route-rail-marker--active' : ''}`}
            aria-current={isActive ? 'true' : undefined}
            /* The action is the accessible name; camp/altitude/conditions ride
               along as a tooltip so the name can never collide with another
               control's label elsewhere on the page. */
            aria-label={`Go to ${label}`}
            title={
              waypoint
                ? `${waypoint.camp} · ${formatAltitude(waypoint.altitude)} · conditions ${waypoint.condition}`
                : label
            }
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="route-rail-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="route-rail-dot" aria-hidden="true" />
            <span className="route-rail-label">
              <strong>{waypoint?.camp ?? label}</strong>
              {waypoint && (
                <small>
                  {formatAltitude(waypoint.altitude)} · {waypoint.condition}
                </small>
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
