import { expect, test } from '@playwright/test';
import { confirmAnswer, createProfile, playChoiceRound, waitNext } from './helpers';

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
    await confirmAnswer(page);
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

test('Italien: Profil auf Italienisch, 2ª media, Matematica und Programmazione', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('neues-profil').click();
  await page.getByTestId('profil-name').fill('Giulia');
  await page.getByTestId('land-IT').click();
  // Sprache wechselt automatisch auf Italienisch
  await expect(page.getByText('Quale scuola frequenti?')).toBeVisible();
  await page.getByTestId('stufe-medie').click();
  await page.getByTestId('jahr-7').click();
  await page.getByTestId('profil-erstellen').click();
  await expect(page.getByText('Giulia!')).toBeVisible();
  await expect(page.getByText('2ª media').first()).toBeVisible();
  await expect(page.getByTestId('home-fach-italiano')).toBeVisible();
  await page.getByTestId('bereich-schule').click();
  await expect(page.getByTestId('fach-scienze')).toBeVisible();
  await page.getByTestId('fach-programmieren').click();
  await page.getByTestId('modul-code-python').click();
  await expect(page.getByTestId('task-prompt')).toHaveText('Che cosa stampa il programma Python?');
  await page.goto('/schule/7/italiano');
  await page.getByTestId('modul-it7-logica').click();
  await playChoiceRound(page);
  await expect(page.getByText('Fatto!')).toBeVisible();
});

test('Oberstufe Deutschland: Integralrechnung und Ethik vorhanden', async ({ page }) => {
  await createProfile(page, 'Jonas', '12');
  await page.getByTestId('bereich-schule').click();
  await expect(page.getByTestId('klasse-12')).toHaveAttribute('aria-selected', 'true');
  await page.getByTestId('fach-mathe').click();
  await expect(page.getByTestId('modul-ms-integral')).toBeVisible();
  await page.goto('/schule/12/religion');
  await page.getByTestId('modul-rel-ethik').click();
  await playChoiceRound(page);
});

test('Programmieren Grundschule: Roboter-Parcours', async ({ page }) => {
  await createProfile(page, 'Lina', '2');
  await page.goto('/schule/2/programmieren');
  await page.getByTestId('modul-code-roboter').click();
  await expect(page.getByRole('img', { name: /Spielfeld/ })).toBeVisible();
  await playChoiceRound(page);
});

test('Lernpfad: Lektion abschließen schaltet die nächste frei, Theorie mit Beispielen', async ({ page }) => {
  await createProfile(page, 'Sara', '8');
  await page.goto('/schule/8/mathe');
  await expect(page.getByTestId('pfad-fortschritt')).toContainText('0/');
  const first = page.locator('[data-testid^="einheit-"]').first();
  const id = (await first.getAttribute('data-testid'))!.replace('einheit-', '');
  // Lektion 2 ist noch gesperrt
  await page.getByTestId(`lektion-${id}-2`).click();
  await expect(page.getByRole('status').filter({ hasText: /Lektion 1/ })).toBeVisible();
  // Theorie öffnen
  await page.getByTestId(`theorie-${id}`).click();
  await expect(page.getByText('Das Wichtigste')).toBeVisible();
  await expect(page.getByTestId('beispiel').first()).toBeVisible();
  await page.getByTestId('theorie-ueben').click();
  await expect(page.getByText('Lektion 1 · Grundlagen').first()).toBeVisible();
  // Prüfen ist erst nach einer Auswahl aktiv
  if (await page.locator('[data-correct="true"]').count()) await expect(page.getByTestId('pruefen')).toBeDisabled();
  await page.getByTestId('theorie-oeffnen').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  for (let i = 0; i < 20; i++) {
    if (await page.getByTestId('summary').isVisible()) break;
    const area = page.getByTestId('task-area');
    const idx = await area.getAttribute('data-index');
    if ((await area.getAttribute('data-phase')) !== 'answer') await page.getByTestId('weiter').click();
    else if (await page.locator('[data-correct="true"]').count()) { await page.locator('[data-correct="true"]').first().click(); await confirmAnswer(page); }
    else {
      // Zahlenfeld: Lösung zweimal falsch eingeben, dann wird sie gezeigt
      for (let t = 0; t < 2; t++) { await page.getByTestId('key-9').click(); await page.getByTestId('key-9').click(); await page.getByTestId('key-9').click(); await page.getByTestId('key-ok').click(); }
      continue;
    }
    await waitNext(page, idx);
  }
  await expect(page.getByTestId('xp-earned')).toBeVisible();
  await page.getByTestId('zurueck').click();
  await expect(page.getByTestId('pfad-fortschritt')).toContainText('1/');
  await expect(page.getByTestId(`modul-${id}`)).toHaveAttribute('href', new RegExp(`lektion=2`));
});
