import { expect, test } from '@playwright/test';
import { login, watchConsole } from './helpers';

/** Critical path 5 — support surfaces: help FAQs (guest) + policies (F17). */

test('guest can read FAQs and policies', async ({ page }) => {
  const errors = watchConsole(page);

  await page.goto('/help');
  await expect(page.getByRole('heading', { name: 'Help & support' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Frequently asked questions' })).toBeVisible();

  await page.goto('/policies');
  await expect(page.getByRole('heading', { name: 'Terms & policies' })).toBeVisible();
  await page.getByRole('link', { name: /Cancellation & refund policy/ }).click();
  await expect(page.getByText(/Last updated/)).toBeVisible();
  await expect(page.getByText(/2 hours before/).first()).toBeVisible();

  // Unknown slug → recoverable empty state, not a crash.
  await page.goto('/policies/not-a-policy');
  await expect(page.getByRole('heading', { name: 'Policy not found' })).toBeVisible();
  await page.getByRole('button', { name: 'Back to policies' }).click();
  await expect(page).toHaveURL(/\/policies$/);

  expect(errors).toEqual([]);
});

test('profile menu reaches policies (stub retired)', async ({ page }) => {
  const errors = watchConsole(page);
  await login(page);

  await page.goto('/profile');
  await page.getByRole('link', { name: 'Terms & policies' }).click();
  await expect(page).toHaveURL(/\/policies$/);

  expect(errors).toEqual([]);
});
