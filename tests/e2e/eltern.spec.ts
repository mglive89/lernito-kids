import { expect, test } from '@playwright/test';
import { createProfile, setupParentPin } from './helpers';

test('Elternbereich: PIN, Aufgabe zuweisen, Zeitlimit, Export', async ({ page }) => {
  await createProfile(page, 'Mia', '1');
  await setupParentPin(page);
  await page.getByTestId('tab-aufgaben').click();
  await page.locator('summary', { hasText: 'Mathematik · 1. Klasse' }).click();
  await page.getByTestId('assign-m1-minus').check();
  await page.getByTestId('tab-ziele').click();
  await page.getByTestId('limit-15').click();
  await page.getByTestId('tab-datenschutz').click();
  await expect(page.getByTestId('consent-ai')).not.toBeChecked();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export').click()]);
  expect(download.suggestedFilename()).toMatch(/lernito-daten-.*\.json/);
  await page.getByTestId('eltern-abmelden').click();

  await page.getByTestId('profile-Mia').click();
  await expect(page.getByText('Aufgaben für dich')).toBeVisible();
  await expect(page.getByRole('link', { name: /Minus bis 20/ }).first()).toBeVisible();

  // Gesperrt: falsche PIN wird abgelehnt
  await page.goto('/eltern');
  await page.getByTestId('pin-login-field').fill('0000');
  await page.getByTestId('pin-login-key-ok').click();
  await expect(page.getByText('Falsche PIN (1/5)')).toBeVisible();
});

test('Admin: eigenes Modul anlegen, veröffentlichen und spielen', async ({ page }) => {
  await createProfile(page, 'Kim', '2');
  await setupParentPin(page);
  await page.getByTestId('zum-admin').click();
  const n = await page.getByTestId('adult-number').getAttribute('data-value');
  await page.getByTestId('adult-input').fill(n ?? '');
  await page.getByTestId('adult-submit').click();
  await page.getByTestId('admin-pin-field').fill('2468');
  await page.getByTestId('admin-pin-key-ok').click();
  await page.getByTestId('modul-neu').click();
  await page.getByTestId('modul-titel').fill('Tiere im Wald');
  await page.getByTestId('modul-stufe').selectOption('2');
  await page.getByTestId('modul-fach').selectOption('sachkunde');
  await page.getByTestId('frage-0').fill('Welches Tier hat Stacheln?');
  await page.getByTestId('antwort-0-0').fill('Igel');
  await page.getByTestId('antwort-0-1').fill('Reh');
  await page.getByTestId('modul-veroeffentlichen').click();
  await expect(page.getByText('Tiere im Wald')).toBeVisible();

  await page.goto('/');
  await page.getByTestId('profile-Kim').click();
  await page.goto('/schule/2/sachkunde');
  await page.getByText('Tiere im Wald').click();
  await expect(page.getByTestId('task-prompt')).toHaveText('Welches Tier hat Stacheln?');
  await page.locator('[data-correct="true"]').click();
  await expect(page.getByTestId('summary')).toBeVisible({ timeout: 5000 });
});

test('Zeitlimit zeigt freundliche Pause', async ({ page }) => {
  await createProfile(page, 'Paul', 'kita');
  await setupParentPin(page);
  await page.getByTestId('tab-ziele').click();
  await page.getByTestId('limit-10').click();
  // Lernzeit für heute simulieren
  await page.evaluate(() => {
    const key = 'lernito-backup:lernito-state';
    const state = JSON.parse(localStorage.getItem(key)!);
    const pid = state.state.profiles[0].id;
    const d = new Date();
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    state.state.progress[pid].daily[day] = { seconds: 700, rounds: 0, stars: 0 };
    state.state.activeProfileId = pid;
    localStorage.setItem(key, JSON.stringify(state));
  });
  await page.goto('/home');
  await expect(page.getByText('Zeit für eine Pause!')).toBeVisible();
});
