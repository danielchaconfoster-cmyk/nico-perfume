import { test, expect } from '@playwright/test';

test.describe('Nico Perfume - Complete Multi-Page & Feature Test Suite', () => {

  test('01. Layout & Branding Integrity on Home Page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Nico Perfume/i);
    await expect(page.locator('text=NICO PERFUME').first()).toBeVisible();
    await expect(page.locator('text=Haute Parfumerie • Santiago').first()).toBeVisible();
    await expect(page.locator('text=El Arte del Aroma,').first()).toBeVisible();

    // Check Trust Marketing bar
    await expect(page.locator('text=100% Originales & Sellados').first()).toBeVisible();
    await expect(page.locator('text=Envío Gratis desde $60.000').first()).toBeVisible();
  });

  test('02. Multi-Page Routes Accessibility & Title Checks', async ({ page }) => {
    // 1. Catalogo Route
    await page.goto('/catalogo');
    await expect(page.locator('h1:has-text("Catálogo de Fragancias")')).toBeVisible();

    // 2. Fragancias Gemelas Route
    await page.goto('/fragancias-gemelas');
    await expect(page.locator('h2:has-text("Encuentra tu Fragancia Gemela")')).toBeVisible();

    // 3. Decants Route
    await page.goto('/decants');
    await expect(page.locator('h2:has-text("Experimenta la Fragancia en Piel")')).toBeVisible();

    // 4. Clima Olfativo Route
    await page.goto('/clima-olfativo');
    await expect(page.locator('h2:has-text("Asesor de Clima & Atomizaciones")')).toBeVisible();

    // 5. Sommelier Quiz Route
    await page.goto('/sommelier-quiz');
    await expect(page.locator('h2:has-text("Descubre tu Firma Personal")')).toBeVisible();

    // 6. Mayorista B2B Route
    await page.goto('/mayorista');
    await expect(page.locator('h2:has-text("Abastecimiento Mayorista Directo")')).toBeVisible();
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

  test('04. Decant Discovery Sets & Custom Box Builder', async ({ page }) => {
    await page.goto('/decants');

    // Buy preset pack
    const buyPackBtn = page.locator('button:has-text("Adquirir Discovery Set")').first();
    await buyPackBtn.click();

    // Verify Cart opens with Decant item
    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();
    await expect(page.locator('text=Decant').first()).toBeVisible();

    // Close Cart
    await page.locator('button[aria-label="Cerrar bolsa"]').click();

    // Test Custom Decant Box Builder toggle
    const customBuilderBtn = page.locator('button:has-text("Armar mi Pack a Medida")');
    await customBuilderBtn.click();
    await expect(page.locator('text=Selecciona una fragancia abajo').first()).toBeVisible();
  });

  test('05. Sommelier Discovery Quiz Flow', async ({ page }) => {
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

  test('06. Sillage & Weather Spray Advisor App', async ({ page }) => {
    await page.goto('/clima-olfativo');

    // Verify App Header
    await expect(page.locator('text=Asesor de Clima & Atomizaciones')).toBeVisible();
    await expect(page.locator('text=Dosis Recomendada Hoy')).toBeVisible();

    // Change city and temperature
    const citySelect = page.locator('select').first();
    await citySelect.selectOption('Viña del Mar / Valparaíso');

    const tempSelect = page.locator('select').nth(1);
    await tempSelect.selectOption('frio');

    // Verify updated spray formula
    await expect(page.locator('text=6 - 7 Atomizaciones')).toBeVisible();
  });

  test('07. Full Catalog: Live Search, Filters & Sorting', async ({ page }) => {
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

  test('08. Product Quick View & Fragrance Pyramid', async ({ page }) => {
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

  test('09. Shopping Bag, Coupon & Free Shipping Progress', async ({ page }) => {
    await page.goto('/catalogo');

    // Add product to cart
    const addCartBtn = page.locator('button:has-text("Agregar a Bolsa")').first();
    await addCartBtn.click();

    // Cart drawer should open
    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();

    // Test Invalid Coupon
    const couponInput = page.locator('input[placeholder*="Código de descuento"]');
    await couponInput.fill('INVALIDCODE');
    await page.locator('button:has-text("Aplicar")').click();
    await expect(page.locator('text=Código de cupón no válido')).toBeVisible();

    // Test Valid Coupon
    await couponInput.fill('NICOPRO10');
    await page.locator('button:has-text("Aplicar")').click();
    await expect(page.locator('text=Cupón del 10% de descuento aplicado')).toBeVisible();
    await expect(page.locator('text=Descuento Cupón')).toBeVisible();

    // Close Cart
    await page.locator('button[aria-label="Cerrar bolsa"]').click();
  });

  test('10. Integrated Shipping Info Form in Cart Drawer', async ({ page }) => {
    await page.goto('/catalogo');

    // Add product to cart first so shipping tabs are available
    const addCartBtn = page.locator('button:has-text("Agregar a Bolsa")').first();
    await addCartBtn.click();

    // Switch to Shipping Tab
    await page.locator('button:has-text("2. Datos de Envío")').click();

    // Fill shipping details
    const nameInput = page.locator('input[placeholder*="Nicolás Morales"]');
    await nameInput.fill('Carlos Mendoza');

    const rutInput = page.locator('input[placeholder*="19.876.543-2"]');
    await rutInput.fill('18.765.432-1');

    const addressInput = page.locator('input[placeholder*="Av. Apoquindo"]');
    await addressInput.fill('Av. Providencia 1234, Depto 502');

    // Verify customer data persists
    await expect(nameInput).toHaveValue('Carlos Mendoza');

    // Close Cart
    await page.locator('button[aria-label="Cerrar bolsa"]').click();
  });

  test('11. B2B Wholesale Portal & Profit Simulator', async ({ page }) => {
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

  test('12. Online Checkout Flow & Order Confirmation Ticket', async ({ page }) => {
    await page.goto('/catalogo');

    // Add item to cart
    const addCartBtn = page.locator('button:has-text("Agregar a Bolsa")').first();
    await addCartBtn.click();

    // Open Online Checkout
    await page.locator('button:has-text("Finalizar Compra Online")').click();

    // Verify Checkout modal
    await expect(page.locator('text=Pasarela de Despacho & Pago Seguro')).toBeVisible();
    await expect(page.locator('text=1. Datos Personales del Comprador')).toBeVisible();

    // Confirm order
    await page.locator('button:has-text("Confirmar y Pagar")').click();

    // Success Screen & Order Tracking
    await expect(page.locator('text=¡Orden Recibida con Éxito!')).toBeVisible();
    await expect(page.locator('text=Número de Orden:')).toBeVisible();
    await expect(page.locator('text=Número de Seguimiento (Starken/Blue):')).toBeVisible();

    // Close success view
    await page.locator('button:has-text("Volver a la Tienda")').click();
  });

  test('13. Wishlist & Comparison Matrix', async ({ page }) => {
    await page.goto('/catalogo');

    // Toggle wishlist on first product
    const favBtn = page.locator('button[aria-label="Añadir a favoritos"]').first();
    await favBtn.click();

    // Open Wishlist from Navbar
    await page.locator('button[aria-label="Fragancias favoritas"]').click();
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

});
