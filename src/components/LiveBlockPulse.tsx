import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { subscribeBoard, readChain } from '../utils/signalBoard';

const whole = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

function formatAge(tsEpochMs: number, nowMs: number): string {
  const seconds = Math.max(0, Math.round((nowMs - tsEpochMs) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

/**
 * A slim, always-on "latest block" heartbeat in the hero. It reads the SAME
 * chain snapshot the live panels publish (via the signal board), so it can
 * never be a second, quieter source of numbers. If the chain isn't read yet,
 * it shows an honest "—" state.
 */
export function LiveBlockPulse() {
  const reduced = useReducedMotion();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    // Repaint every 15s so the "blocks ago" readout stays truthful without a
    // tight tick. The height itself only changes when a new board publish lands.
    const t = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => subscribeBoard(() => setNow(Date.now())), []);

  const snapshot = readChain();
  const height = snapshot.tipHeight;
  const live = snapshot.status === 'live' && height != null && !snapshot.isStale;

  return (
    <span className={`block-pulse ${live ? 'block-pulse--live' : ''}`} role="status" aria-live="polite">
      <span className={`block-pulse-dot ${reduced ? 'block-pulse-dot--still' : ''}`} aria-hidden="true" />
      {live ? (
        <>
          <span className="block-pulse-label">Latest block</span>
          <strong>{whole.format(height)}</strong>
          {snapshot.updatedAt ? <span className="block-pulse-age">{formatAge(snapshot.updatedAt, now)} ago</span> : null}
        </>
      ) : height != null ? (
        <>
          <span className="block-pulse-label">Last read</span>
          <strong>{whole.format(height)}</strong>
        </>
      ) : (
        <span className="block-pulse-label">Reading chain…</span>
      )}
    </span>
  );
}
