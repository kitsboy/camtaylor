import { useEffect, useState } from 'react';
import { readChain, subscribeBoard } from '../utils/signalBoard';

const PACIFIC = 'America/Vancouver';

function formatPacific(epochMs: number | null): string {
  if (epochMs == null) return 'never read';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PACIFIC,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(epochMs));
}

/**
 * The one, shared answer to "how fresh is the live signal right now?" — pulled
 * from the same board the nav chip and every reading read, so the footer cannot
 * drift into a second, quieter source of numbers. Renders the PT time the
 * current chain reading was actually received, or an honest "never read".
 */
export function useBoardFreshness(): { chip: string; lastReadPt: string } {
  const [stamp, setStamp] = useState(() => {
    const chain = readChain();
    return { chip: chain.isStale ? 'stale' : chain.status, at: chain.updatedAt };
  });

  useEffect(
    () =>
      subscribeBoard(() => {
        const chain = readChain();
        setStamp({
          chip: chain.isStale ? 'stale' : chain.status,
          at: chain.updatedAt,
        });
      }),
    [],
  );

  return { chip: stamp.chip, lastReadPt: formatPacific(stamp.at) };
}
