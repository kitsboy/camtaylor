import { useEffect, useState } from 'react';

type Theme = 'warm' | 'night';

export const THEME_STORAGE_KEY = 'camtaylor-theme';
const NIGHT_META = '#12100e';
const WARM_META = '#ddd6cb';

/**
 * The theme is *resolved* before React runs — `index.html` has an inline script that
 * reads the stored choice, falls back to `prefers-color-scheme`, and sets
 * `data-theme` on `<html>` before the first paint. This hook starts from whatever that
 * script decided, which is why a night reader no longer sees a warm flash on load.
 *
 * Two rules keep that true:
 *   - the hook must not persist anything on mount, or the first visit (which is the
 *     operating system's preference, not a choice) would freeze that preference
 *     forever;
 *   - only a toggle writes to storage, because only a toggle is a decision.
 */
function resolveTheme(): Theme {
  if (typeof document === 'undefined') return 'warm';
  const applied = document.documentElement.dataset.theme;
  if (applied === 'night' || applied === 'warm') return applied;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'night';
  }
  return 'warm';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(resolveTheme);
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'night' ? NIGHT_META : WARM_META);
    // Only a toggle is a decision worth remembering — see the note above.
    if (chosen) localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, chosen]);

  const toggle = () => {
    setChosen(true);
    setTheme((current) => (current === 'warm' ? 'night' : 'warm'));
  };

  return { theme, toggle, isNight: theme === 'night' };
}
