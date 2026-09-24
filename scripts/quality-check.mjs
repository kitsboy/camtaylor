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
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith('.tsx') ? [path] : [];
  });
}

for (const file of walk('src')) {
  const source = readFileSync(file, 'utf8');
  if (/private preview/i.test(source) && !source.includes('IS_PRIVATE_PREVIEW')) {
    failures.push(`${file} mentions the private preview without gating it on IS_PRIVATE_PREVIEW`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}
console.log(`✓ Quality check passed (${requiredFiles.length} assets, metadata, privacy gate)`);
