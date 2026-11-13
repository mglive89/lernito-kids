import { expect, test } from '@playwright/test';
import { createProfile, startExercises } from './helpers';

/** Ersetzt die Sprachausgabe durch eine Attrappe, die gesprochene Texte mitschreibt (verhält sich wie Chrome: asynchron, mit speaking/pending). */
const stub = () => {
  const said: string[] = [];
  (window as unknown as { __said: string[] }).__said = said;
  let speaking = false;
  const queue: SpeechSynthesisUtterance[] = [];
  const synth = {
    get speaking() { return speaking; }, get pending() { return queue.length > 0; }, paused: false,
    getVoices: () => [],
    speak(u: SpeechSynthesisUtterance) {
      queue.push(u);
      if (!speaking) next();
    },
    cancel() { queue.length = 0; speaking = false; },
    resume() { this.paused = false; }, pause() {},
    addEventListener() {}, removeEventListener() {}
  };
  function next() {
    const u = queue.shift();
    if (!u) { speaking = false; return; }
    speaking = true;
    if (u.text.trim()) said.push(u.text);
    setTimeout(() => { u.onend?.(new Event('end') as SpeechSynthesisEvent); next(); }, 200);
  }
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
};

test('Vorlesen: Knopf liest die Aufgabe vor, auch wenn gerade etwas gesprochen wird', async ({ page }) => {
  await page.addInitScript(stub);
  await createProfile(page, 'Nora', '1');
  await page.goto('/schule/1/deutsch');
  await page.getByTestId('modul-d1-lesen').click();
  await startExercises(page);
  const prompt = await page.getByTestId('task-prompt').innerText();
  await page.getByRole('button', { name: /^Vorlesen:/ }).first().click();
  await page.getByRole('button', { name: /^Vorlesen:/ }).first().click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __said: string[] }).__said.join(' | '))).toContain(prompt.trim().slice(0, 12));
  // Puppy-Tipp wird ebenfalls vorgelesen
  await page.getByTestId('puppy-hilfe').click();
  await page.getByTestId('puppy-mehr').click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __said: string[] }).__said.length)).toBeGreaterThan(2);
});
