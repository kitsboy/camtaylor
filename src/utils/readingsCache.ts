/**
 * The last reading each live panel actually received, kept so a panel can say "the live
 * read failed, this is the last one that worked — 14:05 PT" instead of emptying itself.
 *
 * Why this exists: on a phone, a dropped read used to blank the chart and print "offline",
 * which tells the reader nothing about the network when the network is fine and their
 * connection is not — and it threw away a real reading the browser had in hand seconds
 * earlier. What is *not* allowed here is invention: a cached reading is only ever served
 * with its own timestamp and labelled as the last good one, never as current, and it
 * expires rather than being kept alive indefinitely.
 *
 * sessionStorage, not localStorage: it is a reading for this browsing session, not
 * something to hand to the next visit hours later.
 */
const PREFIX = 'camtaylor-reading:';

export interface CachedReading<T> {
  value: T;
  at: number;
}

export function rememberReading<T>(key: string, value: T, at: number = Date.now()): void {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify({ value, at }));
  } catch {
    /* private mode, or a full store: the panel just has nothing to fall back to */
  }
}

export function recallReading<T>(key: string, maxAgeMs: number): CachedReading<T> | null {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedReading<T>;
    if (typeof parsed?.at !== 'number') return null;
    if (Date.now() - parsed.at > maxAgeMs) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Blocks are found every ten minutes; an hour keeps a reading useful without ageing it. */
export const BLOCK_READING_MAX_AGE = 60 * 60 * 1000;
export const PRICE_READING_MAX_AGE = 6 * 60 * 60 * 1000;
export const LIGHTNING_READING_MAX_AGE = 3 * 24 * 60 * 60 * 1000;
