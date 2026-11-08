// Rendert Puppy (3D-Modell aus src/components/Puppy3D.tsx) für jede Stimmung als PNG nach public/puppy/.
// Aufruf: npm run puppy   (braucht Playwright + Chromium)
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const MOODS = ['freude', 'denken', 'jubel', 'winken', 'ruhig'];
const server = await createServer({ server: { port: 5199 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 400, height: 440 }, deviceScaleFactor: 1 });
await mkdir('public/puppy', { recursive: true });
for (const mood of MOODS) {
  await page.goto(`http://localhost:5199/puppy-studio.html?mood=${mood}`);
  await page.waitForFunction(() => window.__puppyReady === true, null, { timeout: 60000 });
  await page.waitForTimeout(mood === 'jubel' ? 900 : mood === 'winken' ? 650 : 400);
  await page.screenshot({ path: `public/puppy/${mood}.png`, omitBackground: true });
  console.log('ok', mood);
}
await browser.close();
await server.close();
