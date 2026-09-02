import { test, expect } from '@playwright/test';

test.describe('Nico Perfume - Visual Captures & Verification', () => {
  test('Capture all pages, Spacious Cart Drawer, and Dedicated Checkout', async ({ page }) => {
    // Set standard laptop viewport (1280x800) to test realistic screen height
    await page.setViewportSize({ width: 1280, height: 800 });

    // 1. Home Page
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/01_home_hero.png', fullPage: false });

    // 2. Add product and capture Cart Drawer
    await page.goto('/catalogo');
    const addBtns = page.locator('button:has-text("Agregar a Bolsa")');
    if (await addBtns.count() > 0) {
      await addBtns.first().click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: 'public/screenshots/02_cart_drawer_items.png' });

      // 3. Click "Ir al Checkout" and capture Checkout Page
      await page.locator('button:has-text("Ir al Checkout")').click();
      await page.waitForURL('**/checkout');
      await page.waitForTimeout(600);
      await page.screenshot({ path: 'public/screenshots/03_checkout_page.png', fullPage: false });
    }

    // 4. Catálogo Page
    await page.goto('/catalogo');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/04_catalogo.png', fullPage: false });

    // 5. Fragancias Gemelas Page
    await page.goto('/fragancias-gemelas');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/05_fragancias_gemelas.png', fullPage: false });

    // 6. Discovery Sets Decants Page
    await page.goto('/decants');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/06_decants.png', fullPage: false });

    // 7. Mayorista B2B Page
    await page.goto('/mayorista');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/07_mayorista.png', fullPage: false });

    // 8. Clima Olfativo Page
    await page.goto('/clima-olfativo');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/08_clima_olfativo.png', fullPage: false });

    // 9. Sommelier Quiz Page
    await page.goto('/sommelier-quiz');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'public/screenshots/09_sommelier_quiz.png', fullPage: false });
  });
});
