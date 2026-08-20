import { expect, test } from '@playwright/test';

test('health endpoint reports a complete configuration', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({ ok: true, missing: [] });
});

test('a signed-out visitor is redirected from reporting to login', async ({ page }) => {
  await page.goto('/report');
  await expect(page).toHaveURL(/\/login\?next=%2Freport$/);
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});
