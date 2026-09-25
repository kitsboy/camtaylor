import { useCallback, useEffect, useRef, useState } from 'react';
import { LIVE_SIGNAL_SOURCE } from '../data/liveSignal';
import { readJson } from '../utils/readJson';
import { BLOCK_READING_MAX_AGE, recallReading, rememberReading } from '../utils/readingsCache';

export interface LiveBlock {
  height: number;
  timestamp: number;
  txCount: number;
  medianFee: number;
}

export interface LiveFees {
  fastest: number;
  halfHour: number;
  hour: number;
  economy: number;
}

export type LiveStatus = 'connecting' | 'live' | 'offline';

interface RawBlock {
  height: number;
  timestamp: number;
  tx_count: number;
  extras?: { medianFee?: number };
}

interface RawFees {
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
  economyFee?: number;
}

interface RawMempool {
  count: number;
  vsize: number;
}

const BLOCK_SAMPLE = 14;

/**
 * Reads the last few Bitcoin blocks, the recommended fee tiers, and the current
 * mempool backlog. Every value is a raw reading; nothing is estimated locally.
 * If the block read fails the whole panel reports offline rather than plotting a
 * memory of the last run.
 */
interface BlockReading {
  blocks: LiveBlock[];
  fees: LiveFees | null;
  mempool: RawMempool | null;
}

export function useLiveBitcoinSignal() {
  const [status, setStatus] = useState<LiveStatus>('connecting');
  const [blocks, setBlocks] = useState<LiveBlock[]>([]);
  const [fees, setFees] = useState<LiveFees | null>(null);
  const [mempool, setMempool] = useState<RawMempool | null>(null);
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
    setStatus('connecting');

    const [blockResult, feeResult, mempoolResult] = await Promise.allSettled([
      readJson<RawBlock[]>(LIVE_SIGNAL_SOURCE.blocks, controller.signal),
      readJson<RawFees>(LIVE_SIGNAL_SOURCE.fees, controller.signal),
      readJson<RawMempool>(LIVE_SIGNAL_SOURCE.mempool, controller.signal),
    ]);

    if (!mounted.current) return;

    const readFees = (): LiveFees | null =>
      feeResult.status === 'fulfilled'
        ? {
            fastest: feeResult.value.fastestFee,
            halfHour: feeResult.value.halfHourFee,
            hour: feeResult.value.hourFee,
            economy: feeResult.value.economyFee ?? feeResult.value.hourFee,
          }
        : null;

    if (blockResult.status === 'fulfilled' && Array.isArray(blockResult.value)) {
      const samples = blockResult.value
        .slice(0, BLOCK_SAMPLE)
        .map((block) => ({
          height: block.height,
          timestamp: block.timestamp,
          txCount: block.tx_count,
          medianFee: block.extras?.medianFee ?? 0,
        }))
        .reverse();
      const nextFees = readFees();
      const nextMempool = mempoolResult.status === 'fulfilled' ? mempoolResult.value : null;
      setBlocks(samples);
      setFees(nextFees);
      setMempool(nextMempool);
      setStatus(samples.length > 1 ? 'live' : 'offline');
      setIsStale(false);
      const now = Date.now();
      setUpdatedAt(now);
      rememberReading<BlockReading>('blocks', { blocks: samples, fees: nextFees, mempool: nextMempool }, now);
      return;
    }

    // The read failed. Fall back to the last reading this browser actually received,
    // labelled as such and with its own timestamp — never presented as current.
    const cached = recallReading<BlockReading>('blocks', BLOCK_READING_MAX_AGE);
    if (cached && cached.value.blocks.length > 1) {
      setBlocks(cached.value.blocks);
      setFees(cached.value.fees);
      setMempool(cached.value.mempool);
      setUpdatedAt(cached.at);
      setStatus('live');
      setIsStale(true);
      return;
    }

    setBlocks([]);
    setFees(readFees());
    setMempool(mempoolResult.status === 'fulfilled' ? mempoolResult.value : null);
    setStatus('offline');
    setIsStale(false);
    setUpdatedAt(Date.now());
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, blocks, fees, mempool, updatedAt, isStale, refresh };
}
