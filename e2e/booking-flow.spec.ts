import { expect, test } from '@playwright/test';
import { login, pickFirstFreeSlot, watchConsole } from './helpers';

/** Critical path 2 — book: login → add → cart → checkout → slot → confirmation. */
test('logged-in user can check out a scheduled booking', async ({ page }) => {
  const errors = watchConsole(page);
  await login(page);

  // Add a service from a category page.
  await page.goto('/services');
  await page.getByRole('link', { name: /Men/ }).first().click();
  await page.locator('button[aria-label^="Add "]').first().click();
  await page.getByRole('button', { name: 'Continue' }).first().click();
  await expect(page).toHaveURL(/\/cart/);

  // Cart → checkout (already authenticated, no login redirect).
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/\/checkout/);

  // Default address auto-selects; schedule the arrival window.
  await page.getByRole('button', { name: /Add slot/ }).click();
  await pickFirstFreeSlot(page);
  await expect(page.getByRole('button', { name: 'Change' })).toBeVisible();

  // Place the booking (server-priced summary must have loaded to enable it).
  const placeOrder = page.getByRole('button', { name: 'Place order' });
  await expect(placeOrder).toBeEnabled();
  await placeOrder.click();

  await expect(page).toHaveURL(/\/booking-confirmation/);
  await expect(page.getByRole('heading', { name: 'Booking placed' })).toBeVisible();
  await expect(page.getByText(/BB-\d{8}-/).first()).toBeVisible();

  // The new booking is visible under My bookings.
  await page.getByRole('button', { name: 'View my bookings' }).click();
  await expect(page).toHaveURL(/\/bookings/);
  await expect(page.getByText(/BB-\d{8}-/).first()).toBeVisible();

  expect(errors).toEqual([]);
});
