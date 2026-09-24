import { useEffect } from 'react';

/** Cards that receive the pointer spotlight highlight. */
const SPOTLIGHT_SELECTOR = '.kit-card, .family-card, .service-card, .venture-card, .proof-row';

/**
 * Points a soft brand-coloured highlight at the cursor as it moves across cards.
 * Pointer-only, decorative, and skipped for reduced motion or touch devices.
 */
export function useCardSpotlight(): void {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    const resolveCard = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return target.closest<HTMLElement>(SPOTLIGHT_SELECTOR);
    };

    const handleMove = (event: PointerEvent) => {
      const card = resolveCard(event.target);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      card.style.setProperty('--spot-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      card.style.setProperty('--spot-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
      card.dataset.spot = 'on';
    };

    const handleLeave = (event: PointerEvent) => {
      const card = resolveCard(event.target);
      if (!card) return;
      const next = event.relatedTarget;
      if (next instanceof Node && card.contains(next)) return;
      delete card.dataset.spot;
    };

    document.addEventListener('pointermove', handleMove, { passive: true });
    document.addEventListener('pointerout', handleLeave, { passive: true });
    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerout', handleLeave);
    };
  }, []);
}
