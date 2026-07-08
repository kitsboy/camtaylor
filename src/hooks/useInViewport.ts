import { useEffect, useState, type RefObject } from 'react';

export function useInViewport(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit,
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { threshold: 0.15, ...options });

    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, options?.root, options?.rootMargin, options?.threshold]);

  return visible;
}