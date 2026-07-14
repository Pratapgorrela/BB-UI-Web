import { expect, test } from '@playwright/test';
import { BID, login, pickFirstFreeSlot, watchConsole } from './helpers';

/** Critical path 3 — manage: reschedule and cancel a modifiable booking. */

test('user can reschedule an upcoming booking', async ({ page }) => {
  const errors = watchConsole(page);
  await login(page);

  // Seed booking 1: PENDING, 2 days out — modifiable.
  await page.goto(`/bookings/${BID(1)}`);
  await page.getByRole('button', { name: 'Reschedule' }).click();
  await pickFirstFreeSlot(page);

  await expect(page.getByText(/rescheduled/i).first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('user can cancel an upcoming booking with a reason', async ({ page }) => {
  const errors = watchConsole(page);
  await login(page);

  await page.goto(`/bookings/${BID(1)}`);
  await page.getByRole('button', { name: 'Cancel' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.locator('textarea').fill('Travelling out of town that week, sorry!');
  await dialog.getByRole('button', { name: 'Cancel booking' }).click();

  // Detail updates to CANCELLED with the stored reason.
  await expect(page.getByText('Cancelled').first()).toBeVisible();
  await expect(page.getByText(/Travelling out of town/).first()).toBeVisible();
  expect(errors).toEqual([]);
});
