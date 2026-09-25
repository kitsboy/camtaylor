import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface SectionFoldProps {
  /** How many items stay visible on a phone before the fold. */
  shown: number;
  /** What is behind the fold, for the label: "6 more routes". */
  noun: string;
  /**
   * The class the folded items land back into, so they keep the layout the
   * section already gave them. The fold is a wrapper for the reader, not a
   * change of design.
   */
  bodyClassName: string;
  /** `<li>` when the parent is a list, so the markup stays valid. */
  as?: 'div' | 'li';
  children: React.ReactNode;
}

/**
 * The phone page is about 27 screens long, and its length is spread across every
 * section rather than sitting in one place, so no single rewrite shortens it.
 * What does shorten it is not dumping every list at full depth: a phone shows the
 * first few items and the rest wait behind one honest control.
 *
 * `<details>` does the disclosure, so the keyboard and screen readers get it for
 * free and the label states the count. On a desktop this renders nothing at all
 * — no wrapper, no `<details>`, no split — because that page is 15,000px and
 * already fine, and splitting a two-column list at an odd number would leave one
 * card alone in its row.
 *
 * The folded items stay mounted, so the list is in the DOM whether or not it is
 * open — `device-qa.spec.ts` opens a fold, scrolls the revealed items into view
 * and asserts none of them is left invisible, because a reveal animation that
 * waits for an element to scroll into view is exactly how the ventures carousel
 * ended up stranding cards at `opacity: 0`.
 */
export const SectionFold: React.FC<SectionFoldProps> = ({
  shown,
  noun,
  bodyClassName,
  as = 'div',
  children,
}) => {
  const isPhone = useMediaQuery('(max-width: 768px)');
  const items = React.Children.toArray(children);
  const [open, setOpen] = useState(false);

  // A phone starts folded and a desktop does not fold at all.
  useEffect(() => {
    setOpen(false);
  }, [isPhone]);

  if (!isPhone) return <>{items}</>;

  const head = items.slice(0, shown);
  const rest = items.slice(shown);
  // A fold that hides one item costs a tap and a whole control to save one card's
  // height, so at that point the reader keeps everything. `SERVICES` has four
  // areas against `shown={3}`, which is exactly this case.
  if (rest.length < 2) return <>{items}</>;

  // `noun` is written plural ("routes", "dispatches") because that is how the
  // sections name themselves; the fold only ever holds two or more, but the
  // label should not be able to lie if a section drops to one.
  const label = rest.length === 1 ? noun.replace(/s$/, '') : noun;

  const details = (
    <details
      className="section-fold-details"
      open={open}
      onToggle={(event) => setOpen((event.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="section-fold-summary">
        <span className="section-fold-count">{rest.length}</span>{' '}
        more {label} · tap to unfold
      </summary>
      <div className={bodyClassName}>{rest}</div>
    </details>
  );

  return (
    <>
      {head}
      {as === 'li' ? <li className="section-fold">{details}</li> : <div className="section-fold">{details}</div>}
    </>
  );
};
