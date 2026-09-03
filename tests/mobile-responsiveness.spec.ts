import { test, expect } from '@playwright/test';

const mobileViewports = [
  { name: 'iPhone SE (375px)', width: 375, height: 667 },
  { name: 'iPhone 14 (390px)', width: 390, height: 844 },
  { name: 'Android Pixel (412px)', width: 412, height: 915 },
];

const testRoutes = [
  { path: '/', title: 'Home' },
  { path: '/catalogo', title: 'Catálogo' },
  { path: '/fragancias-gemelas', title: 'Fragancias Gemelas' },
  { path: '/sommelier-quiz', title: 'Sommelier Quiz' },
  { path: '/mayorista', title: 'Mayorista' },
  { path: '/checkout', title: 'Checkout' },
  { path: '/admin', title: 'Admin Login' }
];

test.describe('Nico Perfume - Mobile Responsiveness & Layout Suite', () => {
  for (const vp of mobileViewports) {
    test.describe(`Viewport: ${vp.name}`, () => {
      for (const route of testRoutes) {
        test(`${route.title} (${route.path}) does not have horizontal overflow on ${vp.name}`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await page.goto(route.path, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(1000);

          // Check for horizontal overflow
          const isOverflowing = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth + 2;
          });

          expect(isOverflowing).toBeFalsy();

          // Check that main header and footer are visible
          const footer = page.locator('footer');
          if (await footer.count() > 0) {
            await expect(footer).toBeVisible();
          }
        });
      }

      test(`Hero Olfactive Selector is 100% clickable and Carolina Herrera is readable without overflow on ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('/', { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);

        // 1. Test clicking Gender chips
        const hombreBtn = page.locator('button:has-text("HOMBRE")').first();
        if (await hombreBtn.isVisible()) {
          await hombreBtn.click();
          await page.waitForTimeout(300);
        }

        // 2. Switch to MARCAS TOP mode
        const marcasTab = page.locator('button:has-text("MARCAS TOP")');
        await marcasTab.click();
        await page.waitForTimeout(400);

        // 3. Tap CAROLINA HERRERA chip
        const chBtn = page.locator('button:has-text("CAROLINA HERRERA")');
        await expect(chBtn).toBeVisible();
        await chBtn.click();
        await page.waitForTimeout(400);

        // 4. Verify Carolina Herrera is selected and fully visible without cutting off
        const exploreBtn = page.locator('a:has-text("Explorar CAROLINA HERRERA")');
        await expect(exploreBtn).toBeVisible();

        // 5. Verify no horizontal overflow
        const isOverflowing = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth + 2;
        });
        expect(isOverflowing).toBeFalsy();

        // 6. Click Explore button and verify navigation to catalog
        await exploreBtn.click();
        await expect(page).toHaveURL(/.*catalogo.*marca=CAROLINA%20HERRERA/);
      });
    });
  }
});
