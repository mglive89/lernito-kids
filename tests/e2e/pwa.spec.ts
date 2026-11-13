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
  await expect(page.getByText('Kindergarten').locator('visible=true').first()).toBeVisible();
  await page.goto('/kita');
  await page.getByTestId('modul-kita-memory').click();
  await expect(page.getByTestId('task-prompt')).toContainText('Paare');
  await context.setOffline(false);
});

test('Layout: kein horizontales Scrollen', async ({ page }) => {
  await createProfile(page, 'Breit', '3');
  for (const path of ['/home', '/entdecken', '/erfolge', '/profil', '/schule/3/mathe', '/kita', '/schule?jahr=3', '/schule?jahr=11', '/spiel/m3-schriftlich', '/spiel/kita-puzzle', '/spiel/code-roboter', '/spiel/code-python', '/spiel/m3-schriftlich?theorie=0', '/eltern', '/profil/neu']) {
    await page.goto(path);
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});

test('Kein Zoom: Viewport gesperrt, Strg+Mausrad und Pinch-Gesten werden abgefangen', async ({ page }) => {
  await page.goto('/');
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).toContain('user-scalable=no');
  expect(viewport).toContain('maximum-scale=1');
  const blocked = await page.evaluate(() => {
    const wheel = new WheelEvent('wheel', { ctrlKey: true, deltaY: -100, cancelable: true, bubbles: true });
    window.dispatchEvent(wheel);
    const gesture = new Event('gesturestart', { cancelable: true, bubbles: true });
    document.body.dispatchEvent(gesture);
    const plain = new WheelEvent('wheel', { deltaY: 100, cancelable: true, bubbles: true });
    window.dispatchEvent(plain);
    return { wheel: wheel.defaultPrevented, gesture: gesture.defaultPrevented, plain: plain.defaultPrevented };
  });
  expect(blocked).toEqual({ wheel: true, gesture: true, plain: false });
});
