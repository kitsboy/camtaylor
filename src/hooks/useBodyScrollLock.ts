import { useEffect } from 'react';

/** Locks body scroll without position:fixed (avoids scroll-jank on iOS menu close) */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { style } = document.body;
    const prevOverflow = style.overflow;
    const prevTouchAction = style.touchAction;

    style.overflow = 'hidden';
    style.touchAction = 'none';

    return () => {
      style.overflow = prevOverflow;
      style.touchAction = prevTouchAction;
    };
  }, [locked]);
}