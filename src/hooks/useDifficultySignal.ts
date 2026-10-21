import { useCallback, useEffect, useRef, useState } from 'react';
import { LIVE_SIGNAL_SOURCE } from '../data/liveSignal';

export interface DifficultyReading {
  status: 'connecting' | 'live' | 'offline';
  isStale: boolean;
  updatedAt: number | null;
  progressPercent: number | null;
  difficultyChange: number | null;
  remainingBlocks: number | null;
  remainingTime: number | null;
  nextRetargetHeight: number | null;
  previousRetarget: number | null;
}

const EMPTY: DifficultyReading = {
  status: 'connecting',
  isStale: false,
  updatedAt: null,
  progressPercent: null,
  difficultyChange: null,
  remainingBlocks: null,
  remainingTime: null,
  nextRetargetHeight: null,
  previousRetarget: null,
};

const STALE_MS = 60_000;

/**
 * Live difficulty-adjustment countdown from mempool.space.
 * Honest by design: a failed read keeps the last reading with its own timestamp
 * and marks it stale — never a remembered number dressed as current.
 */
export function useDifficultySignal() {
  const [reading, setReading] = useState<DifficultyReading>(EMPTY);
  const timer = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${LIVE_SIGNAL_SOURCE.home}/api/v1/difficulty-adjustment`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        progressPercent?: number;
        difficultyChange?: number;
        remainingBlocks?: number;
        remainingTime?: number;
        nextRetargetHeight?: number;
        previousRetarget?: number;
      };
      setReading((prev) => ({
        status: 'live',
        isStale: false,
        updatedAt: Date.now(),
        progressPercent: typeof data.progressPercent === 'number' ? data.progressPercent : prev.progressPercent,
        difficultyChange: typeof data.difficultyChange === 'number' ? data.difficultyChange : prev.difficultyChange,
        remainingBlocks: typeof data.remainingBlocks === 'number' ? data.remainingBlocks : prev.remainingBlocks,
        remainingTime: typeof data.remainingTime === 'number' ? data.remainingTime : prev.remainingTime,
        nextRetargetHeight: typeof data.nextRetargetHeight === 'number' ? data.nextRetargetHeight : prev.nextRetargetHeight,
        previousRetarget: typeof data.previousRetarget === 'number' ? data.previousRetarget : prev.previousRetarget,
      }));
    } catch {
      setReading((prev) => ({
        ...prev,
        status: prev.updatedAt ? 'live' : 'offline',
        isStale: prev.updatedAt ? Date.now() - prev.updatedAt > STALE_MS : false,
      }));
    }
  }, []);

  useEffect(() => {
    void refresh();
    timer.current = window.setInterval(() => {
      // Pause polling when the tab is hidden — no point fetching for a reader
      // who can't see it, and it keeps the network quiet.
      if (document.visibilityState === 'visible') void refresh();
    }, 30_000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [refresh]);

  return { ...reading, refresh };
}
