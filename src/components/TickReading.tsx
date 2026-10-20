import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface TickReadingProps {
  value: number | null;
  format: (value: number) => string;
}

/**
 * Shows a reading. When the number changes and motion is allowed, the digits
 * walk from the previous real reading to the new one. The accessible name is
 * always the destination, never an in-between frame. First paint does not
 * count up from zero.
 */
export const TickReading: React.FC<TickReadingProps> = ({ value, format }) => {
  const reduced = useReducedMotion();
  const fromRef = useRef<number | null>(null);
  const [shown, setShown] = useState<number | null>(value);

  useEffect(() => {
    if (value == null) {
      fromRef.current = null;
      setShown(null);
      return;
    }

    const from = fromRef.current;
    const snap = () => {
      fromRef.current = value;
      setShown(value);
    };

    if (reduced || from == null || from === value || document.hidden) {
      snap();
      return;
    }

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      if (document.hidden) {
        snap();
        return;
      }
      const t = Math.min(1, (now - start) / 420);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);

  if (value == null || shown == null) return <>—</>;

  return (
    <>
      <span className="sr-only">{format(value)}</span>
      <span aria-hidden="true">{format(shown)}</span>
    </>
  );
};
