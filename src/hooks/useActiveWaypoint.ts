import { useEffect, useState } from 'react';
import { WAYPOINTS, type Waypoint } from '../data/waypoints';

export interface ActiveWaypoint {
  /** The waypoint currently under the reading line, in scroll order. */
  waypoint: Waypoint;
  /** 1-based position among the route's camps (Base Camp = 1). */
  position: number;
  /** Total camps on the route. */
  total: number;
}

const FALLBACK: ActiveWaypoint = { waypoint: WAYPOINTS[0], position: 1, total: WAYPOINTS.length };

/**
 * Which camp the reader is standing at, driven by the same scroll position the
 * nav and route rail read. Positions are structural framing (Base Camp → Summit),
 * not a measured reading — waypoints.ts says as much, and this honours that.
 */
export function useActiveWaypoint(): ActiveWaypoint {
  const [active, setActive] = useState<ActiveWaypoint>(FALLBACK);

  useEffect(() => {
    const ids = WAYPOINTS.map((waypoint) => waypoint.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!('IntersectionObserver' in window) || !els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).id;
            const index = ids.indexOf(id);
            if (index >= 0) {
              setActive({ waypoint: WAYPOINTS[index], position: index + 1, total: WAYPOINTS.length });
            }
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}
