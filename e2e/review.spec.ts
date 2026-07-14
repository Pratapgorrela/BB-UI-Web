import { expect, test } from '@playwright/test';
import { BID, login, watchConsole } from './helpers';

/** Critical path 4 — F10: review a completed booking, see it on the service page. */
test('user can review a completed booking and it appears on the service page', async ({
  page,
}) => {
  const errors = watchConsole(page);
  await login(page);

  // Seed booking 5: COMPLETED, multi-service, un-reviewed.
  await page.goto(`/bookings/${BID(5)}`);
  await page.getByRole('button', { name: 'Write a review' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Multi-service booking → the form asks which service the review is about.
  const serviceSelect = dialog.locator('select');
  await expect(serviceSelect).toBeVisible();
  const reviewedServiceId = await serviceSelect.inputValue();

  await dialog.getByRole('radio', { name: '5 stars' }).click();
  await dialog
    .locator('textarea')
    .fill('Wonderful doorstep experience — punctual, hygienic and relaxing.');
  await dialog.getByRole('button', { name: 'Submit review' }).click();

  await expect(page.getByText(/review has been published/i).first()).toBeVisible();

  // The review shows first (createdAt DESC) on the reviewed service's page.
  await page.goto(`/services/${reviewedServiceId}`);
  const firstReview = page.locator('article').first();
  await expect(firstReview).toContainText('Priya');
  await expect(firstReview).toContainText('punctual, hygienic and relaxing');

  expect(errors).toEqual([]);
});
