/**
 * The latest chain and price readings the homepage hooks have actually received.
 * Navbar and the Command Deck read this instead of fetching again, so a chip or
 * a /fee reply can never be a second, quieter source of numbers.
 *
 * A field is null until a read lands. Callers must print that as "not read" or
 * "—", never as zero.
 */

export type ReadingStatus = 'connecting' | 'live' | 'offline';

export interface ChainSnapshot {
  status: ReadingStatus;
  isStale: boolean;
  updatedAt: number | null;
  tipHeight: number | null;
  mempoolCount: number | null;
  mempoolVsize: number | null;
  fastestFee: number | null;
}

export interface PriceSnapshot {
  status: ReadingStatus;
  isStale: boolean;
  updatedAt: number | null;
  closeUsd: number | null;
  satsPerUsd: number | null;
}

const EMPTY_CHAIN: ChainSnapshot = {
  status: 'connecting',
  isStale: false,
  updatedAt: null,
  tipHeight: null,
  mempoolCount: null,
  mempoolVsize: null,
  fastestFee: null,
};

const EMPTY_PRICE: PriceSnapshot = {
  status: 'connecting',
  isStale: false,
  updatedAt: null,
  closeUsd: null,
  satsPerUsd: null,
};

let chain: ChainSnapshot = EMPTY_CHAIN;
let price: PriceSnapshot = EMPTY_PRICE;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function publishChain(next: ChainSnapshot) {
  chain = next;
  emit();
}

export function publishPrice(next: PriceSnapshot) {
  price = next;
  emit();
}

export function readChain(): ChainSnapshot {
  return chain;
}

export function readPrice(): PriceSnapshot {
  return price;
}

export function subscribeBoard(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export type SignalChip = 'connecting' | 'live' | 'stale' | 'offline';

/** What the nav chip may say. A refresh in flight keeps the last honest state. */
export function chipFromChain(snapshot: ChainSnapshot): SignalChip {
  if (snapshot.isStale) return 'stale';
  if (snapshot.status === 'offline') return 'offline';
  if (snapshot.status === 'live' || snapshot.tipHeight != null) return 'live';
  return 'connecting';
}
