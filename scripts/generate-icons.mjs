// Erzeugt PNG-App-Icons aus public/favicon.svg (benötigt Playwright/Chromium).
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8');
mkdirSync(new URL('../public/icons/', import.meta.url), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
const jobs = [
  ['public/icons/icon-192.png', 192, 0],
  ['public/icons/icon-512.png', 512, 0],
  ['public/icons/icon-maskable-512.png', 512, 0.18],
  ['public/apple-touch-icon.png', 180, 0.06]
];
for (const [file, size, pad] of jobs) {
  await page.setViewportSize({ width: size, height: size });
  const inner = Math.round(size * (1 - pad * 2));
  await page.setContent(`<body style="margin:0;background:#8ED1FC;display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</body>`);
  await page.screenshot({ path: file, omitBackground: false });
}
await browser.close();
console.log('Icons erzeugt.');
