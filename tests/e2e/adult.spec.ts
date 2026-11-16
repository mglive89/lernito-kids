import { expect, test } from '@playwright/test';
import { createProfile } from './helpers';

test('Lernito Adult: vom Start aus öffnen, Anleitung Schritt für Schritt durchgehen', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('marke')).toHaveText('School');
  await page.getByTestId('welt-adult').click();
  await expect(page.getByTestId('adult-home')).toBeVisible();
  await page.getByTestId('adult-sprache-it').click();
  await page.getByTestId('bereich-lavoretti').click();
  await page.getByTestId('guida-tovagliolo-ventaglio').click();
  await expect(page.getByTestId('guida-titolo')).toHaveText('Tovagliolo a ventaglio');
  await page.getByTestId('guida-inizia').click();
  await expect(page.getByTestId('passo-numero')).toHaveText('Passo 1 di 6');
  for (let i = 0; i < 6; i++) await page.getByTestId('passo-avanti').click();
  await expect(page.getByTestId('guida-fine')).toBeVisible();
  await page.getByTestId('quiz-0-0').click();
  await page.getByTestId('guida-altre').click();
  await page.goto('/adult');
  await expect(page.getByTestId('adult-erledigt')).toHaveText('1 completate');
  // Beim nächsten App-Start geht es direkt in Adult weiter
  await page.goto('/');
  await expect(page.getByTestId('adult-home')).toBeVisible();
  await page.getByTestId('welt-school').click();
  await expect(page.getByTestId('greeting')).toBeVisible();
});

test('Lernito Adult: Rezept mit Portionen und Programmieren mit Live-Vorschau', async ({ page }) => {
  await page.goto('/adult/guida/pasta-pomodoro');
  await page.getByTestId('adult-guida').waitFor();
  const first = page.getByTestId('ingrediente-0');
  const before = await first.textContent();
  await page.getByTestId('porzioni-piu').click();
  await page.getByTestId('porzioni-piu').click();
  await expect(first).not.toHaveText(before ?? '');
  await expect(first).toContainText('360');

  await page.goto('/adult/guida/web-1-html');
  await page.getByTestId('guida-inizia').click();
  await page.getByTestId('passo-avanti').click();
  await expect(page.getByTestId('code-lab')).toBeVisible();
  await page.getByTestId('code-controlla').click();
  await expect(page.getByTestId('code-ko')).toBeVisible();
  const editor = page.locator('[data-testid^="code-editor-"]');
  const code = await editor.inputValue();
  await editor.fill(code.replace('</body>', '<p>Secondo paragrafo</p>\n</body>'));
  await expect(page.frameLocator('[data-testid="code-anteprima"]').getByText('Secondo paragrafo')).toBeVisible();
  await page.getByTestId('code-controlla').click();
  await expect(page.getByTestId('code-ok')).toBeVisible();
});

test('Lernito School: Kinderprofil zeigt das Etikett Kids', async ({ page }) => {
  await createProfile(page, 'Mia', '2');
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByTestId('marke-shell')).toHaveText('Kids');
});
