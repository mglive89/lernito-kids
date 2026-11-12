import { expect, test } from '@playwright/test';
import { createProfile } from './helpers';

test('Thema hell/dunkel wählen, bleibt nach Neuladen erhalten; Wochenübersicht sichtbar', async ({ page }) => {
  await createProfile(page, 'Lea', '3');
  await expect(page.getByTestId('wochen-aktivitaet')).toBeVisible();
  await page.goto('/profil');
  await page.getByTestId('thema-dunkel').click();
  await expect(page.locator('html')).toHaveClass(/dunkel/);
  await expect(page.getByTestId('thema-dunkel')).toHaveAttribute('aria-checked', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dunkel/);
  await page.getByTestId('thema-hell').click();
  await expect(page.locator('html')).not.toHaveClass(/dunkel/);
});
