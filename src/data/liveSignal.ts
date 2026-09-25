/**
 * Live signal — raw Bitcoin network readings from a public, keyless API.
 *
 * Honesty rules for anything driven by this module:
 *   1. Never invent a number. If a read fails, show the offline state instead.
 *   2. Always name the source in the UI.
 *   3. Never smooth, guess, or project — these are readings, not forecasts.
 */
export const LIVE_SIGNAL_SOURCE = {
  name: 'mempool.space',
  home: 'https://mempool.space',
  blocks: 'https://mempool.space/api/v1/blocks',
  fees: 'https://mempool.space/api/v1/fees/recommended',
  mempool: 'https://mempool.space/api/mempool',
  lightningSeries: 'https://mempool.space/api/v1/lightning/statistics/3m',
  priceCandles: 'https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=3600',
  priceRates: 'https://mempool.space/api/v1/prices',
} as const;

export const PRICE_COPY = {
  title: 'Sats per dollar',
  chartLabel: 'Sats per dollar over the last hourly closes',
  note: 'Hourly BTC-USD closes from the Coinbase Exchange public API. CAD is that series converted at the live mempool.space USD→CAD rate. Sats per dollar is 100,000,000 ÷ price — one spot market reading, not advice.',
  empty: 'Price candles are not available from this browser right now.',
  connecting: 'Reading price candles…',
  noRate: 'Live USD→CAD rate unavailable',
} as const;

export const PRICE_QUOTES = [
  { code: 'USD', symbol: '$', perLabel: 'Sats per $1' },
  { code: 'CAD', symbol: 'C$', perLabel: 'Sats per C$1' },
] as const;

export type PriceQuote = (typeof PRICE_QUOTES)[number]['code'];

export const LIGHTNING_COPY = {
  title: 'Lightning capacity',
  chartLabel: 'Public Lightning channel capacity over the snapshot window',
  note: 'Daily mempool.space Lightning snapshots. Public, announced network only — private and unannounced channels cannot be counted here.',
  empty: 'Lightning snapshots are not available from this browser right now.',
  connecting: 'Reading Lightning snapshots…',
} as const;

export const LIVE_SIGNAL_COPY = {
  kicker: 'LIVE SIGNAL / BITCOIN ROUTE',
  title: 'Live from the mempool.',
  subtitle:
    'Raw readings straight off the Bitcoin network, pulled in the browser from a public API. No key, no smoothing. If a read fails, the panel says so and shows the last reading it did receive — with that reading\u2019s own timestamp, never as if it were current.',
  chartLabel: 'Transactions per block',
  note: `Read live from the ${LIVE_SIGNAL_SOURCE.name} public API. If the read fails, this panel says so rather than showing a guess. Readings, not advice.`,
  offline: 'Live signal offline — this browser could not reach the public API.',
} as const;

export const ROUTE_CONDITIONS = [
  'PROOF OVER PROMISE',
  'BASE CAMP / BRITISH COLUMBIA',
  'KEEP THE KEYS',
  'PROOF-FIRST PRACTICE',
  'NOSTR: cam@giveabit.io',
] as const;
