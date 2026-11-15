import { expect, test, type Page } from '@playwright/test';
import { createProfile, setupParentPin } from './helpers';

/** Wählt bei der aktuellen Frage genau die richtigen (oder bewusst falsche) Antworten. */
async function answer(page: Page, right: boolean) {
  const card = page.getByTestId('fs-frage');
  const kind = await card.getAttribute('data-kind');
  const opts = card.locator('[data-testid^="fs-antwort-"]');
  const n = await opts.count();
  let clicked = false;
  for (let i = 0; i < n; i++) {
    const ok = (await opts.nth(i).getAttribute('data-ok')) === 'true';
    if (right ? ok : !ok) { await opts.nth(i).click(); clicked = true; if (kind === 'vf' || !right) break; }
  }
  expect(clicked).toBe(true);
}

async function choose(page: Page, country: 'DE' | 'IT', lang: 'de' | 'it') {
  await page.goto('/fuehrerschein?schritt=land');
  await page.getByTestId(`fs-land-${country}`).click();
  await page.getByTestId(`fs-sprache-${lang}`).click();
  await expect(page.getByTestId('fs-dashboard')).toHaveAttribute('data-land', country);
  await expect(page.getByTestId('fs-dashboard')).toHaveAttribute('data-sprache', lang);
}

test('Fahrschule: Tessera, Paese e lingua, tutte e quattro le combinazioni', async ({ page }) => {
  await createProfile(page, 'Luca', '13', 'IT');
  await page.goto('/entdecken');
  await expect(page.getByTestId('entdecken-fuehrerschein')).toContainText('Scuola guida');
  await page.getByTestId('entdecken-fuehrerschein').click();
  await expect(page.getByText('Dove vuoi fare l’esame?')).toBeVisible();
  await page.getByTestId('fs-land-DE').click();
  await expect(page.getByText('In che lingua vuoi studiare?')).toBeVisible();
  await page.getByTestId('fs-sprache-it').click();
  await expect(page.getByTestId('fs-dashboard')).toBeVisible();
  await expect(page.getByTestId('fs-azione-teoria')).toContainText('Studia la teoria');
  await expect(page.getByTestId('fs-azione-quiz')).toContainText('Quiz illustrati e trabocchetti');
  await expect(page.getByTestId('fs-azione-esame')).toContainText('Simula l’esame');
  await expect(page.getByTestId('fs-demo-hinweis')).toContainText('Contenuto demo');

  const combos: ['DE' | 'IT', 'de' | 'it', string, string][] = [
    ['DE', 'it', 'Germania', 'una o più risposte'], ['DE', 'de', 'Deutschland', 'eine oder mehrere'],
    ['IT', 'it', 'Italia', 'vero/falso'], ['IT', 'de', 'Italien', 'richtig oder falsch']
  ];
  for (const [c, l, name, format] of combos) {
    await choose(page, c, l);
    await expect(page.getByTestId('fs-land-anzeige')).toContainText(name);
    await page.getByTestId('fs-azione-esame').click();
    await expect(page.getByTestId('fs-pruefung-start')).toContainText(format);
    await page.getByTestId('fs-pruefung-start-knopf').click();
    await expect(page.getByTestId('fs-pruefung')).toHaveAttribute('data-mini', 'nein');
    await expect(page.getByTestId('fs-nr-30')).toBeVisible();
    await expect(page.getByTestId('fs-frage')).toHaveAttribute('lang', l);
    await expect(page.getByTestId('fs-frage')).toHaveAttribute('data-kind', c === 'IT' ? 'vf' : 'multi');
    // In der Simulation gibt es keinen Sprachwechsel
    await expect(page.locator('[data-testid^="fs-sprache-wechsel-"]')).toHaveCount(0);
  }
});

test('Studio: cambio lingua senza cambiare domanda né perdere la risposta', async ({ page }) => {
  await createProfile(page, 'Sara', '13', 'DE');
  await choose(page, 'DE', 'de');
  await page.goto('/fuehrerschein/quiz/precedenza');
  const card = page.getByTestId('fs-frage');
  const id = await card.getAttribute('data-id');
  await answer(page, true);
  const chosen = await card.locator('[data-on="true"]').count();
  const textDe = await page.getByTestId('fs-frage-text').textContent();
  await page.getByTestId('fs-sprache-wechsel-it').click();
  await expect(card).toHaveAttribute('lang', 'it');
  await expect(card).toHaveAttribute('data-id', id!);
  expect(await page.getByTestId('fs-frage-text').textContent()).not.toBe(textDe);
  await expect(card.locator('[data-on="true"]')).toHaveCount(chosen);
  await page.getByTestId('fs-pruefen').click();
  await expect(page.getByTestId('fs-rueckmeldung')).toContainText('Giusto');
  // Lektion: Sprache wechseln
  await page.goto('/fuehrerschein/lezione/de-l-vorfahrt');
  await expect(page.getByTestId('fs-lezione-titel')).toHaveText('Precedenza agli incroci');
  await page.getByTestId('fs-sprache-wechsel-de').click();
  await expect(page.getByTestId('fs-lezione-titel')).toHaveText('Vorfahrt an Kreuzungen');
  await expect(page.getByTestId('diagramm-rechts-vor-links')).toBeVisible();
});

test('Quiz illustrati e trabocchetti: dettaglio evidenziato, spiegazione del tranello, errori da rifare', async ({ page }) => {
  await createProfile(page, 'Gio', '13', 'IT');
  await choose(page, 'IT', 'it');
  await page.goto('/fuehrerschein/quiz/trabocchetti');
  await answer(page, false);
  await page.getByTestId('fs-pruefen').click();
  await expect(page.getByTestId('fs-trabocchetto')).toContainText('Perché è un trabocchetto?');
  await page.goto('/fuehrerschein/quiz/illustrati');
  // eine Skizzen-Frage finden
  for (let k = 0; k < 10 && !(await page.locator('[data-testid^="diagramm-"]').count()); k++) {
    await answer(page, true); await page.getByTestId('fs-pruefen').click(); await page.getByTestId('fs-weiter').click();
  }
  if (await page.locator('[data-testid^="diagramm-"]').count()) {
    await answer(page, true);
    await page.getByTestId('fs-pruefen').click();
    await expect(page.getByTestId('diagramm-hervorhebung').first()).toBeVisible();
    await expect(page.getByTestId('fs-dettaglio')).toBeVisible();
  }
  await page.goto('/fuehrerschein');
  await expect(page.getByTestId('fs-errori-anzahl')).toContainText('1');
  await page.getByTestId('fs-errori').click();
  await expect(page.getByTestId('fs-ueben')).toHaveAttribute('data-modus', 'errori');
  await answer(page, true);
  await page.getByTestId('fs-pruefen').click();
  await page.getByTestId('fs-weiter').click();
  await expect(page.getByTestId('fs-runde-ende')).toBeVisible();
  await page.goto('/fuehrerschein');
  await expect(page.getByTestId('fs-errori')).toHaveCount(0);
});

test('Simulazione: Germania superata, Italia non superata, progressi separati per Paese', async ({ page }) => {
  await createProfile(page, 'Ale', '13', 'DE');
  await choose(page, 'DE', 'de');
  await page.goto('/fuehrerschein/esame');
  await page.getByTestId('fs-pruefung-start-knopf').click();
  await expect(page.getByTestId('fs-zeit')).toContainText('45:');
  for (let i = 0; i < 30; i++) { await answer(page, true); if (i < 29) await page.getByTestId('fs-naechste').click(); }
  await page.getByTestId('fs-abgeben').click();
  await page.getByTestId('fs-abgeben-ja').click();
  await expect(page.getByTestId('fs-ergebnis')).toHaveAttribute('data-bestanden', 'ja');
  await page.goto('/fuehrerschein');
  await expect(page.getByTestId('fs-letzte-pruefung')).toContainText('bestanden');

  await choose(page, 'IT', 'it');
  await expect(page.getByTestId('fs-letzte-pruefung')).toHaveCount(0);
  await page.goto('/fuehrerschein/esame');
  await page.getByTestId('fs-pruefung-start-knopf').click();
  await expect(page.getByTestId('fs-zeit')).toContainText('20:');
  for (let i = 0; i < 4; i++) { await answer(page, false); await page.getByTestId('fs-naechste').click(); }
  await page.getByTestId('fs-abgeben').click();
  await page.getByTestId('fs-abgeben-ja').click();
  await expect(page.getByTestId('fs-ergebnis')).toHaveAttribute('data-bestanden', 'nein');
  await expect(page.getByTestId('fs-falsch').first()).toBeVisible();
  // Sprache wechseln ändert den Fortschritt des Landes nicht
  await choose(page, 'IT', 'de');
  await expect(page.getByTestId('fs-letzte-pruefung')).toContainText('nicht bestanden');
  await page.goto('/fuehrerschein/copertura');
  await expect(page.getByTestId('fs-copertura-autostrada')).toBeVisible();
});

test('Fahrschule: prima dei 18 anni bloccata, i genitori possono attivarla', async ({ page }) => {
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
