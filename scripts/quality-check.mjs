import { existsSync, readFileSync } from 'node:fs';

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

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'));
  process.exit(1);
}
console.log(`✓ Quality check passed (${requiredFiles.length} assets, metadata, privacy gate)`);
