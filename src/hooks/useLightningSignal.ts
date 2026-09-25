import { useCallback, useEffect, useRef, useState } from 'react';
import { LIVE_SIGNAL_SOURCE } from '../data/liveSignal';
import { readJson } from '../utils/readJson';
import {
  LIGHTNING_READING_MAX_AGE,
  recallReading,
  rememberReading,
} from '../utils/readingsCache';

export interface LightningSnapshot {
  at: number;
  capacity: number;
  channels: number;
  torNodes: number;
  clearnetNodes: number;
  unannouncedNodes: number;
}

export type LightningStatus = 'connecting' | 'live' | 'offline';

interface RawSnapshot {
  added: number | string;
  channel_count: number;
  total_capacity: number;
  tor_nodes?: number;
  clearnet_nodes?: number;
  unannounced_nodes?: number;
}

const MAX_SAMPLES = 30;

function toMillis(added: number | string) {
  return typeof added === 'number' ? added * 1000 : Date.parse(added);
}

/**
 * Public Lightning network snapshots. It is a daily series, so it is read once
 * and never re-timed like the block feed. If the series is missing or too short
 * to plot, the panel says so instead of drawing a single point as a trend.
 */
export function useLightningSignal() {
  const [status, setStatus] = useState<LightningStatus>('connecting');
  const [samples, setSamples] = useState<LightningSnapshot[]>([]);
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
    try {
      const raw = await readJson<RawSnapshot[]>(LIVE_SIGNAL_SOURCE.lightningSeries, controller.signal);
      if (!mounted.current) return;
      const next = (Array.isArray(raw) ? raw : [])
        .map((entry) => ({
          at: toMillis(entry.added),
          capacity: entry.total_capacity,
          channels: entry.channel_count,
          torNodes: entry.tor_nodes ?? 0,
          clearnetNodes: entry.clearnet_nodes ?? 0,
          unannouncedNodes: entry.unannounced_nodes ?? 0,
        }))
        .filter((entry) => Number.isFinite(entry.at) && entry.capacity > 0)
        .sort((a, b) => a.at - b.at)
        .slice(-MAX_SAMPLES);
      setSamples(next);
      setStatus(next.length > 1 ? 'live' : 'offline');
      setIsStale(false);
      if (next.length > 1) rememberReading<LightningSnapshot[]>('lightning', next);
    } catch {
      if (!mounted.current) return;
      // A daily series does not stop being true because one read failed; serve the last
      // snapshot set this browser received, and let the panel say it is the last one.
      const cached = recallReading<LightningSnapshot[]>('lightning', LIGHTNING_READING_MAX_AGE);
      if (cached && cached.value.length > 1) {
        setSamples(cached.value);
        setStatus('live');
        setIsStale(true);
        return;
      }
      setSamples([]);
      setStatus('offline');
      setIsStale(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { status, samples, isStale, refresh };
}
