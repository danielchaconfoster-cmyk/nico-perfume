import { test, expect } from '@playwright/test';

test.describe('Live Production & Vercel Real Browser Verification', () => {

  test('01. Verify Vercel Live Deployment (nico-perfume.vercel.app) loads flawlessly without error screen', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(`PAGE_ERROR: ${error.message}`);
    });

    // 1. Navigate to live Vercel URL
    console.log('Navigating to live Vercel deployment: https://nico-perfume.vercel.app...');
    const response = await page.goto('https://nico-perfume.vercel.app', { waitUntil: 'networkidle', timeout: 45000 });
    
    // Status check
    expect(response?.status()).toBeLessThan(400);

    // Assert that the Vercel error screen "This page couldn't load" is NOT present
    const errorHeading = page.locator('text=This page couldn’t load');
    await expect(errorHeading).toHaveCount(0);

    // 2. Assert that the real site elements are rendered and visible
    await expect(page.locator('text=NICO PERFUME').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h1')).toContainText('fragancia firma');
    await expect(page.locator('text=HOMBRE').first()).toBeVisible();
    await expect(page.locator('text=MUJER').first()).toBeVisible();
    await expect(page.locator('text=UNISEX').first()).toBeVisible();

    // 3. Verify Logo Loops
    await expect(page.locator('text=GIORGIO ARMANI').first()).toBeVisible();
    await expect(page.locator('text=TOM FORD').first()).toBeVisible();

    // 4. Verify Canvas Pixel Engine is mounted
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();

    // 5. Let the animations run for 3 seconds to verify zero memory collapse
    await page.waitForTimeout(3000);

    // Capture proof screenshot
    await page.screenshot({ path: 'public/verification/01_vercel_live_home.png', fullPage: false });
    console.log('Successfully captured live Vercel homepage screenshot.');

    // 6. Test navigation to Product Detail Page (PDP)
    await page.goto('https://nico-perfume.vercel.app/producto/afnan-9-pm-edp-100ml-black-hombre', { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('h1')).toContainText('9 PM');
    await page.screenshot({ path: 'public/verification/02_vercel_live_product_pdp.png', fullPage: false });
    console.log('Successfully captured live Vercel PDP screenshot.');

    // 7. Test Catalog page
    await page.goto('https://nico-perfume.vercel.app/catalogo', { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('h1')).toContainText('Catálogo de Fragancias');
    await page.screenshot({ path: 'public/verification/03_vercel_live_catalogo.png', fullPage: false });
    console.log('Successfully captured live Vercel Catalog screenshot.');

    // 8. Test Sommelier Quiz
    await page.goto('https://nico-perfume.vercel.app/sommelier-quiz', { waitUntil: 'networkidle', timeout: 30000 });
    await expect(page.locator('text=Recomendador Rápido').first()).toBeVisible();
    await page.screenshot({ path: 'public/verification/04_vercel_live_quiz.png', fullPage: false });
    console.log('Successfully captured live Vercel Sommelier Quiz screenshot.');

    console.log('Total console errors captured:', consoleErrors.length);
    expect(consoleErrors.length).toBe(0);
  });

});
