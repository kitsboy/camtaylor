import { useEffect, useState } from 'react';

/**
 * A wall-clock "now" that ticks once a second while the tab is visible, for
 * live countdowns. Anchoring a countdown to this (plus a real updatedAt) lets
 * the remaining time visibly move without re-fetching — the show is honest
 * because it is derived from an actual reading, never invented.
 *
 * Pauses when the tab is hidden; the value simply freezes until it's seen
 * again (Date.now() would jump it silently, so callers must not assume ticks).
 */
export function useLiveCountdown(): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}