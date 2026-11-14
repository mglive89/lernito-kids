import { expect, test, type Page } from '@playwright/test';
import { createProfile, playChoiceRound } from './helpers';

/** Setzt alle Einheiten eines Fachs auf „Lektion 3 geschafft“ (gespeicherter Zustand) und lädt neu. */
async function masterAll(page: Page, ids: string[]) {
  await page.evaluate((list) => {
    const key = 'lernito-backup:lernito-state';
    const state = JSON.parse(localStorage.getItem(key)!);
    const pid = state.state.activeProfileId ?? state.state.profiles[0].id;
    const mods = state.state.progress[pid].modules;
    for (const id of list) mods[id] = { level: 3, rounds: 3, tasks: 24, firstTry: 24, solved: 24, history: [1, 1, 1], lastPlayed: new Date().toISOString(), bestStars: 3, pathDone: 3 };
    localStorage.setItem(key, JSON.stringify(state));
  }, ids);
  await page.reload();
}

async function startIfTheory(page: Page) {
  const theory = page.getByTestId('theorie-start');
  await Promise.race([theory.waitFor().catch(() => {}), page.getByTestId('task-area').waitFor().catch(() => {})]);
  if (await theory.isVisible()) await theory.click();
  await expect(page.getByTestId('task-area')).toBeVisible();
}

test('Schwierigkeit: Profi-Lektion und Endrunde (Bronze, Silber, Gold)', async ({ page }) => {
  await createProfile(page, 'Lea', '3');
  await page.goto('/schule/3/deutsch');
  const units = page.locator('[data-testid^="einheit-"]');
  await expect(units.first()).toBeVisible();
  const ids = (await units.evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')!.replace('einheit-', ''))));
  // Endrunde ist zu Beginn gesperrt
  await page.getByTestId('endrunde-1').click();
  await expect(page.getByRole('status').filter({ hasText: /Endrunde öffnet sich/ })).toBeVisible();

  await masterAll(page, ids);
  await expect(page.getByTestId('pfad-fortschritt')).toContainText(`${ids.length * 3}/${ids.length * 4}`);
  // Profi-Lektion: mehr Aufgaben und ein Ziel
  await page.getByTestId(`modul-${ids[0]}`).click();
  await startIfTheory(page);
  await expect(page.getByText('Lektion 4 · Profi').first()).toBeVisible();
  await expect(page.getByTestId('ziel-info')).toContainText('beim ersten Versuch');
  await expect(page.getByTestId('ziel')).toBeVisible();
  await playChoiceRound(page);
  await expect(page.getByTestId('ziel-erreicht')).toBeVisible();
  await page.getByTestId('zurueck').click();
  await expect(page.getByTestId(`einheit-${ids[0]}`)).toContainText('Profi');

  // Endrunde: Bronze bestehen schaltet Silber frei
  await expect(page.getByTestId('endrunde-2')).not.toHaveAttribute('href');
  await page.getByTestId('endrunde-1').click();
  await expect(page.getByText('Endrunde · Bronze').first()).toBeVisible();
  await expect(page.getByTestId('ziel')).toContainText('0/6');
  await playChoiceRound(page);
  await expect(page.getByTestId('ziel-erreicht')).toBeVisible();
  await page.getByTestId('zurueck').click();
  await expect(page.getByTestId('endrunde-2')).toHaveAttribute('href', /stufe=2/);
});

test('Schwierigkeit: Ziel verfehlt heißt einfach nochmal versuchen', async ({ page }) => {
  await createProfile(page, 'Tom', '3');
  await page.goto('/schule/3/deutsch');
  const units = page.locator('[data-testid^="einheit-"]');
  const ids = (await units.evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')!.replace('einheit-', ''))));
  await masterAll(page, ids);
  await page.getByTestId('endrunde-1').click();
  // Jede Aufgabe einmal falsch, dann richtig: Ziel nicht erreicht
  for (let i = 0; i < 20; i++) {
    if (await page.getByTestId('summary').isVisible()) break;
    const area = page.getByTestId('task-area');
    const idx = await area.getAttribute('data-index');
    await page.locator('[data-testid^="option-"]:not([data-correct])').first().click();
    if (await page.getByTestId('pruefen').isVisible()) await page.getByTestId('pruefen').click();
    await page.locator('[data-correct="true"]:not([disabled])').first().click();
    if (await page.getByTestId('pruefen').isVisible()) await page.getByTestId('pruefen').click();
    await page.getByTestId('weiter').click();
    await page.waitForFunction((x) => !!document.querySelector('[data-testid="summary"]') || document.querySelector('[data-testid="task-area"]')?.getAttribute('data-index') !== x, idx);
    await page.waitForTimeout(400);
  }
  await expect(page.getByTestId('ziel-verfehlt')).toBeVisible();
  await expect(page.getByTestId('nochmal')).toContainText('Nochmal versuchen');
  await page.getByTestId('zurueck').click();
  await expect(page.getByTestId('endrunde-2')).not.toHaveAttribute('href');
});
