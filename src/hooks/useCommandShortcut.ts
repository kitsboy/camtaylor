import { useEffect } from 'react';

const TYPING_TAGS = ['INPUT', 'TEXTAREA', 'SELECT'];

/**
 * Opens the Command Deck from anywhere: `/` for the keyboard-first crowd,
 * `⌘K` / `Ctrl+K` for everyone else. Typing inside a field is left alone.
 */
export function useCommandShortcut(onToggle: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isCommandK) {
        event.preventDefault();
        onToggle();
        return;
      }

      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || TYPING_TAGS.includes(target.tagName))) return;
      event.preventDefault();
      onToggle();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);
}
