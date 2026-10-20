import { useEffect, useState } from 'react';
import { chipFromChain, readChain, subscribeBoard, type SignalChip } from '../utils/signalBoard';

export type { SignalChip };

/** The nav chip. Starts at CONNECTING until the chain hook publishes a real read. */
export function useSignalChip(): SignalChip {
  const [chip, setChip] = useState<SignalChip>(() => chipFromChain(readChain()));

  useEffect(() => subscribeBoard(() => setChip(chipFromChain(readChain()))), []);

  return chip;
}
