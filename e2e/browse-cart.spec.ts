import { expect, test } from '@playwright/test';
import { watchConsole } from './helpers';

/** Critical path 1 — guest browse: home → catalog → category → add → cart. */
test('guest can browse a category and build a cart', async ({ page }) => {
  const errors = watchConsole(page);

  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Beauty Bus/);

  await page.goto('/services');
  await expect(page.getByRole('heading', { name: 'Our Services' })).toBeVisible();
  await page.getByRole('link', { name: /Men/ }).first().click();

  // Immersive category page: combos + singles rows.
  await expect(page).toHaveURL(/\/categories\//);
  await expect(page.getByRole('heading', { level: 2, name: 'Combos' })).toBeVisible();

  // Quick-add the first service; the sticky cart bar appears.
  await page.locator('button[aria-label^="Add "]').first().click();
  await expect(page.getByText(/added to cart/i).first()).toBeVisible();
  await page.getByRole('button', { name: 'Continue' }).first().click();

  // Cart shows the line item and the checkout CTA.
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();

  expect(errors).toEqual([]);
});
