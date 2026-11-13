import { expect, test, type Page } from '@playwright/test';
import { createProfile, PIN } from './helpers';

/** Ein „Foto“ einer gedruckten Aufgabe: HTML rendern und als PNG aufnehmen. */
async function photoOf(page: Page, lines: string[]): Promise<Buffer> {
  const other = await page.context().newPage();
  await other.setViewportSize({ width: 900, height: 140 + lines.length * 90 });
  await other.setContent(`<body style="margin:0;background:#fdfcf7;font:600 56px Arial, sans-serif;color:#222;padding:40px">${lines.map((l) => `<div style="margin-bottom:24px">${l}</div>`).join('')}</body>`);
  const shot = await other.screenshot();
  await other.close();
  return shot;
}

test('Mathe-Aufgabe eintippen und Schritt für Schritt erklären lassen', async ({ page }) => {
  await createProfile(page, 'Luca', '3', 'IT');
  await page.goto('/schule/3/mathe');
  await page.getByTestId('hausaufgaben-hilfe').click();
  await expect(page).toHaveURL(/\/hausaufgaben$/);

  await page.getByTestId('aufgabe-eingabe').fill('345 + 278 =');
  await page.getByTestId('aufgabe-erklaeren').click();
  await expect(page.getByTestId('erklaerung-aufgabe')).toHaveText('345 + 278');
  await expect(page.getByTestId('schritt-0')).toBeVisible();
  await expect(page.getByTestId('kaestchen').first()).toBeVisible();
  await expect(page.getByTestId('ergebnis')).toHaveCount(0);

  // Ergebnis selbst prüfen: falsch, dann richtig
  await page.getByTestId('eigenes-ergebnis').fill('613');
  await page.getByTestId('ergebnis-pruefen').click();
  await expect(page.getByText('Non ancora.')).toBeVisible();
  await page.getByTestId('naechster-schritt').click();
  await expect(page.getByTestId('schritt-1')).toContainText('Unità');
  await page.getByTestId('eigenes-ergebnis').fill('623');
  await page.getByTestId('ergebnis-pruefen').click();
  await expect(page.getByTestId('ergebnis-wert')).toHaveText('623');

  // Gleichung
  await page.getByTestId('hausaufgabe-zurueck').click();
  await page.getByTestId('aufgabe-eingabe').fill('3x + 5 = 20');
  await page.getByTestId('aufgabe-erklaeren').click();
  await page.getByTestId('alle-schritte').click();
  await expect(page.getByTestId('ergebnis-wert')).toHaveText('x = 5');
});

test('Foto braucht die Freigabe der Eltern und wird auf dem Gerät gelesen', async ({ page }) => {
  test.setTimeout(120_000);
  await createProfile(page, 'Mia', '4', 'DE');
  await page.goto('/hausaufgaben');

  // Ohne Freigabe: erst die Eltern fragen
  await page.getByTestId('foto-waehlen').click();
  await expect(page.getByTestId('kamera-einwilligung')).toBeVisible();
  await page.getByTestId('kamera-eltern').click();
  await page.getByTestId('pin-login-field').fill(PIN);
  await page.getByTestId('pin-login-key-ok').click();
  await expect(page.getByText('Kamera ist freigegeben')).toBeVisible();

  // Kein Netzwerkzugriff außer der eigenen Seite
  const foreign: string[] = [];
  page.on('request', (r) => { if (!/^(http:\/\/localhost|blob:|data:)/.test(r.url())) foreign.push(r.url()); });

  const png = await photoOf(page, ['a) 457 : 3 =', 'b) 24 + 18 =']);
  await page.getByTestId('foto-input').setInputFiles({ name: 'aufgabe.png', mimeType: 'image/png', buffer: png });
  await expect(page.getByTestId('gefundene-aufgaben')).toBeVisible({ timeout: 90_000 });
  const first = page.getByTestId('gefunden-0');
  await expect(first).toHaveValue(/457\s*:\s*3/);
  await page.getByTestId('erklaeren-0').click();
  await page.getByTestId('alle-schritte').click();
  await expect(page.getByTestId('ergebnis-wert')).toHaveText('152 Rest 1');
  expect(foreign).toEqual([]);
});
