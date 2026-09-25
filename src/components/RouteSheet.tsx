import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { WAYPOINTS, formatAltitude } from '../data/waypoints';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useReducedMotion } from '../hooks/useReducedMotion';

/** Module scope so the scroll-spy effect does not re-subscribe every render. */
const WAYPOINT_IDS = WAYPOINTS.map((waypoint) => waypoint.id);

/**
 * The route sheet — the whole climb in one block, high up the page.
 *
 * The homepage runs thirteen sections deep, and until now the only way to reach
 * a section past the eighth was to scroll through everything before it. This is
 * the map: every waypoint from base camp to summit, in scroll order, each one a
 * single tap away. Position in the grid is route order, never a measurement —
 * the altitudes are the same framing labels the signage uses.
 *
 * The cascade is driven by this container entering the viewport rather than by
 * each stop, so no stop can be stranded at opacity 0 the way the ventures cards
 * were inside their horizontal carousel.
 */
export const RouteSheet: React.FC = () => {
  const activeId = useScrollSpy(WAYPOINT_IDS);
  const reduced = useReducedMotion();

  const travel = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <motion.nav
      className="route-sheet"
      aria-label="Route sheet"
      initial={reduced ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
    >
      <div className="route-sheet-head">
        <p className="route-sheet-kicker">
          <Compass size={13} aria-hidden="true" /> Route sheet
        </p>
        <p className="route-sheet-note">
          Twelve waypoints, base camp to summit, in the order you will meet them. Travel straight to any camp —
          the full read stays below.
        </p>
      </div>

      <ol className="route-sheet-list">
        {WAYPOINTS.map((waypoint, index) => {
          const isActive = activeId === waypoint.id;
          return (
            <motion.li
              key={waypoint.id}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            >
              <button
                type="button"
                className={`route-sheet-stop${isActive ? ' route-sheet-stop--active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
                aria-label={`Travel to ${waypoint.camp} — ${waypoint.label}, ${waypoint.condition}`}
                title={`${waypoint.camp} · ${formatAltitude(waypoint.altitude)} · ${waypoint.condition}`}
                data-waypoint={waypoint.id}
                onClick={() => travel(waypoint.id)}
              >
                <span className="route-sheet-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="route-sheet-camp">{waypoint.camp}</span>
                <span className="route-sheet-meta">
                  <span className="route-sheet-label">{waypoint.label}</span>
                  <span className="route-sheet-alt">{formatAltitude(waypoint.altitude)}</span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </ol>
    </motion.nav>
  );
};
