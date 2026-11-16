import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.use({ locale: 'it-IT' });

/** Erste Einrichtung: Oberfläche Italienisch, „Parlo…“, „Voglio imparare…“ über die Suche */
async function setup(page: Page, known: string, knownQuery: string, target: string, targetQuery: string) {
  await page.goto('/sprachen/');
  await expect(page.getByTestId('lf-benvenuto')).toBeVisible();
  await page.getByTestId('ui-it').click();
  await page.getByTestId('ui-avanti').click();
  await page.getByTestId('picker-parlo').getByTestId('cerca-lingua').fill(knownQuery);
  await page.getByTestId('picker-parlo').getByTestId(`lingua-${known}`).first().click();
  await page.getByTestId('picker-imparo').getByTestId('cerca-lingua').fill(targetQuery);
  await page.getByTestId('picker-imparo').getByTestId(`lingua-${target}`).first().click();
}

/** Aktuelle Übung lösen (richtig oder absichtlich falsch) */
async function solve(page: Page, right = true) {
  const ex = page.getByTestId('esercizio');
  const type = await ex.getAttribute('data-type');
  if (type === 'order') {
    const n = await page.locator('[data-testid="segmento"]:not([data-pos="-1"])').count();
    const order = [...Array(n).keys()];
    if (!right) order.reverse();
    for (const i of order) await page.locator(`[data-testid="segmento"][data-pos="${i}"]`).click();
  } else if (await page.getByTestId('risposta').count()) {
    await page.getByTestId('risposta').fill(right ? (await page.getByTestId('risposta').getAttribute('data-answer'))! : 'xyz');
  } else {
    await page.locator(right ? '[data-testid="opzione"][data-correct="true"]' : '[data-testid="opzione"]:not([data-correct])').first().click();
  }
  await page.getByTestId('controlla').click();
  await expect(page.getByTestId('esito')).toHaveAttribute('data-ok', right ? 'true' : 'false');
  return type;
}

/** Ganze Lektion: Einführung, alle Übungen; wrongAt = Nummern der absichtlich falschen Antworten */
async function playLesson(page: Page, lessonTestId: string, wrongAt: number[] = []) {
  await page.getByTestId(lessonTestId).click();
  await expect(page.getByTestId('lf-intro')).toBeVisible();
  await page.getByTestId('inizia-esercizi').click();
  const types: string[] = [];
  for (let k = 0; k < 20; k++) {
    if (await page.getByTestId('lf-fine').isVisible()) break;
    await expect(page.getByTestId('lf-esercizi')).toHaveAttribute('data-index', String(k));
    types.push((await solve(page, !wrongAt.includes(k)))!);
    await page.getByTestId('continua').click();
  }
  await expect(page.getByTestId('lf-fine')).toBeVisible();
  return types;
}

test('LinguaFlow: Einrichtung, Lektion IT→DE, Fehler mit Erklärung und Ripasso', async ({ page }) => {
  await setup(page, 'it', 'ital', 'de', 'Deutsch');
  await expect(page.getByTestId('disponibile')).toBeVisible();
  await expect(page.getByTestId('corso-it-de-a1').getByTestId('numero-lezioni')).toHaveAttribute('data-n', '10');
  await page.getByTestId('inizia-corso').click();
  await expect(page.getByTestId('lf-corso')).toBeVisible();
  await expect(page.getByTestId('lista-lezioni').locator('li')).toHaveCount(10);
  await expect(page.getByTestId('tipo-corso').first()).toHaveAttribute('data-kind', 'course');
  await expect(page.getByTestId('qualita')).toHaveAttribute('data-quality', 'unreviewed');

  // Einführung: Ziel, Dialog, Wörter, Übersetzung getrennt
  await page.getByTestId('lezione-de-a1-01').click();
  await expect(page.getByTestId('obiettivo')).toContainText('Salutare');
  await expect(page.getByTestId('dialogo').getByTestId('riga')).toHaveCount(5);
  await expect(page.getByTestId('traduzione').first()).toHaveText('Ciao! Sono Lena.');
  await page.getByTestId('mostra-showTranslation').click();
  await expect(page.getByTestId('traduzione')).toHaveCount(0);
  await page.getByTestId('mostra-showTranslation').click();
  await page.getByTestId('chiudi-lezione').click();

  // Lektion mit einem Fehler (Lückentext): Erklärung auf Italienisch, gespeichert für den Ripasso
  await page.getByTestId('lezione-de-a1-01').click();
  await page.getByTestId('inizia-esercizi').click();
  const types: string[] = [];
  for (let k = 0; k < 7; k++) {
    const wrong = k === 2;
    types.push((await solve(page, !wrong))!);
    if (wrong) {
      await expect(page.getByTestId('spiegazione')).toContainText('Mi chiamo');
      await expect(page.getByTestId('spiegazione')).toHaveAttribute('lang', 'it');
      await expect(page.getByTestId('soluzione')).toContainText('Ich heiße Marco');
    }
    await page.getByTestId('continua').click();
  }
  expect(types).toEqual(['listen', 'choice', 'cloze', 'order', 'choice', 'write', 'situation']);
  await expect(page.getByTestId('lf-fine')).toHaveAttribute('data-score', '6');
  await expect(page.getByTestId('lf-fine')).toHaveAttribute('data-stars', '2');
  await page.getByTestId('fine-ripasso').click();
  await expect(page.getByTestId('lf-ripasso')).toHaveAttribute('data-n', '1');
  await page.getByTestId('inizia-ripasso').click();
  await expect(page.getByTestId('esercizio')).toHaveAttribute('data-type', 'cloze');
  await solve(page, true);
  await page.getByTestId('continua').click();
  await expect(page.getByTestId('ripasso-vuoto')).toBeVisible();
  await page.goto('/sprachen/#/corso');
  await expect(page.getByTestId('progresso-corso')).toHaveAttribute('data-done', '1');
  await expect(page.getByTestId('vai-ripasso')).toHaveAttribute('data-n', '0');
});

test('LinguaFlow: Kurswechsel ohne Verlust von Fortschritt und Fehlern', async ({ page }) => {
  await setup(page, 'it', 'italiano', 'de', 'tedesco');
  await page.getByTestId('inizia-corso').click();
  await playLesson(page, 'lezione-de-a1-01', [0]);
  await page.getByTestId('torna-lezioni').click();
  await expect(page.getByTestId('progresso-corso')).toHaveAttribute('data-done', '1');

  // Zweiter Kurs: Inglese (Introduzione, 3 Lektionen)
  await page.getByTestId('aggiungi-corso').click();
  await page.getByTestId('picker-imparo').getByTestId('cerca-lingua').fill('English');
  await page.getByTestId('picker-imparo').getByTestId('lingua-en').first().click();
  await expect(page.getByTestId('corso-it-en-intro').getByTestId('tipo-corso')).toHaveAttribute('data-kind', 'intro');
  await page.getByTestId('inizia-corso').click();
  await expect(page.getByTestId('lf-corso')).toHaveAttribute('data-course', 'it-en-intro');
  await expect(page.getByTestId('corso-breve')).toBeVisible();
  await expect(page.getByTestId('progresso-corso')).toHaveAttribute('data-done', '0');
  await expect(page.getByTestId('vai-ripasso')).toHaveAttribute('data-n', '0');
  await playLesson(page, 'lezione-en-intro-01');
  await page.getByTestId('torna-lezioni').click();

  // Zurück zu Tedesco: Fortschritt und Fehler sind noch da
  await page.goto('/sprachen/#/scegli');
  await page.getByTestId('mio-corso-it-de-a1').click();
  await expect(page.getByTestId('lf-corso')).toHaveAttribute('data-course', 'it-de-a1');
  await expect(page.getByTestId('progresso-corso')).toHaveAttribute('data-done', '1');
  await expect(page.getByTestId('vai-ripasso')).toHaveAttribute('data-n', '1');
  await page.reload();
  await expect(page.getByTestId('lf-corso')).toHaveAttribute('data-course', 'it-de-a1');
  await page.goto('/sprachen/#/scegli');
  await page.getByTestId('mio-corso-it-en-intro').click();
  await expect(page.getByTestId('progresso-corso')).toHaveAttribute('data-done', '1');
});

test('LinguaFlow: Kurs nicht verfügbar – Hinweis, Ausgangssprachen, Auswahl bleibt', async ({ page }) => {
  await setup(page, 'en', 'English', 'de', 'German');
  await expect(page.getByTestId('non-disponibile')).toBeVisible();
  await expect(page.getByTestId('inizia-corso')).toHaveCount(0);
  await expect(page.getByTestId('altre-lingue-partenza')).toContainText('Italiano');
  await page.reload();
  await expect(page.getByTestId('picker-imparo').getByTestId('lingua-de').first()).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('sezione-parlo')).toContainText('Inglese');
  // Variante ohne Inhalte: Portoghese brasiliano
  await page.getByTestId('cambia-parlo').click();
  await page.getByTestId('picker-parlo').getByTestId('cerca-lingua').fill('ital');
  await page.getByTestId('picker-parlo').getByTestId('lingua-it').first().click();
  await page.getByTestId('picker-imparo').getByTestId('cerca-lingua').fill('Português');
  await page.getByTestId('picker-imparo').getByTestId('lingua-pt-BR').first().click();
  await expect(page.getByTestId('non-disponibile')).toBeVisible();
  await expect(page.getByTestId('picker-imparo').getByTestId('lingua-pt-BR').first().getByTestId('tipo-corso')).toHaveAttribute('data-kind', 'none');
});

test('LinguaFlow: ohne Stimme wird Hören zu Lesen, mit Stimme gibt es Audio', async ({ page }) => {
  await setup(page, 'it', 'ital', 'fr', 'franc');
  await page.getByTestId('inizia-corso').click();
  await page.getByTestId('lezione-fr-intro-01').click();
  await expect(page.getByTestId('nessuna-voce')).toBeVisible();
  await expect(page.getByTestId('ascolta')).toHaveCount(0);
  await page.getByTestId('inizia-esercizi').click();
  await expect(page.getByTestId('esercizio')).toHaveAttribute('data-mode', 'lettura');
  await expect(page.getByTestId('esercizio').getByTestId('testo-lingua')).toHaveText('Au revoir');

  // Gerät mit französischer Stimme (simuliert)
  await page.addInitScript(() => {
    const voice = { lang: 'fr-FR', name: 'Test FR', localService: true, default: true, voiceURI: 'fr' };
    const synth = window.speechSynthesis;
    // Testgerät: Äußerungen nur mitschreiben (echte Stimmen gibt es im Test-Browser nicht)
    (window as unknown as { SpeechSynthesisUtterance: unknown }).SpeechSynthesisUtterance = class { text: string; constructor(t: string) { this.text = t; } };
    Object.defineProperty(synth, 'getVoices', { value: () => [voice] });
    Object.defineProperty(synth, 'speak', { value: (u: SpeechSynthesisUtterance) => { (window as unknown as { spoken: string[] }).spoken = [...((window as unknown as { spoken?: string[] }).spoken ?? []), u.text]; } });
  });
  await page.reload();
  await page.goto('/sprachen/#/lezione/it-fr-intro/fr-intro-01');
  await expect(page.getByTestId('nessuna-voce')).toHaveCount(0);
  await expect(page.getByTestId('ascolta').first()).toBeVisible();
  await page.getByTestId('inizia-esercizi').click();
  await expect(page.getByTestId('esercizio')).toHaveAttribute('data-mode', 'ascolto');
  await expect(page.getByTestId('esercizio').getByTestId('testo-lingua')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => (window as unknown as { spoken?: string[] }).spoken ?? [])).toContain('Au revoir');
});

test('LinguaFlow: Demo Arabisch (RTL, Umschrift) und Japanisch (Segmente ohne Leerzeichen)', async ({ page }) => {
  await setup(page, 'it', 'ital', 'ar', 'العربية');
  await expect(page.getByTestId('corso-it-ar-demo').getByTestId('tipo-corso')).toHaveAttribute('data-kind', 'demo');
  await expect(page.getByTestId('corso-it-ar-demo').getByTestId('numero-lezioni')).toHaveAttribute('data-n', '1');
  await page.getByTestId('inizia-corso').click();
  await page.getByTestId('lezione-ar-demo-01').click();
  const first = page.getByTestId('dialogo').getByTestId('testo-lingua').first();
  await expect(first).toHaveAttribute('dir', 'rtl');
  await expect(first).toHaveAttribute('lang', 'ar');
  await expect(page.getByTestId('dialogo').getByTestId('trascrizione').first()).toHaveText('marḥaban! ana sāra.');
  await expect(page.getByTestId('dialogo').getByTestId('traduzione').first()).toHaveAttribute('dir', 'ltr');
  await page.getByTestId('mostra-showTranslit').click();
  await expect(page.getByTestId('trascrizione')).toHaveCount(0);
  await page.getByTestId('mostra-showTranslit').click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: test.info().outputPath('arabo.png'), fullPage: true });
  await page.getByTestId('chiudi-lezione').click();
  const types = await playLesson(page, 'lezione-ar-demo-01');
  expect(types).toContain('order');

  await page.goto('/sprachen/#/scegli');
  await page.getByTestId('picker-imparo').getByTestId('cerca-lingua').fill('日本語');
  await page.getByTestId('picker-imparo').getByTestId('lingua-ja').first().click();
  await page.getByTestId('inizia-corso').click();
  await page.getByTestId('lezione-ja-demo-01').click();
  await page.getByTestId('inizia-esercizi').click();
  for (let k = 0; k < 3; k++) { await solve(page); await page.getByTestId('continua').click(); }
  await expect(page.getByTestId('esercizio')).toHaveAttribute('data-type', 'order');
  await expect(page.getByTestId('segmento')).toHaveCount(4);
  await solve(page);
  await expect(page.getByTestId('risposta-ordine')).toHaveText('イタリアからきました');
});

test('LinguaFlow: neues Kurspaket ohne Änderung an den Komponenten', async ({ page }) => {
  const dir = 'docs/linguaflow/example';
  const extra = JSON.parse(readFileSync(`${dir}/courses.json`, 'utf8'));
  await page.route('**/linguaflow/courses.json', async (route) => {
    const res = await route.fetch();
    const json = await res.json();
    json.courses.push(...extra.courses);
    await route.fulfill({ response: res, json });
  });
  await page.route('**/linguaflow/*/nl/*.json', (route) => {
    const path = new URL(route.request().url()).pathname.split('/linguaflow/')[1]!;
    return route.fulfill({ contentType: 'application/json', body: readFileSync(`${dir}/${path}`, 'utf8') });
  });
  await setup(page, 'it', 'ital', 'nl', 'Nederlands');
  await expect(page.getByTestId('corso-it-nl-esempio')).toBeVisible();
  await page.getByTestId('inizia-corso').click();
  await expect(page.getByTestId('titolo-corso')).toHaveText('Olandese – Esempio');
  await playLesson(page, 'lezione-nl-voorbeeld-01');
});

test('LinguaFlow: Lektionen und Fortschritt offline', async ({ page, context }) => {
  await page.goto('/sprachen/');
  await page.waitForFunction(async () => (await navigator.serviceWorker.ready).active?.state === 'activated');
  await setup(page, 'it', 'ital', 'es', 'espa');
  await page.getByTestId('inizia-corso').click();
  await playLesson(page, 'lezione-es-intro-01');
  await page.getByTestId('torna-lezioni').click();
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByTestId('lf-corso')).toBeVisible();
  await expect(page.getByTestId('progresso-corso')).toHaveAttribute('data-done', '1');
  // auch eine noch nie geöffnete Lektion eines anderen Kurses (Pakete sind vorab gespeichert)
  await page.goto('/sprachen/#/scegli');
  await page.getByTestId('picker-imparo').getByTestId('cerca-lingua').fill('tedesco');
  await page.getByTestId('picker-imparo').getByTestId('lingua-de').first().click();
  await page.getByTestId('inizia-corso').click();
  await page.getByTestId('lezione-de-a1-09').click();
  await expect(page.getByTestId('titolo-lezione')).toHaveText('Al ristorante');
  await context.setOffline(false);
});

test('LinguaFlow: Effekte – Serie, Sterne und Schalter in den Einstellungen', async ({ page }) => {
  await setup(page, 'it', 'ital', 'es', 'espa');
  await page.getByTestId('inizia-corso').click();
  await page.getByTestId('lezione-es-intro-01').click();
  await page.getByTestId('inizia-esercizi').click();
  for (let k = 0; k < 3; k++) { await solve(page); if (k < 2) await page.getByTestId('continua').click(); }
  await expect(page.getByTestId('serie')).toContainText('3');
  await page.goto('/sprachen/#/impostazioni');
  await expect(page.getByTestId('opz-effects')).toBeChecked();
  await page.getByTestId('opz-effects').uncheck();
  await page.reload();
  await expect(page.getByTestId('opz-effects')).not.toBeChecked();
  await page.goto('/sprachen/#/corso');
  await playLesson(page, 'lezione-es-intro-02');
  await expect(page.getByTestId('lf-fine')).toHaveAttribute('data-stars', '3');
});
