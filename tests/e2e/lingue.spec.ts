import { expect, test, type Page } from '@playwright/test';
import { confirmAnswer, createProfile, PIN, waitNext } from './helpers';

/**
 * Attrappe für die Spracherkennung: liefert, was der Test in window.__say legt.
 * So lässt sich das Mikrofon ohne echtes Gerät prüfen.
 */
const micStub = () => {
  const w = window as unknown as { __say: string; __listened: number; webkitSpeechRecognition: unknown; SpeechRecognition: unknown };
  w.__say = '';
  w.__listened = 0;
  class FakeRec {
    lang = ''; continuous = false; interimResults = false; maxAlternatives = 1;
    onresult: ((e: unknown) => void) | null = null;
    onerror: ((e: unknown) => void) | null = null;
    onend: (() => void) | null = null;
    start() {
      w.__listened++;
      setTimeout(() => {
        const text = w.__say;
        if (text) this.onresult?.({ results: { length: 1, 0: { length: 1, isFinal: true, 0: { transcript: text, confidence: 0.9 } } } });
        else this.onerror?.({ error: 'no-speech' });
        this.onend?.();
      }, 150);
    }
    stop() {} abort() { this.onerror?.({ error: 'aborted' }); this.onend?.(); }
  }
  w.webkitSpeechRecognition = FakeRec;
  w.SpeechRecognition = FakeRec;
};

async function allowMic(page: Page) {
  await page.getByTestId('mikro-aktivieren').click();
  await page.getByTestId('mikro-eltern').click();
  await page.getByTestId('pin-login-field').fill(PIN);
  await page.getByTestId('pin-login-key-ok').click();
  await expect(page.getByTestId('mikro-aktivieren')).toHaveCount(0);
}

/** Löst die aktuelle Aufgabe eines Sprachkurses (Sprechen mit der Attrappe). */
async function solveTask(page: Page) {
  const area = page.getByTestId('task-area');
  if (await page.getByTestId('sprechen').isVisible()) {
    const phrase = await page.getByTestId('sprech-satz').innerText();
    await page.evaluate((p) => { (window as unknown as { __say: string }).__say = p; }, phrase);
    await page.getByTestId('mikrofon').click();
    await expect(area).toHaveAttribute('data-phase', 'correct');
  } else if (await page.locator('[data-testid^="card-"]').first().isVisible().catch(() => false)) {
    const ids = await page.locator('[data-testid^="card-"]').evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('data-testid')!))]);
    for (const id of ids) {
      const cards = page.getByTestId(id);
      await cards.nth(0).click();
      await cards.nth(1).click();
      await page.waitForTimeout(150);
    }
    await expect(area).toHaveAttribute('data-phase', 'correct');
  } else if (await page.getByTestId('satz-antwort').isVisible()) {
    throw new Error('Satz-Aufgabe in Lektion 1 nicht erwartet');
  } else {
    await page.locator('[data-correct="true"]:not([disabled])').first().click();
  }
  await confirmAnswer(page);
}

test('Sprachkurs: Lektion mit Hören, Memory und Sprechen über das Mikrofon', async ({ page }) => {
  await page.addInitScript(micStub);
  await createProfile(page, 'Luca', '3', 'IT');
  await page.goto('/lingue');
  await expect(page.getByTestId('kurs-en')).toBeVisible();
  await expect(page.getByTestId('kurs-it')).toHaveCount(0); // eigene Sprache nicht als Kurs
  await allowMic(page);
  await page.getByTestId('kurs-en').click();
  await page.getByTestId('lektion-lingua-en-saluti-1').click();

  for (let i = 0; i < 12; i++) {
    if (await page.getByTestId('summary').isVisible()) break;
    const idx = await page.getByTestId('task-area').getAttribute('data-index');
    if ((await page.getByTestId('task-area').getAttribute('data-phase')) === 'answer') await solveTask(page);
    if (await page.getByTestId('summary').isVisible()) break;
    if ((await page.getByTestId('task-area').getAttribute('data-phase')) !== 'answer' && await page.getByTestId('weiter').isVisible()) await page.getByTestId('weiter').click();
    await waitNext(page, idx);
  }
  await expect(page.getByTestId('summary')).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { __listened: number }).__listened)).toBeGreaterThanOrEqual(2);
  await page.getByTestId('zurueck').click();
  await expect(page).toHaveURL(/\/lingue\/en$/);
  await expect(page.getByTestId('kurs-fortschritt')).toContainText('1/');
});

test('Quiz: Antwort mit der Stimme geben', async ({ page }) => {
  await page.addInitScript(micStub);
  await createProfile(page, 'Mia', '3', 'DE');
  await page.goto('/schule/3/mathe');
  await page.locator('[data-testid^="modul-"]').first().click();
  const area = page.getByTestId('task-area');
  await area.waitFor();
  // Erste Aufgabe mit Sprachantwort suchen (Auswahl oder Zahleneingabe)
  for (let i = 0; i < 10; i++) {
    if (await page.getByTestId('mikrofon-antwort').isVisible()) break;
    const idx = await area.getAttribute('data-index');
    await page.locator('[data-correct="true"]:not([disabled])').first().click().catch(() => {});
    await confirmAnswer(page);
    await waitNext(page, idx);
  }
  await expect(page.getByTestId('mikrofon-antwort')).toBeVisible();
  // Erst Einwilligung durch Eltern
  await page.getByTestId('mikrofon-antwort').click();
  await page.getByTestId('mikro-eltern').click();
  await page.getByTestId('pin-login-field').fill(PIN);
  await page.getByTestId('pin-login-key-ok').click();
  // Richtige Antwort „sagen“
  const correct = page.locator('[data-correct="true"]').first();
  const answer = (await correct.count()) ? (await correct.getAttribute('aria-label')) ?? '' : '';
  expect(answer).not.toBe('');
  await page.evaluate((a) => { (window as unknown as { __say: string }).__say = `ich glaube ${a}`; }, answer);
  await page.getByTestId('mikrofon-antwort').click();
  await expect(correct).toHaveAttribute('aria-pressed', 'true');
  await page.getByTestId('pruefen').click();
  await expect(area).toHaveAttribute('data-phase', 'correct');
});
