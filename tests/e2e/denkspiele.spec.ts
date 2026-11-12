import { expect, test } from '@playwright/test';
import { createProfile } from './helpers';

test('Denkspiele: Sudoku mit Tipps lösen, Fehler werden markiert', async ({ page }) => {
  await createProfile(page, 'Lea', '2', 'IT');
  await page.goto('/entdecken');
  await page.getByTestId('entdecken-denkspiele').click();
  await expect(page.getByTestId('denkspiele-seite')).toBeVisible();
  await page.getByTestId('denkspiel-sudoku').click();
  const grid = page.getByTestId('sudoku-gitter');
  await expect(grid).toHaveAttribute('data-size', '4');
  // Leeres Feld wählen und eine falsche Zahl setzen: Feld wird markiert
  const empty = grid.locator('[data-testid^="zelle-"]:not([data-given])').first();
  await empty.click();
  for (const n of [1, 2, 3, 4]) {
    await page.getByTestId(`zahl-${n}`).click();
    if (await empty.getAttribute('data-wrong')) break;
  }
  await expect(grid.locator('[data-wrong]')).toHaveCount(1);
  // Mit Tipps fertig lösen
  for (let i = 0; i < 16 && !(await page.getByTestId('spiel-ende').isVisible()); i++) await page.getByTestId('tipp').click();
  await expect(page.getByTestId('spiel-ende')).toBeVisible();
  // Größe wechseln
  await page.getByTestId('neues-spiel').click();
  await page.getByTestId('sudoku-groesse-9').click();
  await expect(grid).toHaveAttribute('data-size', '9');
  await expect(grid.locator('[data-testid^="zelle-"]')).toHaveCount(81);
});

test('Denkspiele: Kreuzworträtsel auf Italienisch mit der Bildschirmtastatur lösen', async ({ page }) => {
  await createProfile(page, 'Gio', '4', 'IT');
  await page.goto('/denkspiele/kreuzwort');
  await expect(page.getByTestId('kw-hinweis')).toBeVisible();
  const cells = page.locator('[data-testid^="kw-zelle-"]');
  const n = await cells.count();
  expect(n).toBeGreaterThan(10);
  for (let i = 0; i < n; i++) {
    if (await page.getByTestId('spiel-ende').isVisible()) break;
    const cell = cells.nth(i);
    const letter = await cell.getAttribute('data-loesung');
    await cell.click();
    await page.getByTestId(`taste-${letter}`).click();
  }
  await expect(page.getByTestId('spiel-ende')).toBeVisible();
});

test('Denkspiele: Zahlen-Zwillinge und Blockregen lassen sich spielen', async ({ page }) => {
  await createProfile(page, 'Max', '6');
  await page.goto('/denkspiele/zwillinge');
  const tiles = page.getByTestId('plaettchen');
  await expect(tiles).toHaveCount(2);
  for (const d of ['links', 'hoch', 'rechts', 'runter', 'links', 'hoch', 'rechts', 'runter']) await page.getByTestId(`pfeil-${d}`).click();
  expect(await tiles.count()).toBeGreaterThan(2);
  await page.keyboard.press('ArrowLeft');

  await page.goto('/denkspiele/blockregen');
  await page.getByTestId('blockregen-start').click();
  for (let i = 0; i < 4; i++) {
    await page.getByTestId('block-links').click();
    await page.getByTestId('block-drehen').click();
    await page.getByTestId('block-fallen').click();
  }
  expect(Number(await page.getByTestId('blockregen-punkte').innerText())).toBeGreaterThan(0);
  await page.getByTestId('blockregen-pause').click();
  await expect(page.getByTestId('blockregen-start')).toBeVisible();
});
