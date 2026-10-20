import { useCallback, useEffect, useRef, useState } from 'react';
import { LIVE_SIGNAL_SOURCE } from '../data/liveSignal';
import { readJson } from '../utils/readJson';
import { PRICE_READING_MAX_AGE, recallReading, rememberReading } from '../utils/readingsCache';
import { publishPrice } from '../utils/signalBoard';

export interface PriceSample {
  at: number;
  close: number;
  low: number;
  high: number;
}

export type PriceStatus = 'connecting' | 'live' | 'offline';

/** Coinbase candles arrive as [ time, low, high, open, close, volume ], newest first. */
type Candle = [number, number, number, number, number, number];

interface RawRates {
  USD?: number;
  CAD?: number;
}

const WINDOW_HOURS = 24;

/**
 * Hourly BTC-USD closes over the last day, plus the live USD→CAD rate used to
 * show the same series in Canadian dollars. Sats per dollar is derived from the
 * close (100,000,000 / price), never from a cached or rounded headline number.
 */
export function usePriceSignal() {
  const [status, setStatus] = useState<PriceStatus>('connecting');
  const [samples, setSamples] = useState<PriceSample[]>([]);
  const [cadRate, setCadRate] = useState<number | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
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

    const [candleResult, rateResult] = await Promise.allSettled([
      readJson<Candle[]>(LIVE_SIGNAL_SOURCE.priceCandles, controller.signal),
      readJson<RawRates>(LIVE_SIGNAL_SOURCE.priceRates, controller.signal),
    ]);

    if (!mounted.current) return;

    if (rateResult.status === 'fulfilled') {
      const { USD, CAD } = rateResult.value;
      setCadRate(USD && CAD ? CAD / USD : null);
    } else {
      setCadRate(null);
    }

    if (candleResult.status === 'fulfilled' && Array.isArray(candleResult.value)) {
      const next = candleResult.value
        .filter((candle) => Array.isArray(candle) && candle.length >= 5)
        .map((candle) => ({ at: candle[0] * 1000, low: candle[1], high: candle[2], close: candle[4] }))
        .filter((sample) => Number.isFinite(sample.at) && sample.close > 0)
        .sort((a, b) => a.at - b.at)
        .slice(-WINDOW_HOURS);
      setSamples(next);
      setStatus(next.length > 1 ? 'live' : 'offline');
      setIsStale(false);
      const now = Date.now();
      setUpdatedAt(now);
      rememberReading<PriceSample[]>('price', next, now);
      return;
    }

    const cached = recallReading<PriceSample[]>('price', PRICE_READING_MAX_AGE);
    if (cached && cached.value.length > 1) {
      setSamples(cached.value);
      setUpdatedAt(cached.at);
      setStatus('live');
      setIsStale(true);
      return;
    }

    setSamples([]);
    setStatus('offline');
    setIsStale(false);
    setUpdatedAt(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const latest = samples.length ? samples[samples.length - 1] : null;
    publishPrice({
      status,
      isStale,
      updatedAt,
      closeUsd: latest?.close ?? null,
      satsPerUsd: latest && latest.close > 0 ? 100_000_000 / latest.close : null,
    });
  }, [status, isStale, updatedAt, samples]);

  return { status, samples, cadRate, isStale, updatedAt, refresh };
}
