import { useEffect, useState, type RefObject } from 'react';

export function useInViewport(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit,
): boolean {
  const [visible, setVisible] = useState(false);

  const root = options?.root ?? null;
  const rootMargin = options?.rootMargin ?? '';
  const threshold = options?.threshold ?? 0.15;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { root, rootMargin, threshold });

    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, root, rootMargin, threshold]);

  return visible;
}