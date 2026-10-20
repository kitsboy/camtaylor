import React from 'react';
import { Gauge } from 'lucide-react';
import { PRESSURE_COPY } from '../data/liveSignal';
import { usePageVisible } from '../hooks/usePageVisible';
import {
  BLOCK_WEIGHT_VBYTES,
  type PressureReading,
  type PressureStatus,
} from '../hooks/useMempoolPressure';

const counts = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const fees = new Intl.NumberFormat('en-CA', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

function clock(at: number) {
  return new Date(at).toLocaleTimeString('en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Vancouver',
  });
}

interface MempoolPressureProps {
  status: PressureStatus;
  reading: PressureReading | null;
  updatedAt: number | null;
  isStale: boolean;
}

export const MempoolPressure: React.FC<MempoolPressureProps> = ({ status, reading, updatedAt, isStale }) => {
  const visible = usePageVisible();
  const live = status === 'live' && reading != null && reading.blocks.length > 0;
  const stateLabel = isStale ? 'LAST GOOD' : status === 'live' ? 'LIVE' : status === 'connecting' ? 'CONNECTING' : 'OFFLINE';
  const next = reading?.blocks[0] ?? null;
  const asOf = updatedAt != null
    ? isStale
      ? `last good as of ${clock(updatedAt)} PT, not current`
      : `as of ${clock(updatedAt)} PT`
    : null;

  const stripLabel = live && next
    ? `${reading.projectedCount} projected blocks from mempool.space. Next block: ${counts.format(next.nTx)} transactions, median fee ${fees.format(next.medianFee)} sats per vB, ${counts.format(next.blockVSize)} vB.`
    : 'Mempool pressure has no projected blocks to show.';

  return (
    <div className={`pressure${visible ? '' : ' is-paused'}`} aria-label="Mempool pressure">
      <div className="pressure-head">
        <span className="pressure-title">
          <Gauge size={13} aria-hidden="true" /> {PRESSURE_COPY.title}
        </span>
        <span className={`pressure-state pressure-state--${isStale ? 'stale' : status}`}>
          <span className="pressure-dot" aria-hidden="true" />
          {stateLabel}
          {asOf ? <small className="pressure-asof">{asOf}</small> : null}
        </span>
      </div>

      {live && reading ? (
        <svg
          className="pressure-strip"
          viewBox={`0 0 ${reading.blocks.length * 40} 72`}
          role="img"
          aria-label={stripLabel}
        >
          {reading.blocks.map((block, index) => {
            const fill = Math.min(1, Math.max(0, block.blockVSize / BLOCK_WEIGHT_VBYTES));
            const x = index * 40 + 4;
            const h = Math.max(2, Math.round(fill * 56));
            return (
              <g key={`${block.blockVSize}-${block.nTx}-${index}`} className="pressure-tick">
                <rect x={x} y={8} width={28} height={56} rx={3} className="pressure-track" />
                <rect x={x} y={8 + (56 - h)} width={28} height={h} rx={3} className="pressure-fill" />
                <title>
                  {`Projected block ${index + 1}: ${counts.format(block.nTx)} txs, median ${fees.format(block.medianFee)} sats/vB, ${counts.format(block.blockVSize)} vB, fee span ${fees.format(block.feeLow)} to ${fees.format(block.feeHigh)}`}
                </title>
              </g>
            );
          })}
        </svg>
      ) : (
        <p className="pressure-empty">
          {status === 'connecting' ? PRESSURE_COPY.connecting : PRESSURE_COPY.empty}
        </p>
      )}

      <dl className="pressure-stats">
        <div>
          <dt>Pending vB</dt>
          <dd>{reading?.vsize != null ? counts.format(reading.vsize) : '—'}</dd>
        </div>
        <div>
          <dt>Projected blocks</dt>
          <dd>{reading ? counts.format(reading.projectedCount) : '—'}</dd>
        </div>
        <div>
          <dt>Next median</dt>
          <dd>{next ? `${fees.format(next.medianFee)} sats/vB` : '—'}</dd>
        </div>
        <div>
          <dt>Next txs</dt>
          <dd>{next ? counts.format(next.nTx) : '—'}</dd>
        </div>
      </dl>

      {reading && reading.projectedCount > reading.blocks.length ? (
        <p className="pressure-cap">
          Showing the first {reading.blocks.length} of {reading.projectedCount} projected blocks.
        </p>
      ) : null}

      <p className="pressure-note">{PRESSURE_COPY.note}</p>
    </div>
  );
};
