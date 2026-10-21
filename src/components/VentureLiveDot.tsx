import { useReachability } from '../hooks/useReachability';

/**
 * A tiny live dot next to a venture's status. It answers a different, truthful
 * question than the business status ("Live" = the founder says it's out there):
 * "is the platform actually reachable in this browser right now?" — shown as
 * (live / could not verify), both honest states. Never renders a fabricate.
 */
export function VentureLiveDot({ url }: { url: string }) {
  const state = useReachability(url);
  return (
    <span
      className={`venture-live-dot venture-live-dot--${state}`}
      title={
        state === 'live'
          ? 'Reachable right now'
          : state === 'unreachable'
            ? 'Could not verify from this browser'
            : 'Checking…'
      }
      aria-label={
        state === 'live'
          ? 'Reachable right now'
          : state === 'unreachable'
            ? 'Could not verify from this browser'
            : 'Checking reachability'
      }
    />
  );
}
