import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE || 'http://localhost:3000/vintage-car-gallery';

test('guest can favorite a car', async ({ page }) => {
  // login as guest
  await page.goto(`${BASE}/account`);
  await page.waitForSelector('text=Continue as Guest');
  await page.click('text=Continue as Guest');
  await page.waitForFunction(() => !!sessionStorage.getItem('vintage_user'), null, { timeout: 5000 });

  // go to home and wait for cards
  await page.goto(`${BASE}/`);
  await page.waitForSelector('.car-card');

  const firstCard = page.locator('.car-card').first();
  const favButton = firstCard.locator('button[aria-label="Add to favorites"], button[aria-label="Remove from favorites"]');

  // normalize to not-favorited state: if currently "Remove from favorites", click to remove
  const initialLabel = await favButton.getAttribute('aria-label');
  if (initialLabel === 'Remove from favorites') {
    await favButton.click();
    await expect(favButton).toHaveAttribute('aria-label', 'Add to favorites');
  }

  // now add to favorites and assert
  await favButton.click();
  await expect(favButton).toHaveAttribute('aria-label', 'Remove from favorites');
  await expect(favButton).toContainText('Saved');
});

test('guest can upload a car (preview + submit)', async ({ page }) => {
  // login as guest
  await page.goto(`${BASE}/account`);
  await page.waitForSelector('text=Continue as Guest');
  await page.click('text=Continue as Guest');
  await page.waitForFunction(() => !!sessionStorage.getItem('vintage_user'), null, { timeout: 5000 });

  // go to upload page
  await page.goto(`${BASE}/upload`);
  await page.waitForSelector('text=Attach images from your PC');

  // fill required fields
  await page.fill('input[name="name"]', 'Playwright Test Car');
  await page.fill('input[name="brand"]', 'Playwright Motors');

  // create a tiny 1x1 PNG in-memory and attach
  const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  const buffer = Buffer.from(base64Png, 'base64');
  await page.setInputFiles('input[type="file"]', { name: 'dummy.png', mimeType: 'image/png', buffer });

  // wait for preview image to appear
  await page.waitForSelector('img[alt^="Preview"]');
  const previews = await page.locator('img[alt^="Preview"]').count();
  expect(previews).toBeGreaterThan(0);

  // submit form and expect success message (app shows status/toast)
  await page.click('text=✨ Add to Gallery');
  await page.waitForSelector('text=Car added successfully', { timeout: 5000 });
});
