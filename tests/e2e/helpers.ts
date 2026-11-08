import { expect, type Page } from '@playwright/test';

export async function createProfile(page: Page, name: string, age: 'kita' | '1' | '2' | '3' | '4') {
  await page.goto('/');
  await expect(page.getByTestId('greeting')).toHaveText('Hallo! Schön, dass du da bist!');
  await page.getByTestId('neues-profil').click();
  await page.getByTestId('profil-name').fill(name);
  await page.getByTestId(`alter-${age}`).click();
  await page.getByTestId('profil-erstellen').click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText(`${name}!`)).toBeVisible();
}

/** Löst die aktuelle Auswahl-Aufgabe korrekt. */
export async function answerChoice(page: Page) {
  await page.locator('[data-correct="true"]').first().click();
}

/** Wartet, bis die nächste Aufgabe (oder die Zusammenfassung) da ist. */
export async function waitNext(page: Page, index: string | null) {
  await page.waitForFunction((idx) => {
    if (document.querySelector('[data-testid="summary"]')) return true;
    const el = document.querySelector('[data-testid="task-area"]');
    return !!el && el.getAttribute('data-index') !== idx && el.getAttribute('data-phase') === 'answer';
  }, index, { timeout: 15000 });
  await page.waitForTimeout(500); // Einblend-Animation
}

/** Spielt eine Runde mit Auswahlaufgaben bis zur Zusammenfassung. */
export async function playChoiceRound(page: Page) {
  for (let i = 0; i < 20; i++) {
    if (await page.getByTestId('summary').isVisible()) return;
    const area = page.getByTestId('task-area');
    await area.waitFor();
    const idx = await area.getAttribute('data-index');
    if ((await area.getAttribute('data-phase')) === 'reveal') await page.getByTestId('weiter').click();
    else await page.locator('[data-correct="true"]:not([disabled])').first().click();
    await waitNext(page, idx);
  }
  await expect(page.getByTestId('summary')).toBeVisible();
}

export async function setupParentPin(page: Page, pin = '1357') {
  await page.goto('/eltern');
  const n = await page.getByTestId('adult-number').getAttribute('data-value');
  await page.getByTestId('adult-input').fill(n ?? '');
  await page.getByTestId('adult-submit').click();
  await page.getByTestId('pin-neu-field').fill(pin);
  await page.getByTestId('pin-neu-key-ok').click();
  await page.getByTestId('pin-wdh-field').fill(pin);
  await page.getByTestId('pin-wdh-key-ok').click();
  await expect(page.getByTestId('tab-uebersicht')).toBeVisible();
}
