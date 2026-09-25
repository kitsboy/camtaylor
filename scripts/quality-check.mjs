import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}
console.log(
  `✓ Quality check passed (${requiredFiles.length} assets, metadata, privacy gate, type-scale floor)`,
);
