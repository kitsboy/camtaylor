import { Mountain, TrendingUp, TrendingDown } from 'lucide-react';
import { useDifficultySignal } from '../hooks/useDifficultySignal';

const whole = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });
const pct = new Intl.NumberFormat('en-CA', { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'always' });

function formatRemaining(seconds: number | null): string {
  if (seconds == null) return '—';
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

/**
 * The next pitch on the climb — a live difficulty-adjustment countdown.
 * Honest: progress and change come straight from mempool.space; a failed read
 * shows the last reading with its own timestamp, never a guess.
 */
export function DifficultyClimb() {
  const {
    status,
    isStale,
    updatedAt,
    progressPercent,
    difficultyChange,
    remainingBlocks,
    remainingTime,
    nextRetargetHeight,
    refresh,
  } = useDifficultySignal();

  const progress = progressPercent != null ? Math.min(100, Math.max(0, progressPercent)) : null;
  const change = difficultyChange != null ? difficultyChange : null;
  const up = change != null && change >= 0;

  return (
    <div className="climb-panel">
      <div className="climb-head">
        <span>
          <Mountain size={13} /> The next pitch
        </span>
        <span className="climb-range">
          {nextRetargetHeight ? `retarget at block ${whole.format(nextRetargetHeight)}` : 'difficulty adjustment'}
        </span>
      </div>

      <div className="climb-progress" role="img" aria-label={`Difficulty adjustment ${progress != null ? Math.round(progress) : 0} percent complete`}>
        <div className="climb-progress-track">
          <div className="climb-progress-fill" style={{ width: `${progress ?? 0}%` }} />
        </div>
        <span className="climb-progress-label">
          {progress != null ? `${Math.round(progress)}%` : status === 'connecting' ? 'reading…' : '—'}
        </span>
      </div>

      <div className="climb-stats">
        <div className="climb-stat">
          <span className="climb-stat-label">Change</span>
          <strong className={up ? 'climb-stat--up' : 'climb-stat--down'}>
            {change != null ? pct.format(change) : '—'}
            {change != null ? (up ? <TrendingUp size={13} /> : <TrendingDown size={13} />) : null}
          </strong>
          <small>vs last retarget</small>
        </div>
        <div className="climb-stat">
          <span className="climb-stat-label">Blocks left</span>
          <strong>{remainingBlocks != null ? whole.format(remainingBlocks) : '—'}</strong>
          <small>to the next pitch</small>
        </div>
        <div className="climb-stat">
          <span className="climb-stat-label">Est. time</span>
          <strong>{formatRemaining(remainingTime)}</strong>
          <small>at current pace</small>
        </div>
      </div>

      <p className="climb-note">
        Difficulty adjustment from mempool.space. Progress and change are shown as returned —
        a reading, not a forecast.
        {isStale && updatedAt
          ? ` Last read ${new Date(updatedAt).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Vancouver' })} PT.`
          : ''}
      </p>
      <button type="button" className="climb-refresh" onClick={() => void refresh()} disabled={status === 'connecting'}>
        Refresh
      </button>
    </div>
  );
}
