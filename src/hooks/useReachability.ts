import { useCallback, useEffect, useRef, useState } from 'react';

type Reachability = 'checking' | 'live' | 'unreachable';

/**
 * UL = single-origin reachability, reusing the same CORS-then-no-cors strategy
 * the Proof section uses. A site sending `Cross-Origin-Resource-Policy:
 * same-site` (giveabit.io, katoa.org) blocks a plain no-cors request, so we try
 * a CORS fetch first (their ACAO: * makes it succeed) and fall back to no-cors
 * for hosts without an allow-origin header. Honest: only a genuinely completed
 * request counts as "live".
 */
export function useReachability(url: string) {
  const [state, setState] = useState<Reachability>('checking');
  const timer = useRef<number | null>(null);

  const check = useCallback(async () => {
    setState('checking');
    try {
      await fetch(url, { mode: 'cors', cache: 'no-store' });
      setState('live');
      return;
    } catch {
      // fall through to no-cors
    }
    try {
      await fetch(url, { mode: 'no-cors', cache: 'no-store' });
      setState('live');
    } catch {
      setState('unreachable');
    }
  }, [url]);

  useEffect(() => {
    void check();
    // Quiet re-check every 60s (respect tab visibility so a hidden tab doesn't
    // churn the network).
    timer.current = window.setInterval(() => {
      if (document.visibilityState === 'visible') void check();
    }, 60_000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [check]);

  return state;
}
