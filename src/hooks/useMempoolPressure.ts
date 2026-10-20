import { useCallback, useEffect, useRef, useState } from 'react';
import { LIVE_SIGNAL_SOURCE } from '../data/liveSignal';
import { readJson } from '../utils/readJson';
import { PRESSURE_READING_MAX_AGE, recallReading, rememberReading } from '../utils/readingsCache';

/**
 * One projected block, as mempool.space returns it from
 * GET /api/v1/fees/mempool-blocks (verified 2026-10-20: CORS *, JSON array).
 *
 * Fields used, and only these: blockVSize, nTx, medianFee, feeRange[0],
 * feeRange[last]. Nothing here is estimated, smoothed, or filled in.
 */
export interface ProjectedBlock {
  blockVSize: number;
  nTx: number;
  medianFee: number;
  feeLow: number;
  feeHigh: number;
}

export interface PressureReading {
  blocks: ProjectedBlock[];
  /** Raw pending vbytes from /api/mempool. Null if that read failed. */
  vsize: number | null;
  /** Raw waiting-transaction count from /api/mempool. Null if that read failed. */
  count: number | null;
  /** How many projected blocks the endpoint returned, even if the strip shows fewer. */
  projectedCount: number;
}

export type PressureStatus = 'connecting' | 'live' | 'offline';

interface RawProjected {
  blockVSize?: unknown;
  nTx?: unknown;
  medianFee?: unknown;
  feeRange?: unknown;
}

interface RawMempool {
  count?: unknown;
  vsize?: unknown;
}

const POLL_MS = 60_000;
/** The strip stays readable. A longer list is counted, not cropped in silence. */
export const PRESSURE_STRIP_CAP = 8;
/** Consensus max block weight / 4. Bar scale only. Never printed as a reading. */
export const BLOCK_WEIGHT_VBYTES = 1_000_000;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function parseBlocks(raw: unknown): { blocks: ProjectedBlock[]; projectedCount: number } | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const blocks: ProjectedBlock[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const row = item as RawProjected;
    const range = Array.isArray(row.feeRange) ? row.feeRange.filter(isFiniteNumber) : [];
    if (!isFiniteNumber(row.blockVSize) || !isFiniteNumber(row.nTx) || !isFiniteNumber(row.medianFee) || range.length < 2) {
      return null;
    }
    blocks.push({
      blockVSize: row.blockVSize,
      nTx: row.nTx,
      medianFee: row.medianFee,
      feeLow: range[0],
      feeHigh: range[range.length - 1],
    });
  }
  return { blocks, projectedCount: blocks.length };
}

export function useMempoolPressure() {
  const [status, setStatus] = useState<PressureStatus>('connecting');
  const [reading, setReading] = useState<PressureReading | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [isStale, setIsStale] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    const controller = new AbortController();
    setStatus((current) => (current === 'live' ? current : 'connecting'));

    const [blockResult, mempoolResult] = await Promise.allSettled([
      readJson<unknown>(LIVE_SIGNAL_SOURCE.mempoolBlocks, controller.signal),
      readJson<RawMempool>(LIVE_SIGNAL_SOURCE.mempool, controller.signal),
    ]);

    if (!mounted.current) return;

    const parsed = blockResult.status === 'fulfilled' ? parseBlocks(blockResult.value) : null;
    const mempool = mempoolResult.status === 'fulfilled' ? mempoolResult.value : null;
    const vsize = mempool && isFiniteNumber(mempool.vsize) ? mempool.vsize : null;
    const count = mempool && isFiniteNumber(mempool.count) ? mempool.count : null;

    if (parsed) {
      const next: PressureReading = {
        blocks: parsed.blocks.slice(0, PRESSURE_STRIP_CAP),
        vsize,
        count,
        projectedCount: parsed.projectedCount,
      };
      const now = Date.now();
      setReading(next);
      setStatus('live');
      setIsStale(false);
      setUpdatedAt(now);
      rememberReading<PressureReading>('pressure', next, now);
      return;
    }

    const cached = recallReading<PressureReading>('pressure', PRESSURE_READING_MAX_AGE);
    if (cached && cached.value.blocks.length > 0) {
      setReading(cached.value);
      setUpdatedAt(cached.at);
      setStatus('live');
      setIsStale(true);
      return;
    }

    setReading(null);
    setStatus('offline');
    setIsStale(false);
    setUpdatedAt(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Poll only while the tab is visible. A hidden tab does not keep asking.
  useEffect(() => {
    let timer: number | null = null;
    const stop = () => {
      if (timer != null) window.clearInterval(timer);
      timer = null;
    };
    const start = () => {
      stop();
      if (document.hidden) return;
      timer = window.setInterval(() => {
        if (!document.hidden) void refresh();
      }, POLL_MS);
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
        return;
      }
      void refresh();
      start();
    };
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [refresh]);

  return { status, reading, updatedAt, isStale, refresh };
}
