import { test, expect } from '@playwright/test';

test.describe('Nico Perfume - Visual Captures & Verification', () => {
  test('Capture all pages and Cart Drawer', async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1280, height: 900 });

    // 1. Home Page
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/01_home_hero.png', fullPage: false });

    // 2. Open Cart Drawer with an item added
    const addBtn = page.locator('button:has-text("Adquirir Discovery Set"), button:has-text("Agregar a Bolsa")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'public/screenshots/02_cart_drawer_items.png' });

      // Switch to Shipping Tab in cart
      const shippingTab = page.locator('button:has-text("2. Datos de Envío")');
      if (await shippingTab.isVisible()) {
        await shippingTab.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'public/screenshots/03_cart_drawer_shipping.png' });
      }
    }

    // 3. Catálogo Page
    await page.goto('/catalogo');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/04_catalogo.png', fullPage: false });

    // 4. Fragancias Gemelas Page
    await page.goto('/fragancias-gemelas');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/05_fragancias_gemelas.png', fullPage: false });

    // 5. Discovery Sets Decants Page
    await page.goto('/decants');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/06_decants.png', fullPage: false });

    // 6. Mayorista B2B Page
    await page.goto('/mayorista');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/07_mayorista.png', fullPage: false });

    // 7. Clima Olfativo Page
    await page.goto('/clima-olfativo');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/08_clima_olfativo.png', fullPage: false });

    // 8. Sommelier Quiz Page
    await page.goto('/sommelier-quiz');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/09_sommelier_quiz.png', fullPage: false });
  });
});
