import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  atRuleDeclarationsThatNeverApply,
  describe,
  stylesheetOrder,
} from './cascade-check.mjs';

const failures = [];
const requiredFiles = ['public/robots.txt', 'public/manifest.json', 'public/favicon.svg', 'public/og-image.png'];
for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`Missing required file: ${file}`);
}

const index = readFileSync('index.html', 'utf8');
for (const token of ['<title>', 'name="description"', 'rel="canonical"', 'application/ld+json']) {
  if (!index.includes(token)) failures.push(`Missing metadata: ${token}`);
}
if (index.includes('analytics.giveabit.io/script.js')) failures.push('Analytics must be runtime-gated, not hard-coded in index.html');

// ── Share card ────────────────────────────────────────────────────────────────
// The card is generated (`npm run og`), so it is the one asset nobody looks at
// while designing a page — and the one most people see first. A wrong size is
// silently letterboxed or cropped by every unfurler, and a meta tag that points
// at a file the build does not ship means no card at all, so both are checked.
const CARD = { width: 1200, height: 630, path: '/og-image.png' };
const CARD_FILE = `public${CARD.path}`;
if (existsSync(CARD_FILE)) {
  // PNG puts the size in the IHDR chunk: 8 bytes of signature, 4 of length, 4 of
  // type, then width and height as big-endian uint32. No decoder needed.
  const header = readFileSync(CARD_FILE).subarray(0, 24);
  const isPng = header.subarray(1, 4).toString('ascii') === 'PNG';
  if (!isPng) {
    failures.push(`${CARD_FILE} is not a PNG, and every unfurler keys on the declared type`);
  } else {
    const width = header.readUInt32BE(16);
    const height = header.readUInt32BE(20);
    if (width !== CARD.width || height !== CARD.height) {
      failures.push(
        `${CARD_FILE} is ${width}x${height}; share cards are ${CARD.width}x${CARD.height} and every platform crops or letterboxes the rest — run \`npm run og\``,
      );
    }
  }
}
for (const token of [
  `property="og:image" content="https://camtaylor.ca${CARD.path}"`,
  `name="twitter:image" content="https://camtaylor.ca${CARD.path}"`,
  `property="og:image:width" content="${CARD.width}"`,
  `property="og:image:height" content="${CARD.height}"`,
  'property="og:image:alt"',
  'name="twitter:image:alt"',
  'name="twitter:card" content="summary_large_image"',
]) {
  if (!index.includes(token)) failures.push(`The share card is not declared in index.html: ${token}`);
}
if (!index.includes('name="twitter:site"')) {
  failures.push('Missing metadata: name="twitter:site" — an unowned card is credited to nobody');
}

const envExample = readFileSync('.env.example', 'utf8');
if (!envExample.includes('VITE_PRIVATE_PREVIEW=true')) failures.push('Private preview must default to true');

const robots = readFileSync('public/robots.txt', 'utf8');
if (!robots.includes('Sitemap:')) failures.push('robots.txt must declare a sitemap');

// Preview copy must never be hard-coded: every mention has to sit behind
// IS_PRIVATE_PREVIEW, or a public build will announce itself as a preview.
function walk(dir, extensions = ['.tsx']) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path, extensions);
    return extensions.some((extension) => entry.name.endsWith(extension)) ? [path] : [];
  });
}

for (const file of walk('src')) {
  const source = readFileSync(file, 'utf8');
  if (/private preview/i.test(source) && !source.includes('IS_PRIVATE_PREVIEW')) {
    failures.push(`${file} mentions the private preview without gating it on IS_PRIVATE_PREVIEW`);
  }
}

// ── Type-scale guard ───────────────────────────────────────────────────────────────
// This site had 56 bespoke font sizes, most of them between 8px and 11.5px. They now
// come from the seven-step scale in `src/index.css`, and nothing a visitor reads may
// sit below the floor. A fresh sub-floor literal fails the build so the scale cannot
// quietly grow back — the same instrument-first pattern as `tests/contrast.spec.ts`.
const FLOOR_REM = 0.6875; // --fs-2xs, the one documented exception (uppercase micro-labels)
const FLOOR_PX = 11;
const SIZE_PATTERNS = [/font-size:\s*([^;]+);/g, /(?:^|[;{\s])font:\s*([^;]+);/g];

for (const file of walk('src', ['.css'])) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, index) => {
      for (const pattern of SIZE_PATTERNS) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const value = match[1].trim();
          const rem = value.match(/(\d*\.?\d+)rem/);
          const px = value.match(/(\d*\.?\d+)px/);
          const belowFloor = rem ? Number(rem[1]) < FLOOR_REM : px ? Number(px[1]) < FLOOR_PX : false;
          if (belowFloor) {
            failures.push(
              `${file}:${index + 1} sets "${value}" below the ${FLOOR_REM}rem / ${FLOOR_PX}px type floor — use a --fs-* token`,
            );
          }
        }
      }
    });
}

// ── Cascade guard ─────────────────────────────────────────────────────────────
// Six stylesheets load in a fixed order (`src/main.tsx`), so a rule written in
// the wrong one is not a style change — it is a declaration that never applies,
// and nothing in a screenshot or a diff says so. Twenty were found by hand and
// removed when this guard landed; it is here so the next one fails the build
// instead. `npm run cascade` prints the full picture, including the rings this
// cannot gate on and the reasons it can never see everything.
for (const entry of atRuleDeclarationsThatNeverApply(stylesheetOrder())) {
  failures.push(`a phone override that never applies at any width — ${describe(entry)}`);
}

// ── The contact form's destination ──────────────────────────────────────────────
// The form hands a stranger's message to Formspree, which delivers it to exactly one
// inbox: `INQUIRY_EMAIL` in `src/data/site.ts`, the address Kimi monitors so she can
// filter the spam before any of it reaches Cam. Three things have to agree with that
// one string — the public `familyEmail`, the copy on the page, and the env template
// the deployer actually reads. This gate exists because the page stated a delivery
// address the endpoint did not deliver to, and nothing said so.
const siteSource = readFileSync('src/data/site.ts', 'utf8');
const inbox = siteSource.match(/export const INQUIRY_EMAIL = '([^']+)'/)?.[1];
if (!inbox) {
  failures.push(
    'src/data/site.ts must export INQUIRY_EMAIL — the one inbox a contact-form submission is delivered to',
  );
} else {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inbox)) failures.push(`INQUIRY_EMAIL is not an address: ${inbox}`);
  if (!siteSource.includes('familyEmail: INQUIRY_EMAIL')) {
    failures.push(
      'SITE.familyEmail must be INQUIRY_EMAIL, or the public address and the form destination can drift apart',
    );
  }
  if (!envExample.includes(inbox)) {
    failures.push(`.env.example no longer tells the deployer the form must deliver to ${inbox}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}
console.log(
  `✓ Quality check passed (${requiredFiles.length} assets, ${CARD.width}x${CARD.height} share card, metadata, privacy gate, type-scale floor, cascade, form inbox)`,
);
