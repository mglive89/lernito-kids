import { expect, test } from '@playwright/test';
import { createProfile, playChoiceRound, waitNext } from './helpers';

test('Kindergarten: Zählen spielen, Sterne bleiben nach Neuladen erhalten', async ({ page }) => {
  await createProfile(page, 'Mila', 'kita');
  await page.getByTestId('bereich-kita').click();
  await page.getByTestId('modul-kita-zaehlen').click();
  await expect(page.getByTestId('task-prompt')).toContainText('Wie viele');
  await page.waitForTimeout(500);
  // Ein falscher Versuch zeigt einen freundlichen Hinweis
  await page.locator('[data-testid^="option-"]:not([data-correct])').first().click();
  await expect(page.getByTestId('feedback')).toBeVisible();
  await playChoiceRound(page);
  const earned = Number((await page.getByTestId('stars-earned').innerText()).replace('+', ''));
  expect(earned).toBeGreaterThanOrEqual(4);
  await page.getByTestId('zurueck').click();
  await page.reload();
  await page.goto('/sterne');
  await expect(page.getByTestId('sterne-gesamt')).toHaveText(String(earned));
  await page.goto('/erfolge');
  await expect(page.getByTestId('badge-erste-runde')).toHaveAttribute('data-owned', 'true');
});

test('Kindergarten: Formen per Drag-and-Drop und per Antippen zuordnen', async ({ page }) => {
  await createProfile(page, 'Ben', 'kita');
  await page.goto('/spiel/kita-formen');
  // erste Aufgabe ist Drag-and-Drop
  const pieces = page.locator('[data-testid^="piece-"]');
  await expect(pieces.first()).toBeVisible();
  await page.waitForTimeout(900); // Einblend-Animation abwarten
  const count = await pieces.count();
  for (let i = 0; i < count; i++) {
    const piece = pieces.first();
    const id = (await piece.getAttribute('data-testid'))!.replace('piece-', '');
    const target = page.getByTestId(`target-${id}`);
    if (i % 2 === 0) {
      const a = (await piece.boundingBox())!;
      const b = (await target.boundingBox())!;
      await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
      await page.mouse.down();
      await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 15 });
      await page.mouse.up();
    } else {
      await piece.click();
      await target.click();
    }
    await expect(page.getByTestId(`piece-${id}`)).toHaveCount(0);
  }
  await expect(page.getByTestId('feedback')).toContainText(/!/);
});

test('Grundschule Klasse 2: Einmaleins mit Zahlenfeld lösen', async ({ page }) => {
  await createProfile(page, 'Tom', '2');
  await page.getByTestId('bereich-schule').click();
  await page.getByTestId('fach-mathe').click();
  await page.getByTestId('modul-m2-einmaleins').click();
  for (let i = 0; i < 6; i++) {
    const area = page.getByTestId('task-area');
    await area.waitFor();
    const idx = await area.getAttribute('data-index');
    const prompt = await page.getByTestId('task-prompt').innerText();
    if (await page.locator('[data-correct="true"]').count()) {
      await page.locator('[data-correct="true"]').first().click();
    } else {
      const [a, b] = prompt.match(/\d+/g)!.map(Number);
      for (const d of String(a! * b!)) await page.getByTestId(`key-${d}`).click();
      await page.getByTestId('key-ok').click();
    }
    await waitNext(page, idx);
  }
  await expect(page.getByTestId('summary')).toBeVisible();
});

test('Grundschule Klasse 1: Deutsch – Silben und Lesen', async ({ page }) => {
  await createProfile(page, 'Ida', '1');
  await page.goto('/schule/1/deutsch');
  await page.getByTestId('modul-d1-lesen').click();
  await playChoiceRound(page);
});

test('Nach zwei Fehlversuchen wird die Lösung Schritt für Schritt erklärt', async ({ page }) => {
  await createProfile(page, 'Lea', 'kita');
  await page.goto('/spiel/kita-farben');
  const wrong = page.locator('[data-testid^="option-"]:not([data-correct])');
  await wrong.nth(0).click();
  await wrong.nth(1).click();
  await expect(page.getByLabel('Erklärung Schritt für Schritt')).toBeVisible();
  await page.getByTestId('weiter').click();
  await expect(page.getByTestId('task-prompt')).toBeVisible();
});

test('3D-Lernwelt mit 2D-Fallback ohne WebGL', async ({ page }) => {
  await createProfile(page, 'Noah', '3');
  await page.goto('/spiel/3d-koerper?no3d');
  await expect(page.getByText('2D-Ansicht').first()).toBeVisible();
  await playChoiceRound(page);
});

test('Video-Lektion mit Untertiteln und Quiz', async ({ page }) => {
  await createProfile(page, 'Emil', '1');
  await page.goto('/videos/video-plus');
  await page.getByLabel('Video starten').click();
  await expect(page.getByTestId('untertitel')).toContainText('Puppy');
  // ans Ende springen
  await page.getByLabel('Position im Video').fill('39.9');
  await expect(page.getByTestId('zum-quiz')).toBeVisible({ timeout: 5000 });
  await page.getByTestId('zum-quiz').click();
  await playChoiceRound(page);
});
