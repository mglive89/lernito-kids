import { expect, test, type Page } from '@playwright/test';
import { confirmAnswer, createProfile, startExercises, waitNext } from './helpers';

const SHOTS = process.env.BILDER_SCREENSHOTS;

/** Spielt Auswahlaufgaben, bis eine Bildaufgabe erscheint (höchstens eine Runde). */
async function findPictureTask(page: Page) {
  for (let i = 0; i < 12; i++) {
    const area = page.getByTestId('task-area');
    await area.waitFor();
    if (await page.locator('.bild-aufgabe, [data-testid^="option-"] svg').first().isVisible().catch(() => false)) return true;
    const idx = await area.getAttribute('data-index');
    await page.locator('[data-correct="true"]:not([disabled])').first().click();
    await confirmAnswer(page);
    await waitNext(page, idx);
    if (await page.getByTestId('summary').isVisible()) return false;
  }
  return false;
}

for (const [country, year, module, dark] of [['IT', '3', 'rel-feste', false], ['DE', '3', 'info-computer', true], ['IT', '4', 'ge-antike', false]] as const) {
  test(`Bildaufgaben in der Lektion: ${module} (${country}${dark ? ', dunkel' : ''})`, async ({ page }, info) => {
    await createProfile(page, 'Noa', year, country);
    if (dark) {
      await page.goto('/profil');
      await page.getByTestId('thema-dunkel').click();
    }
    await page.goto(`/spiel/${module}`);
    await startExercises(page);
    expect(await findPictureTask(page)).toBe(true);
    await page.waitForTimeout(400);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${module}-${country}-${info.project.name}${dark ? '-dunkel' : ''}.png` });
    // richtige Antwort wählen funktioniert auch bei Bildaufgaben
    await page.locator('[data-correct="true"]:not([disabled])').first().click();
    await confirmAnswer(page);
  });
}
