import { test, expect } from '@playwright/test';

test('guest login sets session and navbar shows Guest', async ({ page }) => {
  const BASE = process.env.PLAYWRIGHT_BASE || 'http://localhost:3000/vintage-car-gallery';
  // go to account page
  await page.goto(`${BASE}/account`);
  // ensure button exists
  await page.waitForSelector('text=Continue as Guest');
  // click guest button
  await page.click('text=Continue as Guest');
  // wait for sessionStorage key to be set by the app
  await page.waitForFunction(() => !!sessionStorage.getItem('vintage_user'), null, { timeout: 5000 });

  // read sessionStorage for vintage_user
  const userRaw = await page.evaluate(() => sessionStorage.getItem('vintage_user'));
  expect(userRaw).not.toBeNull();
  const user = JSON.parse(userRaw);
  expect(user.username).toBe('Guest');

  // check navbar displays username
  await expect(page.locator('text=👤 Guest')).toBeVisible();
});
