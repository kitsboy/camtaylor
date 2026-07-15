import { test, expect } from '@playwright/test';

test('homepage loads with hero and sections', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Cam Taylor.*Sherpa/);
  await expect(page.getByRole('heading', { name: /Sherpa/i }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /Sherpa Philosophy/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Areas of Expertise/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Active Ventures/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Get in Touch/i })).toBeVisible();
});

test('navigation scrolls to contact', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Connect' }).first().click();
  await expect(page.locator('#contact')).toBeInViewport();
});

test('hash routing scrolls to contact', async ({ page }) => {
  await page.goto('/#contact');
  await expect(page.locator('#contact')).toBeInViewport({ timeout: 8000 });
});

test('legal pages render', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page).toHaveTitle(/Privacy Policy/);
  await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();

  await page.goto('/terms');
  await expect(page).toHaveTitle(/Terms of Use/);
  await expect(page.getByRole('heading', { name: 'Terms of Use' })).toBeVisible();
});

test('mobile viewport renders quick nav and hero video', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('navigation', { name: 'Quick section navigation' })).toBeVisible();
  await expect(page.getByLabel(/Play.*Intro/i)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
});

test('mobile menu opens and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.locator('#mobile-nav-menu');
  await expect(menu).toHaveClass(/nav-mobile-menu--open/);

  await menu.getByRole('button', { name: 'Ventures' }).click();
  await expect(page.locator('#ventures')).toBeInViewport({ timeout: 8000 });
});

test('field guide and 2026 pages render', async ({ page }) => {
  await page.goto('/field-guide');
  await expect(page.getByRole('heading', { name: /Sherpa Field Guide/i })).toBeVisible();

  await page.goto('/2026');
  await expect(page.getByRole('heading', { name: /State of the Route/i })).toBeVisible();
});

test('venture route page renders', async ({ page }) => {
  await page.goto('/route/giveabit');
  await expect(page.getByRole('heading', { name: /GiveABit/i })).toBeVisible();
});

test('404 page renders', async ({ page }) => {
  await page.goto('/nonexistent-trail');
  await expect(page.getByRole('heading', { name: /Off the map/i })).toBeVisible();
});

test('venture filter works', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Live', exact: true }).click();
  await expect(page.locator('#ventures .venture-name', { hasText: 'Satohash' })).toBeVisible();
});

test('command deck opens and shows help', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle Command Deck' }).click();
  await expect(page.getByRole('dialog', { name: 'Sherpa Command Deck' })).toBeVisible();

  const input = page.getByRole('textbox', { name: 'Terminal command input' });
  await input.fill('/help');
  await input.press('Enter');
  await expect(page.getByText(/Available Commands/i)).toBeVisible();
});

test('command deck closes with escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle Command Deck' }).click();
  await expect(page.getByRole('dialog', { name: 'Sherpa Command Deck' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Sherpa Command Deck' })).toBeHidden();
});