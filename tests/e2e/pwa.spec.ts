import { expect, test } from '@playwright/test';
import { createProfile } from './helpers';

test('PWA: Manifest, Icons und Offline-Start', async ({ page, context }) => {
  await page.goto('/');
  const manifest = await page.request.get('/manifest.webmanifest');
  expect(manifest.ok()).toBe(true);
  const json = await manifest.json();
  expect(json.name).toBe('Lernito Kids');
  expect(json.lang).toBe('de-DE');
  expect(json.icons.length).toBeGreaterThanOrEqual(3);
  await page.waitForFunction(async () => (await navigator.serviceWorker.ready).active?.state === 'activated');
  await createProfile(page, 'Offi', 'kita');
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('Kindergarten').first()).toBeVisible();
  await page.goto('/kita');
  await page.getByTestId('modul-kita-memory').click();
  await expect(page.getByTestId('task-prompt')).toContainText('Paare');
  await context.setOffline(false);
});

test('Layout: kein horizontales Scrollen', async ({ page }) => {
  await createProfile(page, 'Breit', '3');
  for (const path of ['/home', '/entdecken', '/erfolge', '/profil', '/schule/3/mathe', '/kita', '/schule?jahr=3', '/schule?jahr=11', '/spiel/m3-schriftlich', '/spiel/kita-puzzle', '/spiel/code-roboter', '/spiel/code-python', '/eltern', '/profil/neu']) {
    await page.goto(path);
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});
