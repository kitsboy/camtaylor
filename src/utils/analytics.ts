import { PLAUSIBLE_DOMAIN } from '../data/site';

type PlausibleFn = (event: string, options?: { props?: Record<string, string> }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function trackEvent(name: string, props?: Record<string, string>): void {
  if (!PLAUSIBLE_DOMAIN) return;
  window.plausible?.(name, props ? { props } : undefined);
}