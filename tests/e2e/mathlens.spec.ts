import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createProfile, PIN } from './helpers';

const FIX = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'mathlens');
const APP = '/mathlens/';

async function open(page: Page, hash = '') {
  await page.goto(`${APP}${hash ? `#${hash}` : ''}`);
  await expect(page.getByTestId('mathlens-app')).toBeVisible();
}

/** Foto hochladen, ganzes Bild als Ausschnitt lassen, erkennen. Liefert die gelesene Formel. */
async function scanFile(page: Page, file: string): Promise<string> {
  await open(page);
  await page.getByTestId('ml-foto-input').setInputFiles(join(FIX, file));
  await expect(page.getByTestId('zuschnitt')).toBeVisible();
  await page.getByTestId('riconosci').click();
  await expect(page.getByTestId('formula')).toBeVisible({ timeout: 90_000 });
  return page.getByTestId('formula').inputValue();
}

async function typeKeys(page: Page, keys: string[]) {
  for (const k of keys) await page.locator(`[data-key="${k}"]`).click();
}

const norm = (s: string) => s.replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/[×·*]/g, '×').replace(/,/g, '.');

test.describe('MathLens', () => {
  test.describe.configure({ timeout: 180_000 });

  test('Foto → Formel prüfen → Tipp und Lösung, Verlauf', async ({ page }) => {
    const read = await scanFile(page, '01-equazione-parentesi.png');
    expect(norm(read)).toBe(norm('3(2x − 4) = 18'));
    await expect(page.getByTestId('ritaglio')).toBeVisible();
    await expect(page.getByTestId('formel-vorschau')).toBeVisible();
    await page.getByTestId('conferma').click();
    // Tipp-Modus: erst Hinweis, dann Schritt
    await expect(page.getByTestId('hinweis-text')).toContainText('parentesi');
    await page.getByTestId('schritt-zeigen').click();
    await expect(page.getByTestId('ml-schritt-0')).toBeVisible();
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByTestId('beide-seiten').first()).toBeVisible();
    await expect(page.getByTestId('ml-ergebnis-wert')).toHaveText('x = 5');
    await expect(page.getByText('Sostituisci x = 5')).toBeVisible();
    // Verlauf: ohne Foto gespeichert
    await page.getByTestId('apri-cronologia').click();
    await expect(page.getByTestId('voce-cronologia')).toHaveCount(1);
    const stored = await page.evaluate(() => localStorage.getItem('mathlens-history') ?? '');
    expect(stored).toContain('x = 5');
    expect(stored).not.toContain('data:image');
    expect(stored).not.toContain('blob:');
  });

  test('Formel mit x oder × muss kontrolliert und korrigiert werden', async ({ page }) => {
    const read = await scanFile(page, '12-x-o-per.png');
    expect(norm(read)).toContain('4x3');
    await expect(page.getByTestId('ambiguita')).toContainText('incognita x o il segno per');
    // Korrigieren mit der Mathe-Tastatur
    const f = page.getByTestId('formula');
    await f.fill('');
    await typeKeys(page, ['4', '×', '3', '+', '2']);
    await expect(f).toHaveValue('4×3+2');
    await page.getByTestId('conferma').click();
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByTestId('ml-ergebnis-wert')).toHaveText('14');
  });

  test('Bruch übereinander wird nicht erraten', async ({ page }) => {
    await scanFile(page, '09-frazione-impilata.png');
    await expect(page.getByTestId('ambiguita')).toContainText('frazione scritta su due righe');
  });

  test('Pflicht-Beispiele und Sonderfälle mit der Tastatur', async ({ page }) => {
    const solveTyped = async (text: string) => {
      await open(page);
      await page.getByTestId('azione-scrivi').click();
      await page.getByTestId('formula').fill(text);
      await page.getByTestId('conferma').click();
    };
    await solveTyped('1/2 + 3/4');
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByTestId('ml-ergebnis-wert')).toHaveText('5/4');
    await solveTyped('15% di 80');
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByTestId('ml-ergebnis-wert')).toHaveText('12');
    await solveTyped('x + 1 = x');
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByTestId('ml-ergebnis-wert')).toHaveText('Nessuna soluzione');
    await solveTyped('2(x + 1) = 2x + 2');
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByTestId('ml-ergebnis-wert')).toHaveText('Infinite soluzioni');
    // 1/0 und nicht unterstützte Aufgaben: klare Meldung, keine Lösung
    await solveTyped('1/0');
    await expect(page.getByTestId('non-supportato')).toContainText('dividere per 0');
    await solveTyped('2y + 3 = 7');
    await expect(page.getByTestId('non-supportato')).toContainText('Per ora risolvo solo');
  });

  test('Bruch-Taste der Mathe-Tastatur', async ({ page }) => {
    await open(page);
    await page.getByTestId('azione-scrivi').click();
    await typeKeys(page, ['a/b', '1']);
    await page.locator('[aria-label="Cursore a destra"]').click();
    await page.locator('[aria-label="Cursore a destra"]').click();
    await page.locator('[aria-label="Cursore a destra"]').click();
    await typeKeys(page, ['2']);
    await page.locator('[aria-label="Cursore a destra"]').click();
    await typeKeys(page, ['+', 'a/b', '3']);
    for (let i = 0; i < 3; i++) await page.locator('[aria-label="Cursore a destra"]').click();
    await typeKeys(page, ['4']);
    await expect(page.getByTestId('formula')).toHaveValue('(1)/(2)+(3)/(4)');
    await page.getByTestId('conferma').click();
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByTestId('ml-ergebnis-wert')).toHaveText('5/4');
  });

  test('Kamera verweigert: sofort Hochladen oder Eintippen anbieten', async ({ page }) => {
    await open(page);
    await page.getByTestId('azione-scansiona').click();
    await expect(page.getByTestId('kamera-fehler')).toBeVisible();
    await expect(page.getByTestId('fallback-carica')).toBeVisible();
    await page.getByTestId('fallback-scrivi').click();
    await expect(page.getByTestId('formula')).toBeVisible();
  });

  test('Sprache IT/DE wird gemerkt', async ({ page }) => {
    await open(page);
    await expect(page.getByTestId('azione-scansiona')).toContainText('Scansiona');
    await page.getByTestId('lingua-de').click();
    await expect(page.getByTestId('azione-scansiona')).toContainText('Scannen');
    await page.reload();
    await expect(page.getByTestId('azione-scansiona')).toContainText('Scannen');
    await page.getByTestId('azione-scrivi').click();
    await page.getByTestId('formula').fill('3(2x - 4) = 18');
    await page.getByTestId('conferma').click();
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByText('Setze x = 5 in die ursprüngliche Gleichung ein').first()).toBeVisible();
    // Wechsel mitten in der Lösung: Erklärung kommt in der neuen Sprache
    await page.getByTestId('lingua-it').click();
    await expect(page.getByText('Sostituisci x = 5').first()).toBeVisible();
  });

  test('Offline: Tastatur, Rechnen und Verlauf', async ({ page, context }) => {
    await open(page);
    await page.waitForFunction(async () => (await navigator.serviceWorker.ready).active?.state === 'activated');
    await page.reload();
    await page.waitForFunction(() => !!navigator.serviceWorker.controller);
    await context.setOffline(true);
    await page.reload();
    await page.getByTestId('azione-scrivi').click();
    await typeKeys(page, ['5', 'x', '−', '3', '=', '2', 'x', '+', '9']);
    await page.getByTestId('conferma').click();
    await page.getByTestId('modus-loesung').click();
    await expect(page.getByTestId('ml-ergebnis-wert')).toHaveText('x = 4');
    await page.getByTestId('apri-cronologia').click();
    await page.getByTestId('elimina-voce').first().click();
    await expect(page.getByTestId('voce-cronologia')).toHaveCount(0);
    await context.setOffline(false);
  });

  test('Lernito: „Aiutami con i compiti“ öffnet MathLens, Kinder brauchen die Eltern-Freigabe für die Kamera', async ({ page }) => {
    await createProfile(page, 'Giulia', '6', 'IT');
    await page.goto('/entdecken');
    await page.getByTestId('entdecken-hausaufgaben').click();
    await expect(page).toHaveURL(/mathlens\/$/);
    await expect(page.getByTestId('mathlens-app')).toBeVisible();
    await page.getByTestId('azione-scansiona').click();
    await expect(page.getByTestId('ml-kamera-einwilligung')).toBeVisible();
    await page.getByTestId('ml-kamera-eltern').click();
    await page.getByTestId('pin-login-field').fill(PIN);
    await page.getByTestId('pin-login-key-ok').click();
    await expect(page.getByTestId('kamera-fehler')).toBeVisible(); // im Test gibt es keine Kamera
  });
});

/** Misst die Texterkennung an allen Beispielfotos; Ergebnis für die README. */
test('MathLens: Erkennungsrate der Beispielfotos', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop');
  test.setTimeout(600_000);
  const expected = JSON.parse(readFileSync(join(FIX, 'expected.json'), 'utf8')) as Record<string, string>;
  const rows: { file: string; expected: string; read: string; ok: boolean; warned: boolean }[] = [];
  for (const [file, exp] of Object.entries(expected)) {
    const read = await scanFile(page, file);
    const warned = (await page.getByTestId('ambiguita').count()) > 0 || (await page.getByTestId('formula-errore').count()) > 0;
    rows.push({ file, expected: exp, read, ok: exp === '' ? warned : norm(read) === norm(exp), warned });
  }
  mkdirSync('test-results', { recursive: true });
  writeFileSync('test-results/mathlens-ocr.json', JSON.stringify(rows, null, 2));
  console.log(rows.map((r) => `${r.ok ? '✓' : r.warned ? '!' : '✗'} ${r.file}: «${r.read}»`).join('\n'));
  // Die Pflicht-Beispiele müssen stimmen
  for (const f of ['01-equazione-parentesi.png', '02-frazioni.png', '03-percentuale.png']) expect(rows.find((r) => r.file === f)!.ok, f).toBe(true);
});
