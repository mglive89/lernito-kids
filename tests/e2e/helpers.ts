import { expect, type Page } from '@playwright/test';

const STAGE: Record<'DE' | 'IT', [string, number, number][]> = {
  DE: [['kita', 0, 0], ['grundschule', 1, 4], ['sek1', 5, 10], ['sek2', 11, 13]],
  IT: [['infanzia', 0, 0], ['primaria', 1, 5], ['medie', 6, 8], ['superiori', 9, 13]]
};

export const PIN = '1357';

/** Erwachsenen-Prüfung lösen und PIN zweimal eingeben (Ersteinrichtung). */
export async function setPinFlow(page: Page, pin = PIN) {
  const n = await page.getByTestId('adult-number').getAttribute('data-value');
  await page.getByTestId('adult-input').fill(n ?? '');
  await page.getByTestId('adult-submit').click();
  await page.getByTestId('pin-neu-field').fill(pin);
  await page.getByTestId('pin-neu-key-ok').click();
  await page.getByTestId('pin-wdh-field').fill(pin);
  await page.getByTestId('pin-wdh-key-ok').click();
}

/** Füllt das Profilformular aus (Name, Land, Schule, Klasse). */
export async function fillProfileForm(page: Page, name: string, age: string, country: 'DE' | 'IT' = 'DE') {
  await page.getByTestId('profil-name').fill(name);
  await page.getByTestId(`land-${country}`).click();
  const year = age === 'kita' ? 0 : Number(age);
  const [stage, from, to] = STAGE[country].find(([, a, b]) => year >= a && year <= b)!;
  await page.getByTestId(`stufe-${stage}`).click();
  if (to > from) await page.getByTestId(`jahr-${year}`).click();
  await page.getByTestId('profil-erstellen').click();
}

/** Ersteinrichtung durch Eltern (PIN, Profil, Regeln) und Übergabe an das Kind. age: 'kita' oder Schuljahr 1–13. */
export async function createProfile(page: Page, name: string, age: string, country: 'DE' | 'IT' = 'DE') {
  await page.goto('/');
  await expect(page.getByTestId('greeting')).toBeVisible();
  await page.getByTestId('einrichtung-oeffnen').click();
  await page.getByTestId('einrichtung-start').click();
  await setPinFlow(page);
  await fillProfileForm(page, name, age, country);
  await page.getByTestId('einrichtung-weiter').click();
  await page.getByTestId('einrichtung-fertig').click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByText(`${name}!`).first()).toBeVisible();
}

/** Löst die aktuelle Auswahl-Aufgabe korrekt. */
export async function answerChoice(page: Page) {
  await page.locator('[data-correct="true"]').first().click();
}

/** Schule: „Prüfen“ drücken (falls vorhanden) und nach richtiger Antwort „Weiter“. */
export async function confirmAnswer(page: Page) {
  const check = page.getByTestId('pruefen');
  if (await check.isVisible()) await check.click();
  const area = page.getByTestId('task-area');
  await page.waitForFunction(() => document.querySelector('[data-testid="task-area"]')?.getAttribute('data-phase') !== 'answer' || !document.querySelector('[data-testid="pruefen"]'), null, { timeout: 5000 }).catch(() => {});
  if ((await area.getAttribute('data-phase')) === 'correct' && (await page.getByTestId('weiter').isVisible())) await page.getByTestId('weiter').click();
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
    if ((await area.getAttribute('data-phase')) !== 'answer') await page.getByTestId('weiter').click();
    else {
      await page.locator('[data-correct="true"]:not([disabled])').first().click();
      await confirmAnswer(page);
    }
    await waitNext(page, idx);
  }
  await expect(page.getByTestId('summary')).toBeVisible();
}

/** Elternbereich mit der bei der Einrichtung gesetzten PIN öffnen. */
export async function setupParentPin(page: Page, pin = PIN) {
  await page.goto('/eltern');
  await page.getByTestId('pin-login-field').fill(pin);
  await page.getByTestId('pin-login-key-ok').click();
  await expect(page.getByTestId('tab-uebersicht')).toBeVisible();
}
