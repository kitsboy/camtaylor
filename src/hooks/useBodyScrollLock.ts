import { useEffect } from 'react';

/**
 * Locks the page behind an overlay without `position: fixed` (avoids scroll-jank
 * on iOS when the overlay closes).
 *
 * This used to also set `touch-action: none` on `<body>`. That reads as a
 * harmless belt-and-braces, but touch-action is not scoped to the element it is
 * set on: the browser intersects it with the ancestors of whatever you are
 * touching, so a `touch-action: none` body makes every descendant unscrollable
 * by touch too. The route sheet menu is taller than a phone screen, so the
 * effect was a twelve-item list you could not swipe — the body was locked, and
 * so, accidentally, was the menu.
 *
 * `overflow: hidden` on the body is enough to hold the page still, and the
 * overlay owns its own scrolling with `overscroll-behavior: contain`.
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const { style } = document.body;
    const prevOverflow = style.overflow;

    style.overflow = 'hidden';

    return () => {
      style.overflow = prevOverflow;
    };
  }, [locked]);
}
