import { expect, test, type Page } from '@playwright/test';
import { createProfile, setupParentPin } from './helpers';

/** Wählt bei der aktuellen Frage genau die richtigen (oder falschen) Antworten. */
async function answer(page: Page, right: boolean) {
  const opts = page.locator('[data-testid^="fs-antwort-"]');
  const n = await opts.count();
  const kind = await page.getByTestId('fs-frage').getAttribute('data-kind');
  for (let i = 0; i < n; i++) {
    const ok = (await opts.nth(i).getAttribute('data-ok')) === 'true';
    if (kind === 'vf' ? ok === right : (right ? ok : !ok)) { await opts.nth(i).click(); if (kind === 'vf') break; }
  }
}

test('Führerschein DE (Klasse 13): Schilder, Üben mit Erklärung und bestandene Prüfung', async ({ page }) => {
  await createProfile(page, 'Luca', '13', 'DE');
  await page.goto('/entdecken');
  await page.getByTestId('entdecken-fuehrerschein').click();
  await expect(page.getByTestId('fuehrerschein-seite')).toHaveAttribute('data-land', 'DE');

  await page.getByTestId('fs-schilder-oeffnen').click();
  await expect(page.getByTestId('fs-schild-stop')).toBeVisible();
  await page.getByTestId('fs-schilder-ueben').click();
  await expect(page.getByTestId('fs-ueben')).toBeVisible();
  await answer(page, true);
  await page.getByTestId('fs-pruefen').click();
  await expect(page.getByTestId('fs-rueckmeldung')).toHaveAttribute('data-ok', 'true');
  await page.getByTestId('fs-weiter').click();
  await answer(page, false);
  await page.getByTestId('fs-pruefen').click();
  await expect(page.getByTestId('fs-rueckmeldung')).toHaveAttribute('data-ok', 'false');

  await page.goto('/fuehrerschein/pruefung');
  await page.getByTestId('fs-pruefung-start-knopf').click();
  await expect(page.getByTestId('fs-zeit')).toContainText('45:');
  for (let i = 0; i < 30; i++) {
    await answer(page, true);
    if (i < 29) await page.getByTestId('fs-naechste').click();
  }
  await page.getByTestId('fs-abgeben').click();
  await page.getByTestId('fs-abgeben-ja').click();
  await expect(page.getByTestId('fs-ergebnis')).toHaveAttribute('data-bestanden', 'ja');
  await page.goto('/fuehrerschein');
  await expect(page.getByTestId('fs-letzte-pruefung')).toBeVisible();
});

test('Patente IT (5ª superiore): quiz vero/falso, esame non superato con troppi errori', async ({ page }) => {
  await createProfile(page, 'Giulia', '13', 'IT');
  await page.goto('/fuehrerschein');
  await expect(page.getByTestId('fuehrerschein-seite')).toHaveAttribute('data-land', 'IT');
  await expect(page.getByText('Teoria della patente').first()).toBeVisible();
  await page.getByTestId('fs-thema-precedenza').click();
  await expect(page.getByTestId('fs-frage')).toHaveAttribute('data-kind', 'vf');
  await expect(page.getByTestId('fs-antwort-0')).toHaveText('Vero');
  await page.goto('/fuehrerschein/pruefung');
  await page.getByTestId('fs-pruefung-start-knopf').click();
  await expect(page.getByTestId('fs-zeit')).toContainText('20:');
  for (let i = 0; i < 4; i++) { await answer(page, false); await page.getByTestId('fs-naechste').click(); }
  await page.getByTestId('fs-abgeben').click();
  await expect(page.getByTestId('fs-abgeben-frage')).toContainText('26');
  await page.getByTestId('fs-abgeben-ja').click();
  await expect(page.getByTestId('fs-ergebnis')).toHaveAttribute('data-bestanden', 'nein');
  await expect(page.getByTestId('fs-falsch').first()).toBeVisible();
});

test('Führerschein: vor Klasse 13 gesperrt, Eltern können freischalten', async ({ page }) => {
  await createProfile(page, 'Tom', '11', 'DE');
  await page.goto('/entdecken');
  await expect(page.getByTestId('entdecken-seite')).toBeVisible();
  await expect(page.getByTestId('entdecken-fuehrerschein')).toHaveCount(0);
  await page.goto('/fuehrerschein');
  await expect(page.getByTestId('fs-gesperrt')).toBeVisible();
  await setupParentPin(page);
  await page.getByTestId('tab-ziele').click();
  await page.getByTestId('fs-freischalten').check({ force: true });
  await page.getByTestId('eltern-abmelden').click();
  await page.getByTestId('profile-Tom').click();
  await page.goto('/entdecken');
  await expect(page.getByTestId('entdecken-fuehrerschein')).toBeVisible();
});
