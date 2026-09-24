import { useEffect, useState } from 'react';

const PACIFIC = 'America/Vancouver';

function format(date: Date, withSeconds: boolean) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PACIFIC,
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12: false,
  }).format(date);
}

/**
 * A single shared tick so anything showing Pacific route time stays in sync
 * and only one interval runs per component that needs it.
 */
export function usePacificClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return {
    now,
    time: format(new Date(now), true),
    shortTime: format(new Date(now), false),
    zone: 'PT',
  };
}
