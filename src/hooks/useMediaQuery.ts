import { useEffect, useState } from 'react';

/**
 * Subscribes to a media query. Used where a *layout decision* has to be made in
 * JavaScript rather than in CSS — currently the section fold, which has to know
 * whether it is on a phone before it decides how much of a list to show.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);

    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
