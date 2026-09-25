/**
 * The share card.
 *
 * `public/og-image.png` is the first thing most people see of this site: it is
 * what a link becomes in a feed, a DM, a Slack unfurl or a LinkedIn post. It was
 * a 1200x630 white card with one small paragraph in its top-left corner and two
 * thirds of it empty — legible only at full size, which is the one size a share
 * card is never seen at, and carrying none of the brand.
 *
 * So it is generated rather than drawn: `npm run og` renders this card with the
 * site's own fonts and the site's own palette, and writes the PNG. The design
 * rules that keep it readable where it is actually displayed:
 *
 *   - one focal point, and it is the word "Sherpa.", at 152px;
 *   - nothing that has to be read below 21px, so the whole card survives being
 *     shown at roughly 40% in a feed;
 *   - the twelve bars are the twelve camps' altitudes from `waypoints.ts`, read
 *     from the same file the site reads, so the card cannot drift from the page;
 *   - the palette is the brand's: ink ground, acid accent, cyan and violet light.
 *
 * `scripts/quality-check.mjs` gates the result — the file has to exist, be
 * exactly 1200x630, and be declared in `index.html` with matching dimensions.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const OUT = 'public/og-image.png';
const WIDTH = 1200;
const HEIGHT = 630;

/** The site's tokens, copied by value because this renders outside the app. */
const INK = '#0b1114';
const INK_MID = '#0d1b21';
const PAPER = '#f7fbf5';
const ACID = '#d7ff55';
const CYAN = '#07cdc4';
const VIOLET = '#6a2bff';
const CORAL = '#ff3d0f';

const FONTS = [
  ['@fontsource/outfit', 'outfit-latin-900-normal.woff2', 'OGOutfit', 900],
  ['@fontsource/outfit', 'outfit-latin-800-normal.woff2', 'OGOutfit', 800],
  ['@fontsource/plus-jakarta-sans', 'plus-jakarta-sans-latin-700-normal.woff2', 'OGJakarta', 700],
  ['@fontsource/plus-jakarta-sans', 'plus-jakarta-sans-latin-600-normal.woff2', 'OGJakarta', 600],
];

/**
 * The altitudes come out of the waypoints file rather than being typed in here.
 * Node strips the type annotations; the file is plain data, so there is nothing
 * to compile.
 */
async function waypoints() {
  const module = await import('../src/data/waypoints.ts');
  return module.WAYPOINTS;
}

function fontFaces() {
  return FONTS.map(([pkg, file, family, weight]) => {
    const data = readFileSync(`node_modules/${pkg}/files/${file}`).toString('base64');
    return `@font-face { font-family: '${family}'; font-style: normal; font-weight: ${weight}; src: url(data:font/woff2;base64,${data}) format('woff2'); }`;
  }).join('\n');
}

function card(waypoints) {
  const altitudes = waypoints.map((waypoint) => waypoint.altitude);
  const floor = Math.min(...altitudes);
  const ceiling = Math.max(...altitudes);
  const span = ceiling - floor;
  // A floor of 16% keeps base camp visible: a bar chart where the first bar is a
  // zero-height line reads as a broken chart, not as an ascent.
  const bars = altitudes
    .map((altitude, index) => {
      const height = 16 + ((altitude - floor) / span) * 84;
      const last = index === altitudes.length - 1;
      return `<span class="${last ? 'bar bar--summit' : 'bar'}" style="height:${height.toFixed(1)}%"></span>`;
    })
    .join('');

  return `<!doctype html>
<html><head><meta charset="utf-8" /><style>
${fontFaces()}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 70px 76px 54px;
  color: ${PAPER};
  font-family: OGJakarta, sans-serif;
  background:
    radial-gradient(circle at 6% 2%, rgba(7, 205, 196, .30), transparent 44%),
    radial-gradient(circle at 98% -6%, rgba(106, 43, 255, .38), transparent 48%),
    radial-gradient(circle at 74% 118%, rgba(255, 61, 15, .16), transparent 46%),
    linear-gradient(160deg, ${INK_MID}, ${INK} 64%);
}
/* The same four-stop rule the hero shell wears above its card. */
body::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 8px;
  background: linear-gradient(90deg, ${ACID}, ${CYAN} 38%, ${VIOLET} 70%, ${CORAL});
}
/* The instrument grid from the live signal well, at a twentieth of its weight. */
body::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to bottom, rgba(255, 255, 255, .055) 1px, transparent 1px),
    linear-gradient(to right, rgba(255, 255, 255, .04) 1px, transparent 1px);
  background-size: 100% 25%, 8.333% 100%;
}
.stage { position: relative; z-index: 1; display: flex; align-items: center; gap: 56px; flex: 1; }

.copy { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; justify-content: center; gap: 30px; }
.eyebrow { display: flex; align-items: center; gap: 16px; font-weight: 800; font-size: 23px; letter-spacing: .34em; text-transform: uppercase; color: #b9dfd5; }
.eyebrow i { width: 12px; height: 12px; border-radius: 50%; background: ${ACID}; box-shadow: 0 0 22px ${ACID}; }
.eyebrow em { font-style: normal; height: 1px; flex: 0 1 84px; background: linear-gradient(90deg, rgba(247, 251, 245, .55), rgba(247, 251, 245, 0)); }
h1 { font-family: OGOutfit, sans-serif; font-weight: 900; font-size: 152px; line-height: .84; letter-spacing: -.05em; }
h1 span { color: ${ACID}; }
.tagline {
  padding-left: 26px;
  border-left: 5px solid ${ACID};
  max-width: 660px;
  font-weight: 600;
  font-size: 39px;
  line-height: 1.32;
  color: #cddedb;
  text-wrap: pretty;
}

.ascent { flex: 0 0 268px; display: flex; flex-direction: column; justify-content: center; gap: 22px; }
.ascent-label { font-weight: 800; font-size: 19px; letter-spacing: .2em; text-transform: uppercase; color: ${CYAN}; }
.bars { display: flex; align-items: flex-end; gap: 9px; height: 300px; padding-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, .24); }
.bar {
  flex: 1 1 0;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(180deg, rgba(7, 205, 196, .9), rgba(106, 43, 255, .55));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .1);
}
.bar--summit { background: linear-gradient(180deg, ${ACID}, rgba(215, 255, 85, .45)); box-shadow: 0 0 26px rgba(215, 255, 85, .45); }
.ascent-foot { font-weight: 700; font-size: 21px; letter-spacing: .04em; color: #9fb5ae; }
.ascent-foot b { color: ${PAPER}; }

.bottom { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between; gap: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, .18); }
/* The acid pill is the site's own signature — the live chip, the active route
     stop, the fold's count — and here it is the one solid block of accent on the
     card, which is what survives being seen at a fifth of this size. */
.domain { align-self: center; padding: 9px 20px; border-radius: 999px; background: ${ACID}; color: ${INK}; font-family: OGOutfit, sans-serif; font-weight: 800; font-size: 26px; letter-spacing: .03em; }
.practice { font-weight: 700; font-size: 21px; letter-spacing: .16em; text-transform: uppercase; color: rgba(247, 251, 245, .66); text-align: right; }
</style></head>
<body>
  <div class="stage">
    <div class="copy">
      <div class="eyebrow"><i></i>Cam Taylor<em></em></div>
      <h1>Sherpa<span>.</span></h1>
      <p class="tagline">We get people to the top &mdash; and back down again.</p>
    </div>
    <div class="ascent">
      <div class="ascent-label">Twelve camps</div>
      <div class="bars">${bars}</div>
      <div class="ascent-foot"><b>${floor.toLocaleString('en-CA')} m</b> base camp &rarr; <b>${ceiling.toLocaleString('en-CA')} m</b> summit</div>
    </div>
  </div>
  <div class="bottom">
    <div class="domain">camtaylor.ca</div>
    <div class="practice">Deal architecture &middot; Capital syndication &middot; Venture operations</div>
  </div>
</body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
await page.setContent(card(await waypoints()), { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(120);

const png = await page.screenshot({ clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT }, type: 'png' });

/**
 * Read the card back. A share card is checked by machines and read by eye, and
 * eye is not available in CI, so this states the things eye would have noticed:
 * that the ground is dark, that the accent is on it, that the largest type is
 * actually large, and that ink reaches all four quadrants rather than leaving
 * one of them empty the way the old card did.
 */
const survey = await page.evaluate(async (dataUrl) => {
  const image = new Image();
  await new Promise((resolve) => { image.onload = resolve; image.src = dataUrl; });
  // Fine enough that a 27px word registers: the first version sampled 24px wide,
  // averaged every thin stroke into the ground, and reported empty quadrants on a
  // card that has ink in all four.
  const grid = 150;
  const canvas = document.createElement('canvas');
  canvas.width = grid;
  canvas.height = Math.round((grid * image.height) / image.width);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let dark = 0;
  let acid = 0;
  const quadrants = [0, 0, 0, 0];
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      if (luminance < 0.25) dark += 1;
      if (g > 190 && r > 130 && b < 130) acid += 1;
      const saturated = Math.max(r, g, b) - Math.min(r, g, b) > 60;
      if (luminance > 0.4 || (saturated && luminance > 0.22)) {
        quadrants[(y < canvas.height / 2 ? 0 : 2) + (x < canvas.width / 2 ? 0 : 1)] += 1;
      }
    }
  }
  const total = canvas.width * canvas.height;
  return {
    dark: dark / total,
    acid: acid / total,
    quadrants: quadrants.map((count) => count / total),
    largest: Math.max(...[...document.querySelectorAll('h1, p, div')].map((el) => parseFloat(getComputedStyle(el).fontSize))),
  };
}, `data:image/png;base64,${png.toString('base64')}`);

await browser.close();
writeFileSync(OUT, png);

const complaints = [];
if (survey.dark < 0.6) complaints.push(`the ground is only ${(survey.dark * 100).toFixed(0)}% dark`);
if (survey.acid < 0.002) complaints.push('the acid accent is missing');
if (survey.largest < 140) complaints.push(`the largest type is ${survey.largest}px, not the 152px focal point`);
survey.quadrants.forEach((share, index) => {
  const where = ['top left', 'top right', 'bottom left', 'bottom right'][index];
  if (share < 0.008) complaints.push(`nothing left a mark in the ${where} quadrant`);
});

console.log(`${OUT}: ${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} kB`);
console.log(
  `  ground ${(survey.dark * 100).toFixed(0)}% dark, accent ${(survey.acid * 100).toFixed(1)}% of the card, largest type ${survey.largest}px`,
);
console.log(
  `  ink by quadrant: ${survey.quadrants.map((share, index) => `${['TL', 'TR', 'BL', 'BR'][index]} ${(share * 100).toFixed(1)}%`).join(', ')}`,
);
if (complaints.length) {
  console.error(complaints.map((complaint) => `✗ ${complaint}`).join('\n'));
  process.exit(1);
}
