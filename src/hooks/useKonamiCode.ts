import { useEffect } from 'react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode(onMatch: () => void): void {
  useEffect(() => {
    let index = 0;

    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[index]) {
        index += 1;
        if (index === SEQUENCE.length) {
          index = 0;
          onMatch();
        }
      } else {
        index = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onMatch]);
}