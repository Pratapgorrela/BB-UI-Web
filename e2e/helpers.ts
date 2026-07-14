import { expect, type Page } from '@playwright/test';

/** Seeded demo login (see src/mocks/data/users.data.ts). */
export const PRIYA = { email: 'priya@example.com', password: 'Priya@123' };

/** Stable seed ids — mirror sid()/seedBookingId() in src/mocks/data. */
export const SID = (n: number) => `bb5e0000-0000-4000-8000-${String(n).padStart(12, '0')}`;
export const BID = (n: number) => `bb8f0000-0000-4000-8000-${String(n).padStart(12, '0')}`;

export async function login(page: Page): Promise<void> {
  await page.goto('/login');
  await page.fill('input[type="email"]', PRIYA.email);
  await page.fill('input[type="password"]', PRIYA.password);
  await page.click('button[type="submit"]');
  await expect(page).not.toHaveURL(/\/login/);
}

/**
 * Collects unexpected console errors. Handled failures log with a
 * `[Module]` prefix by convention (Rule 4) and are excluded — anything
 * unprefixed (or a page crash) is a real defect.
 */
export function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('[')) {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

/**
 * In the open slot picker: choose tomorrow (today's windows may already be
 * in the past), tap the first available window pill, confirm.
 */
export async function pickFirstFreeSlot(page: Page): Promise<void> {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('group', { name: 'Choose a date' }).getByRole('button').nth(1).click();
  const pill = dialog.locator('section button:not([disabled])').first();
  await expect(pill).toBeVisible();
  await pill.click();
  await dialog.getByRole('button', { name: 'Confirm slot' }).click();
  await expect(dialog).toBeHidden();
}
