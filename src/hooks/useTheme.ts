import { useEffect, useState } from 'react';

type Theme = 'warm' | 'night';

const STORAGE_KEY = 'camtaylor-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'warm';
    return (localStorage.getItem(STORAGE_KEY) as Theme) || 'warm';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'night' ? '#12100e' : '#ddd6cb');
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'warm' ? 'night' : 'warm'));

  return { theme, toggle, isNight: theme === 'night' };
}