import { expect, test } from '@playwright/test';

// Simulierte Kamera von Chromium (Testbild), Zugriff erlaubt
test.use({ permissions: ['camera'], launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] } });

test('MathLens: Rahmen, Aufnahme und Zuschnitt mit der Kamera', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium');
  await page.goto('/mathlens/');
  await page.getByTestId('azione-scansiona').click();
  await expect(page.getByTestId('kamera-video')).toBeVisible();
  await page.waitForFunction(() => ((document.querySelector('[data-testid="kamera-video"]') as HTMLVideoElement | null)?.videoWidth ?? 0) > 0);
  await page.getByTestId('scatta').click();
  await expect(page.getByTestId('zuschnitt')).toBeVisible();
  // Ecke ziehen verändert den Ausschnitt
  const corner = page.getByTestId('zuschnitt-ecke');
  const box = (await corner.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x - 40, box.y - 20, { steps: 5 });
  await page.mouse.up();
  const after = (await corner.boundingBox())!;
  expect(after.x).toBeLessThan(box.x);
});
