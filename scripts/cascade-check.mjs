/**
 * Who wins, and who never runs.
 *
 * This site loads six stylesheets in a fixed order (`src/main.tsx`), which means
 * a rule written in the wrong one is not a style change — it is a declaration
 * that never applies, and nothing in a screenshot or a diff says so. Three of
 * them were found by hand: `mobile.css`'s `.hero-shell` padding, and
 * `index.css`'s `.manifesto-section` / `.contact-section` padding, all beaten by
 * a later file.
 *
 * So this computes the answer instead of remembering it. It is deliberately
 * conservative — it only compares *identical selector strings*, so it can never
 * invent a winner it did not read. It cannot see a loss to a more specific
 * selector (`.a .b` over `.b`), and it skips any at-rule it does not understand
 * (a `prefers-*` or `orientation` block is never evaluated), so a quiet run
 * means "nothing of the shape I can see", not "nothing".
 *
 * The question it answers is exact: at a phone width, for one selector and one
 * property, which declaration applies and which are dead?
 */
import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

/** The narrowest width the site supports, and the one the phone blocks target. */
export const PHONE_WIDTH = 768;

/** Reads the stylesheet order out of the entry module, so it cannot drift. */
export function stylesheetOrder(entry = 'src/main.tsx') {
  const source = readFileSync(entry, 'utf8');
  const dir = entry.replace(/\/[^/]+$/, '');
  return [...source.matchAll(/import\s+['"](\.[^'"]+\.css)['"]/g)]
    .map((match) => relative(process.cwd(), resolve(dir, match[1])));
}

function stripComments(css) {
  // Keep every newline so line numbers survive the removal.
  return css.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));
}

export function parseStylesheet(file, source = readFileSync(file, 'utf8')) {
  const css = stripComments(source);
  const lineAt = (index) => source.slice(0, index).split('\n').length;
  const rules = [];
  const atRules = [];
  let cursor = 0;
  let segmentStart = 0;

  while (cursor < css.length) {
    const char = css[cursor];
    if (char === '{') {
      const prelude = css.slice(segmentStart, cursor).trim();
      if (prelude.startsWith('@')) {
        atRules.push(prelude);
        cursor += 1;
        segmentStart = cursor;
        continue;
      }
      const close = css.indexOf('}', cursor);
      const body = css.slice(cursor + 1, close === -1 ? css.length : close);
      const baseLine = lineAt(cursor);
      const declarations = [];
      let offset = 0;
      for (const chunk of body.split(';')) {
        const declaration = chunk.trim();
        if (declaration) {
          const colon = declaration.indexOf(':');
          if (colon > 0) {
            const property = declaration.slice(0, colon).trim().toLowerCase();
            const value = declaration.slice(colon + 1).replace(/\s+/g, ' ').trim();
            const line = baseLine + body.slice(0, offset).split('\n').length - 1;
            if (property && value && !property.startsWith('--')) {
              for (const selector of prelude.split(',')) {
                const cleaned = selector.replace(/\s+/g, ' ').trim();
                if (cleaned) declarations.push({ selector: cleaned, property, value, line });
              }
            }
          }
        }
        offset += chunk.length + 1;
      }
      const media = atRules.filter((rule) => /^@(media|supports|layer)\b/.test(rule));
      for (const declaration of declarations) {
        rules.push({ ...declaration, file, media, line: declaration.line });
      }
      segmentStart = close === -1 ? css.length : close + 1;
      cursor = segmentStart;
      continue;
    }
    if (char === '}') {
      atRules.pop();
      cursor += 1;
      segmentStart = cursor;
      continue;
    }
    cursor += 1;
  }
  return rules;
}

/**
 * `true` / `false` when every condition is a plain width query, `null` when one
 * is not — and `null` means "do not judge this", never "it applies".
 */
function appliesAt(media, width) {
  for (const rule of media) {
    if (!rule.startsWith('@media')) return null;
    const condition = rule.slice(6).trim();
    const max = condition.match(/^\(\s*max-width:\s*(\d+(?:\.\d+)?)px\s*\)$/);
    if (max) {
      if (width > Number(max[1])) return false;
      continue;
    }
    const min = condition.match(/^\(\s*min-width:\s*(\d+(?:\.\d+)?)px\s*\)$/);
    if (min) {
      if (width < Number(min[1])) return false;
      continue;
    }
    return null;
  }
  return true;
}

const SIDES = ['top', 'right', 'bottom', 'left'];

/** One to four values, in the order CSS resolves them. Not a full shorthand engine. */
function expandBox(property, value) {
  const parts = value.split(/\s+/).filter(Boolean);
  if (parts.length === 0 || parts.length > 4) return null;
  const index = parts.length === 1 ? [0, 0, 0, 0]
    : parts.length === 2 ? [0, 1, 0, 1]
      : parts.length === 3 ? [0, 1, 2, 1]
        : [0, 1, 2, 3];
  return SIDES.map((side, position) => [`${property}-${side}`, parts[index[position]]]);
}

/**
 * The `font` shorthand, reduced to the three parts this project actually sets
 * through it: size, line-height and weight. `font: 700 var(--fs-2xs)/1 var(...)`
 * is the shape in this codebase.
 */
function expandFont(value) {
  const out = [];
  const weight = value.match(/(?:^|\s)(\d{3}|normal|bold|bolder|lighter)(?=\s|$|\/)/);
  if (weight) out.push(['font-weight', weight[1]]);
  const sizeAndHeight = value.match(/(?:^|\s)(\d*\.?\d+(?:rem|px|em|%|vw)|var\([^)]*\))(?:\s*\/\s*([^\s]+))?/);
  if (sizeAndHeight) {
    out.push(['font-size', sizeAndHeight[1]]);
    if (sizeAndHeight[2]) out.push(['line-height', sizeAndHeight[2]]);
  }
  return out.length ? out : null;
}

export function longhands(property, value) {
  if (property === 'padding' || property === 'margin' || property === 'inset' || property === 'border-width') {
    return expandBox(property, value);
  }
  if (property === 'font') return expandFont(value);
  if (property === 'gap') {
    const parts = value.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return [['row-gap', parts[0]], ['column-gap', parts[0]]];
    if (parts.length === 2) return [['row-gap', parts[0]], ['column-gap', parts[1]]];
    return null;
  }
  return [[property, value]];
}

/**
 * Every declaration that a later stylesheet takes away, at one width.
 *
 * A declaration is dead when the same selector sets the same longhand property
 * later in the cascade while both are applicable — media queries add no
 * specificity, so for an identical selector the last applicable one wins.
 * Same-file cascades are skipped: that is how CSS is meant to be written.
 */
/**
 * One parse, many widths. Without this, sweeping every width from 320 to 1440
 * re-parses six stylesheets a hundred times, and the sweep is the only way to
 * tell "dead on every phone" from "dead on a phone, live on a tablet" — which
 * is the difference between a declaration that can be deleted and one that
 * cannot.
 */
function expandAll(order) {
  const entries = [];
  order.forEach((file, fileIndex) => {
    for (const rule of parseStylesheet(file)) {
      const expanded = longhands(rule.property, rule.value);
      if (!expanded) continue;
      for (const [longhand, value] of expanded) {
        entries.push({
          file,
          fileIndex,
          longhand,
          value,
          line: rule.line,
          media: rule.media,
          selector: rule.selector,
        });
      }
    }
  });
  return entries;
}

export function deadDeclarations(order, width = PHONE_WIDTH) {
  return deadOf(expandAll(order), width);
}

/** `entries` must already be in file-then-line order; the last winner depends on it. */
function deadOf(entries, width) {
  const slots = new Map();

  for (const entry of entries) {
    if (appliesAt(entry.media, width) !== true) continue;
    const key = `${entry.selector}||${entry.longhand}`;
    const bucket = slots.get(key) ?? [];
    bucket.push(entry);
    slots.set(key, bucket);
  }

  const dead = [];
  for (const entries of slots.values()) {
    const winner = entries[entries.length - 1];
    for (const entry of entries.slice(0, -1)) {
      if (entry.fileIndex === winner.fileIndex) continue;
      // `!important` on the earlier one inverts the order, so it is not dead.
      if (/!\s*important/.test(entry.value) && !/!\s*important/.test(winner.value)) continue;
      dead.push({
        selector: entry.selector,
        property: entry.longhand,
        deadFile: entry.file,
        deadLine: entry.line,
        deadValue: entry.value,
        deadMedia: entry.media,
        winFile: winner.file,
        winLine: winner.line,
        winValue: winner.value,
        winMedia: winner.media,
      });
    }
  }
  return dead;
}

/**
 * The union of every width a phone actually is. One width is not enough: a rule
 * inside `max-width: 400px` is not evaluated at 768px at all, so a declaration
 * that loses only below 400px would hide behind the width the check happened to
 * pick.
 */
export const PHONE_WIDTHS = [320, 360, 375, 414, 480, 600, 768];

const keyOf = (entry) => `${entry.deadFile}|${entry.selector}|${entry.property}`;

function unionAcrossWidths(order, widths, pick) {
  const seen = new Set();
  const out = [];
  for (const width of widths) {
    for (const entry of pick(deadDeclarations(order, width))) {
      const key = keyOf(entry);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(entry);
    }
  }
  return out;
}

export function deadAcrossWidths(order, widths = PHONE_WIDTHS) {
  return unionAcrossWidths(order, widths, (entries) => entries);
}

/** Every width the site answers to, from the narrowest phone to a wide desktop. */
export const ALL_WIDTHS = Array.from({ length: 113 }, (_, index) => 320 + index * 10);

/**
 * A declaration that is dead at every width where it applies has no reader at any
 * size, so deleting it is something no one can tell you did. One that is dead on
 * a phone and alive on a tablet is doing real work — `index.css`'s
 * `.hero-video-wrap { order: -1 }` is exactly that, still arranging the hero
 * between 769px and 900px — and "it never applies" was only ever true of the
 * width it was measured at.
 *
 * `candidates` is the set to judge; the answer is the subset that is safe to
 * remove.
 */
export function deadWhereverItApplies(order, candidates, widths = ALL_WIDTHS) {
  // Findings and declarations are two different shapes; this is the only place
  // that has to care.
  const fileOf = (entry) => entry.file ?? entry.deadFile;
  const lineOf = (entry) => entry.line ?? entry.deadLine;
  const mediaOf = (entry) => entry.media ?? entry.deadMedia;
  const propertyOf = (entry) => entry.longhand ?? entry.property;
  const identity = (entry) => `${fileOf(entry)}|${lineOf(entry)}|${entry.selector}|${propertyOf(entry)}`;

  const entries = expandAll(order);
  const deadAt = widths.map((width) => new Set(deadOf(entries, width).map(identity)));
  return candidates.filter((candidate) => {
    const key = identity(candidate);
    let applies = 0;
    let dead = 0;
    widths.forEach((width, index) => {
      if (appliesAt(mediaOf(candidate), width) !== true) return;
      applies += 1;
      if (deadAt[index].has(key)) dead += 1;
    });
    return applies > 0 && dead === applies;
  });
}

/**
 * Every at-rule declaration that is dead at a phone width, whatever beat it.
 *
 * The union has to be taken *after* the classification, not before: which rule
 * wins depends on the width, so a declaration is in the same selector-and-
 * property slot whether it loses to an unscoped rule at 768px or to a
 * `max-width: 430px` rule at 375px. Deduping first kept whichever width was
 * measured first and silently dropped the rest — which is how the first version
 * of this missed the very rule it was written for.
 */
export function deadAtRuleDeclarations(order, widths = PHONE_WIDTHS) {
  return unionAcrossWidths(order, widths, (entries) =>
    entries.filter((entry) => entry.deadMedia.length > 0),
  );
}

/**
 * The gate. A declaration written inside an at-rule — a phone block — that is
 * dead at **every width where it applies** has no reader anywhere and cannot be
 * intended: there is no size at which it does anything.
 *
 * That is a stronger and more useful statement than "an unscoped rule beats it".
 * `index.css`'s `.hero-video-wrap { order: -1 }` loses on a phone and still
 * arranges the hero between 769px and 900px, so it is not dead at every width it
 * applies at, and deleting it would be a real change. It is reported instead. The
 * shape that got three bugs past review — a phone override written in a file a
 * later one outranks, whether the winner is scoped or not — is exactly what this
 * catches.
 */
export function atRuleDeclarationsThatNeverApply(order, widths = PHONE_WIDTHS) {
  const candidates = deadAtRuleDeclarations(order, widths);
  const dead = new Set(deadWhereverItApplies(order, candidates).map(keyOf));
  return candidates.filter((entry) => dead.has(keyOf(entry)));
}

export function describe(entry) {
  return `${entry.deadFile}:${entry.deadLine} ${entry.selector} { ${entry.property}: ${entry.deadValue} } — never applies, ${entry.winFile}:${entry.winLine} sets ${entry.property}: ${entry.winValue}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const order = stylesheetOrder();
  const widths = PHONE_WIDTHS.join(', ');
  const dead = deadAcrossWidths(order);
  const atRule = deadAtRuleDeclarations(order);
  const never = atRuleDeclarationsThatNeverApply(order);
  const neverKeys = new Set(never.map(keyOf));
  const phoneOnly = atRule.filter((entry) => !neverKeys.has(keyOf(entry)));
  const unscoped = never.filter((entry) => entry.winMedia.length === 0);

  console.log(`cascade: ${order.length} stylesheets, ${dead.length} dead declarations across ${widths}px\n`);
  console.log(`cascade: GATE — ${never.length} declarations inside an at-rule never apply at any width`);
  console.log(`cascade:        ${unscoped.length} of them lose to an unscoped rule in a later file\n`);
  for (const entry of never) console.log(`  ! ${describe(entry)}`);

  console.log(`\ncascade: reported — ${phoneOnly.length} never apply on a phone but do apply above 768px`);
  console.log('cascade: (deleting one of these is a real change, so they are not gated)\n');
  for (const entry of phoneOnly) console.log(`  · ${describe(entry)}`);

  const accountedFor = new Set([...atRule].map(keyOf));
  const layered = dead.filter((entry) => !accountedFor.has(keyOf(entry)));
  console.log(`\ncascade: ${layered.length} more are an earlier stylesheet's version of a rule a later`);
  console.log('cascade: one replaced — the layering this site is built on, not a bug\n');
  for (const entry of layered) console.log(`    ${describe(entry)}`);
}
