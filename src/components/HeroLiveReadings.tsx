import { useEffect, useState } from 'react';
import { subscribeBoard, readChain } from '../utils/signalBoard';

const whole = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

/**
 * A live "route conditions" readout in the hero. It reads the SAME chain
 * snapshot the panels publish (via the signal board), so it can never be a
 * second, quieter source of numbers. Each value is gated on the snapshot
 * actually holding it — a missing read shows "—", never a guess.
 */
export function HeroLiveReadings() {
  const [, setTick] = useState(0);

  useEffect(() => subscribeBoard(() => setTick((t) => t + 1)), []);

  const chain = readChain();
  const live = chain.status === 'live' && !chain.isStale;

  return (
    <div className="hero-live-readings" aria-label="Live route conditions">
      <span className="hero-live-reading">
        <span className="hero-live-reading-label">Tip</span>
        <strong>{chain.tipHeight != null ? whole.format(chain.tipHeight) : '—'}</strong>
      </span>
      <span className="hero-live-reading">
        <span className="hero-live-reading-label">Mempool</span>
        <strong>{chain.mempoolCount != null ? whole.format(chain.mempoolCount) : '—'}</strong>
      </span>
      <span className="hero-live-reading">
        <span className="hero-live-reading-label">Fast fee</span>
        <strong>{chain.fastestFee != null ? `${chain.fastestFee} s/vB` : '—'}</strong>
      </span>
      <span className={`hero-live-reading hero-live-reading--state ${live ? 'is-live' : ''}`}>
        <span className="hero-live-reading-label">Signal</span>
        <strong>{live ? 'LIVE' : chain.isStale ? 'LAST GOOD' : chain.status === 'offline' ? 'OFFLINE' : '…'}</strong>
      </span>
    </div>
  );
}
