import { useEffect, useState } from 'react';

/** True while the tab is showing. New timers and loops should stop when this is false. */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(() =>
    typeof document === 'undefined' ? true : !document.hidden,
  );

  useEffect(() => {
    const apply = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', apply);
    return () => document.removeEventListener('visibilitychange', apply);
  }, []);

  return visible;
}
