import { useEffect, useState } from 'react';
import { Orbit } from 'lucide-react';
import { subscribeBoard, readChain } from '../utils/signalBoard';

const whole = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

/**
 * The last-climb ticker — one breath of real chain data where the hero used to
 * draw decorative bars. Everything here is a read from the shared signal board,
 * so it can never be a second, quieter source of numbers. Missing fields show
 * "—", never a guess.
 */
export function LastClimbTicker() {
  const [, setTick] = useState(0);
  useEffect(() => subscribeBoard(() => setTick((t) => t + 1)), []);

  const chain = readChain();
  const stale = chain.isStale || chain.status === 'offline';

  const tip = chain.tipHeight != null ? `#${whole.format(chain.tipHeight)}` : '—';
  const fee = chain.fastestFee != null ? `${whole.format(chain.fastestFee)} s/vB` : '—';
  const mempool = chain.mempoolCount != null ? whole.format(chain.mempoolCount) : '—';

  return (
    <div className="intelligence-ticker" role="status" aria-live="polite" aria-label="Last climb readings">
      <span className="intelligence-ticker-item">
        <span className="intelligence-ticker-label">Tip</span>
        <strong>{tip}</strong>
      </span>
      <span className="intelligence-ticker-divider" aria-hidden="true" />
      <span className="intelligence-ticker-item">
        <span className="intelligence-ticker-label">Fast fee</span>
        <strong>{fee}</strong>
      </span>
      <span className="intelligence-ticker-divider" aria-hidden="true" />
      <span className="intelligence-ticker-item">
        <span className="intelligence-ticker-label">Mempool</span>
        <strong>{mempool}</strong>
      </span>
      <span className="intelligence-ticker-item intelligence-ticker-item--state">
        <Orbit size={12} />
        {stale ? 'LAST GOOD' : 'READING'}</span>
    </div>
  );
}