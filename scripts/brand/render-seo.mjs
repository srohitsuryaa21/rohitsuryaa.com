// Renders the share images (public/og/) and the home screen icons (public/) in Chrome.
// Run from the repo root:  node scripts/brand/render-seo.mjs
// Needs playwright-core (npm i -D playwright-core, or point NODE_PATH at an install) and Google Chrome.
import { chromium } from 'playwright-core';
import { mkdirSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projects, localize } from '../../src/data/projects.ts';

const repo = resolve(import.meta.dirname, '../..');
const out = (p) => resolve(repo, 'public', p);
mkdirSync(out('og/work'), { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const og = pathToFileURL(resolve(repo, 'scripts/brand/og.html')).href;
const shoot = async (data, file) => {
  await page.goto(`${og}#${encodeURIComponent(JSON.stringify(data))}`);
  await page.reload();
  await page.waitForFunction(() => document.body.dataset.ready === '1');
  await page.locator('#card').screenshot({ path: out(file), type: 'jpeg', quality: 90 });
};

const home = {
  en: { title: ['I turn raw data into', 'decisions', 'people trust.'], meta: 'Rohit Suryaa Saravanan · Software developer & data scientist · Fulda, Germany', play: 'Play the story' },
  de: { title: ['Ich mache aus Rohdaten', 'Entscheidungen,', 'denen man vertraut.'], meta: 'Rohit Suryaa Saravanan · Softwareentwickler & Data Scientist · Fulda', play: 'Story abspielen' },
};
for (const lang of ['en', 'de']) {
  await shoot({ kind: 'home', lang, url: 'rohitsuryaa.com', ...home[lang] }, `og/home-${lang}.jpg`);
  for (const [i, raw] of projects.entries()) {
    const p = localize(raw, lang);
    await shoot({
      kind: 'work', lang, index: String(i + 1).padStart(2, '0'), total: String(projects.length).padStart(2, '0'),
      category: p.category, short: p.short, hook: p.hook, metric: p.metric, metricLabel: p.metricLabel,
      color: p.color, scenes: p.scenes, play: `${home[lang].play} · ${p.scenes} ${lang === 'de' ? 'Szenen' : 'scenes'}`,
    }, `og/work/${p.slug}-${lang}.jpg`);
  }
}

// home screen icons: the full bleed ink tile (phones round the corners themselves; the mark sits inside the maskable safe zone)
const tile = pathToFileURL(resolve(repo, 'brand/rs-tile-ink.svg')).href;
for (const [size, file] of [[180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0}img{display:block;width:${size}px;height:${size}px}</style><img src="${tile}">`);
  await page.locator('img').evaluate((img) => img.decode());
  await page.locator('img').screenshot({ path: out(file), omitBackground: true });
}
// the multi size .ico for old browsers and Windows comes from the brand kit
copyFileSync(resolve(repo, '../Rohit Suryaa Brand Kit/02 App and browser icons/favicon.ico'), out('favicon.ico'));
await browser.close();
console.log('ok');
