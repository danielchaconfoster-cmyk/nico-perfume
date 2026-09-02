import { test, expect } from '@playwright/test';

test.describe('Nico Perfume - Complete Multi-Page & Feature Test Suite', () => {

  test('01. Layout & Branding Integrity on Home Page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Nico Perfume/i);
    await expect(page.locator('text=NICO PERFUME').first()).toBeVisible();
    await expect(page.locator('h1')).toContainText('fragancia firma');

    // Check Hero Gender Scroll Rail (HOMBRE, MUJER, UNISEX)
    await expect(page.locator('text=HOMBRE').first()).toBeVisible();
    await expect(page.locator('text=MUJER').first()).toBeVisible();
    await expect(page.locator('text=UNISEX').first()).toBeVisible();

    // Check Logo Loops (Brands Marquee)
    await expect(page.locator('text=GIORGIO ARMANI').first()).toBeVisible();
    await expect(page.locator('text=TOM FORD').first()).toBeVisible();
    await expect(page.locator('text=CALVIN KLEIN').first()).toBeVisible();

    // Check Trust Marketing bar
    await expect(page.locator('text=100% Perfumes Originales').first()).toBeVisible();
    await expect(page.locator('text=Envío Gratis sobre $60.000').first()).toBeVisible();
  });

  test('02. Multi-Page Routes Accessibility & Title Checks', async ({ page }) => {
    // 1. Catalogo Route
    await page.goto('/catalogo');
    await expect(page.locator('h1:has-text("Catálogo de Fragancias")')).toBeVisible();

    // 2. Fragancias Gemelas Route
    await page.goto('/fragancias-gemelas');
    await expect(page.locator('h2:has-text("Encuentra tu Fragancia Gemela")')).toBeVisible();

    // 3. Test de Perfumes Route
    await page.goto('/sommelier-quiz');
    await expect(page.locator('h2:has-text("Test de Perfume")')).toBeVisible();

    // 4. Mayorista B2B Route
    await page.goto('/mayorista');
    await expect(page.locator('h2:has-text("Abastecimiento Mayorista Directo")')).toBeVisible();

    // 5. Checkout Route
    await page.goto('/checkout');
    await expect(page.locator('text=No tienes productos en el carrito')).toBeVisible();
  });

  test('03. Fragrance Twin Matchmaker Flow', async ({ page }) => {
    await page.goto('/fragancias-gemelas');

    // Click Preset Combo
    const presetBtn = page.locator('button:has-text("Afnan 9 PM + Amber Oud")');
    await expect(presetBtn).toBeVisible();
    await presetBtn.click();

    // Verify recommendations appear
    await expect(page.locator('text=Fragancias Recomendadas con Mayor Afinidad')).toBeVisible();
    await expect(page.locator('text=Match Olfativo').first()).toBeVisible();
    await expect(page.locator('text=¿Por qué es tu fragancia gemela?').first()).toBeVisible();

    // Test quick add to cart from recommendation
    const buyBtn = page.locator('button:has-text("Comprar")').first();
    await buyBtn.click();

    // Cart should open
    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();
    await page.locator('button[aria-label="Cerrar bolsa"]').click();
  });

  test('04. Sommelier Discovery Quiz Flow', async ({ page }) => {
    await page.goto('/sommelier-quiz');

    // Step 1: Gender (Hombre)
    await page.locator('button:has-text("Hombre")').click();

    // Step 2: Occasion (Noche, Citas & Fiesta)
    await page.locator('button:has-text("Noche, Citas & Fiesta")').click();

    // Step 3: Family (Ámbar & Vainilla)
    await page.locator('button:has-text("Ámbar & Vainilla")').click();

    // Step 4: Budget (Gama Media)
    await page.locator('button:has-text("Gama Media")').click();

    // Verify Results
    await expect(page.locator('text=Tus Mejores Opciones Encontradas')).toBeVisible();
    await expect(page.locator('text=98% Afín').first()).toBeVisible();

    // Test Reset Quiz
    await page.locator('button:has-text("Repetir Quiz")').click();
    await expect(page.locator('text=1. ¿Para quién buscas este perfume?')).toBeVisible();
  });

  test('05. Full Catalog: Live Search, Filters & Sorting', async ({ page }) => {
    await page.goto('/catalogo');

    // Live search for 'King'
    const searchInput = page.locator('input[placeholder*="Buscar por nombre"]');
    await searchInput.fill('King');
    await page.waitForTimeout(300);

    // Verify search results contain King
    await expect(page.locator('h3:has-text("King")').first()).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await page.waitForTimeout(200);

    // Filter by Pill (Joyas Árabes)
    await page.locator('button:has-text("Joyas Árabes")').click();
    await page.waitForTimeout(200);

    // Open Advanced Filters
    await page.locator('button:has-text("Filtros Avanzados")').click();
    await expect(page.locator('text=Marca / Casa Olfativa')).toBeVisible();

    // Sort by Price Ascending
    const sortSelect = page.locator('select:has(option[value="price-asc"])');
    await sortSelect.selectOption('price-asc');
    await page.waitForTimeout(300);
  });

  test('06. Product Quick View & Fragrance Pyramid', async ({ page }) => {
    await page.goto('/catalogo');

    // Click quick view on the first product card
    const firstQuickView = page.locator('button[aria-label="Vista rápida"]').first();
    await firstQuickView.click();

    // Modal should be visible
    await expect(page.locator('text=Pirámide Olfativa')).toBeVisible();
    await expect(page.locator('text=Salida:')).toBeVisible();
    await expect(page.locator('text=Corazón:')).toBeVisible();
    await expect(page.locator('text=Fondo:')).toBeVisible();
    await expect(page.locator('text=Longevidad:')).toBeVisible();

    // Test quantity increase
    const plusBtn = page.locator('.fixed.inset-0 button:has-text("+")');
    await plusBtn.click();
    await expect(page.locator('.fixed.inset-0 span.w-8.text-center')).toHaveText('2');

    // Close modal
    await page.locator('button[aria-label="Cerrar modal"]').click();
  });

  test('07. Spacious Cart Drawer & Navigation to Checkout', async ({ page }) => {
    await page.goto('/catalogo');

    // Add product to cart
    const addCartBtn = page.locator('button:has-text("Agregar a Bolsa")').first();
    await addCartBtn.click();

    // Cart drawer should open with generous space
    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();
    await expect(page.locator('text=Total Estimado')).toBeVisible();

    // Click "Ir al Checkout"
    await page.locator('button:has-text("Ir al Checkout")').click();
    await page.waitForURL('**/checkout');
    await expect(page.locator('h1:has-text("Datos de Despacho & Pago")')).toBeVisible();
  });

  test('08. Dedicated Checkout Page: Coupon, Address & Breakdown', async ({ page }) => {
    await page.goto('/catalogo');

    // Add product to cart
    const addCartBtn = page.locator('button:has-text("Agregar a Bolsa")').first();
    await addCartBtn.click();
    await page.locator('button:has-text("Ir al Checkout")').click();
    await page.waitForURL('**/checkout');

    // Test Invalid Coupon
    const couponInput = page.locator('input[placeholder*="Cupón"]');
    await couponInput.fill('INVALIDCODE');
    await page.locator('button:has-text("Aplicar")').click();
    await expect(page.locator('text=Código de cupón no válido')).toBeVisible();

    // Test Valid Coupon
    await couponInput.fill('NICOPRO10');
    await page.locator('button:has-text("Aplicar")').click();
    await expect(page.locator('text=Cupón del 10% de descuento aplicado')).toBeVisible();
    await expect(page.locator('text=Descuento Cupón')).toBeVisible();
  });

  test('09. B2B Wholesale Portal & Profit Simulator', async ({ page }) => {
    await page.goto('/mayorista');

    // Verify Wholesale Tiers
    await expect(page.locator('text=Abastecimiento Mayorista Directo')).toBeVisible();
    await expect(page.locator('h3:has-text("Nivel Bronce Starter")')).toBeVisible();
    await expect(page.locator('h3:has-text("Nivel Plata Pro")')).toBeVisible();
    await expect(page.locator('h3:has-text("Nivel Oro VIP Distribuidor")')).toBeVisible();

    // Test Simulation button
    await page.locator('button:has-text("Simular Plan Oro")').click();
    await expect(page.locator('text=Nivel Oro VIP Distribuidor (52% OFF)')).toBeVisible();
  });

  test('10. Online Checkout Order Submission & Tracking Ticket', async ({ page }) => {
    await page.goto('/catalogo');

    // Add item to cart
    const addCartBtn = page.locator('button:has-text("Agregar a Bolsa")').first();
    await addCartBtn.click();
    await page.locator('button:has-text("Ir al Checkout")').click();
    await page.waitForURL('**/checkout');

    // Submit Order
    await page.locator('button:has-text("Confirmar y Pagar")').click();

    // Success Screen & Order Tracking
    await expect(page.locator('text=¡Orden Recibida con Éxito!')).toBeVisible();
    await expect(page.locator('text=Número de Orden:')).toBeVisible();
    await expect(page.locator('text=Número de Seguimiento (Starken/Blue):')).toBeVisible();

    // Return to store
    await page.locator('a:has-text("Volver a la Tienda")').click();
    await page.waitForURL('**/catalogo');
  });

  test('11. Wishlist & Comparison Matrix', async ({ page }) => {
    await page.goto('/catalogo');

    // Toggle wishlist on first product
    const favBtn = page.locator('button[aria-label="Añadir a favoritos"]').first();
    await favBtn.click();

    // Open Wishlist from Navbar
    await page.locator('button[aria-label="Perfumes favoritos"]').click();
    await expect(page.locator('h2:has-text("Tus Fragancias Favoritas")')).toBeVisible();
    await page.locator('button[aria-label="Cerrar favoritos"]').click();

    // Add first product to compare
    const compareBtn = page.locator('button[aria-label="Comparar notas"]').first();
    await compareBtn.click();

    // Compare matrix should open
    await expect(page.locator('text=Comparativa Olfativa Cara a Cara')).toBeVisible();
    await expect(page.locator('text=Familia Olfativa').first()).toBeVisible();
    await page.locator('button[aria-label="Cerrar comparador"]').click();
  });

  test('12. Dedicated Product Page (/producto/[slug]) & Schema.org JSON-LD Verification', async ({ page }) => {
    // Navigate directly to top perfume page
    await page.goto('/producto/afnan-9-pm-edp-100ml-black-hombre');

    // Title & Brand
    await expect(page.locator('h1')).toContainText('Afnan 9 PM');
    await expect(page.locator('text=CASA OLFATIVA: Afnan')).toBeVisible();
    await expect(page.locator('text=Batch Code Verificado')).toBeVisible();
    await expect(page.locator('text=100% Original Sellado')).toBeVisible();

    // Verify Olfactory Pyramid Tabs
    await expect(page.locator('text=Pirámide Olfativa').first()).toBeVisible();
    await expect(page.locator('text=1. Salida (Top Notes)')).toBeVisible();
    await expect(page.locator('text=2. Corazón (Heart Notes)')).toBeVisible();
    await expect(page.locator('text=3. Fondo (Base Notes)')).toBeVisible();

    // Click Performance Tab
    await page.locator('button:has-text("Rendimiento & Estela")').click();
    await expect(page.locator('text=Métricas de Fijación & Estela')).toBeVisible();
    await expect(page.locator('text=Duración en Piel')).toBeVisible();

    // Verify Schema.org JSON-LD Script tag
    const jsonLdScripts = await page.locator('script[type="application/ld+json"]').all();
    expect(jsonLdScripts.length).toBeGreaterThanOrEqual(2);

    const productSchemaRaw = await jsonLdScripts[0].textContent();
    const productSchema = JSON.parse(productSchemaRaw || '{}');
    expect(productSchema['@type']).toBe('Product');
    expect(productSchema.name).toContain('Afnan 9 PM');
    expect(productSchema.offers.priceCurrency).toBe('CLP');
    expect(productSchema.offers.price).toBe(39000);

    // Format Selector and Add to Cart
    await page.locator('button:has-text("Decant Premium")').click();
    await expect(page.locator('button:has-text("Agregar a la Bolsa")')).toBeVisible();
    await page.locator('button:has-text("Agregar a la Bolsa")').click();

    // Cart drawer should open
    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();
    await page.locator('button[aria-label="Cerrar bolsa"]').click();
  });

  test('13. SEO Sitemap and Robots endpoints', async ({ page }) => {
    // Check robots.txt
    const robotsRes = await page.goto('/robots.txt');
    expect(robotsRes?.status()).toBe(200);
    const robotsText = await page.content();
    expect(robotsText).toContain('sitemap.xml');

    // Check sitemap.xml
    const sitemapRes = await page.goto('/sitemap.xml');
    expect(sitemapRes?.status()).toBe(200);
  });

});
