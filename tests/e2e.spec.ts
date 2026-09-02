import { test, expect } from '@playwright/test';

test.describe('Nico Perfume - Complete E-Commerce & Recommender Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('01. Layout & Branding Integrity', async ({ page }) => {
    // Check main title & branding
    await expect(page).toHaveTitle(/Nico Perfume/i);
    await expect(page.locator('text=NICO PERFUME').first()).toBeVisible();
    await expect(page.locator('text=Haute Parfumerie • Santiago de Chile').first()).toBeVisible();
    await expect(page.locator('text=Aromas que Conquistan.').first()).toBeVisible();
    await expect(page.locator('text=Colección Árabe & Extrait de Parfum').first()).toBeVisible();

    // Check Trust Marketing bar
    await expect(page.locator('text=100% Originales & Sellados').first()).toBeVisible();
    await expect(page.locator('text=Envío Gratis desde $60.000').first()).toBeVisible();
  });

  test('02. Fragrance Twin Matchmaker (1 and 2 perfumes)', async ({ page }) => {
    // Scroll to Recommender
    const recommenderSection = page.locator('#recomendador');
    await recommenderSection.scrollIntoViewIfNeeded();

    // Click Preset Combo
    const presetBtn = page.locator('button:has-text("Afnan 9 PM + Amber Oud")');
    await expect(presetBtn).toBeVisible();
    await presetBtn.click();

    // Verify recommendations appear
    await expect(page.locator('text=Fragancias Recomendadas con Mayor Afinidad')).toBeVisible();
    await expect(page.locator('text=Match Olfativo').first()).toBeVisible();
    await expect(page.locator('text=¿Por qué es tu fragancia gemela?').first()).toBeVisible();

    // Test quick add to cart from recommendation
    const buyBtn = page.locator('#recomendador button:has-text("Comprar")').first();
    await buyBtn.click();

    // Cart should open
    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();
    // Close cart
    await page.locator('button[aria-label="Cerrar bolsa"]').click();
  });

  test('03. Decant Discovery Sets & Custom Box Builder', async ({ page }) => {
    const decantSection = page.locator('#decants');
    await decantSection.scrollIntoViewIfNeeded();

    // Verify Decant Section header and 100% refundable guarantee
    await expect(page.locator('text=Kits de Decants & Discovery Sets (5ml y 10ml)')).toBeVisible();
    await expect(page.locator('text=Garantía Nico Perfume: 100% Reembolsable')).toBeVisible();

    // Buy preset pack
    const buyPackBtn = page.locator('#decants button:has-text("Comprar Discovery Set")').first();
    await buyPackBtn.click();

    // Verify Cart opens with Decant item
    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();
    await expect(page.locator('text=DECANT').first()).toBeVisible();

    // Close Cart
    await page.locator('button[aria-label="Cerrar bolsa"]').click();

    // Test Custom Decant Box Builder toggle
    const customBuilderBtn = page.locator('button:has-text("Armar mi Pack Ahora")');
    await customBuilderBtn.click();
    await expect(page.locator('text=Selecciona una fragancia abajo').first()).toBeVisible();
  });

  test('04. Sommelier 30-Second Discovery Quiz Flow', async ({ page }) => {
    const quizSection = page.locator('#sommelier-quiz');
    await quizSection.scrollIntoViewIfNeeded();

    // Step 1: Gender (Hombre)
    await page.locator('#sommelier-quiz button:has-text("Hombre")').click();

    // Step 2: Occasion (Noche, Citas & Fiesta)
    await page.locator('#sommelier-quiz button:has-text("Noche, Citas & Fiesta")').click();

    // Step 3: Family (Ámbar & Vainilla)
    await page.locator('#sommelier-quiz button:has-text("Ámbar & Vainilla")').click();

    // Step 4: Budget (Gama Media)
    await page.locator('#sommelier-quiz button:has-text("Gama Media")').click();

    // Verify Results
    await expect(page.locator('text=Tus Mejores Opciones Encontradas')).toBeVisible();
    await expect(page.locator('text=98% Afín').first()).toBeVisible();

    // Test Reset Quiz
    await page.locator('button:has-text("Repetir Quiz")').click();
    await expect(page.locator('text=1. ¿Para quién buscas este perfume?')).toBeVisible();
  });

  test('05. Dupe Savings Calculator & Comparison Vault', async ({ page }) => {
    const dupeSection = page.locator('#calculadora-ahorro');
    await dupeSection.scrollIntoViewIfNeeded();

    // Verify Savings Vault Title
    await expect(page.locator('text=El Bóveda de Ahorro Inteligente')).toBeVisible();
    await expect(page.locator('text=¡Tu Ahorro Real!').first()).toBeVisible();

    // Test Add to Cart from Dupe section
    const dupeAddBtn = page.locator('#calculadora-ahorro button:has-text("Llevar Joya")').first();
    await dupeAddBtn.click();

    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();
    await page.locator('button[aria-label="Cerrar bolsa"]').click();
  });

  test('06. Sillage & Weather Spray Advisor App', async ({ page }) => {
    const weatherSection = page.locator('#clima-olfativo');
    await weatherSection.scrollIntoViewIfNeeded();

    // Verify App Header
    await expect(page.locator('text=Asesor de Clima & Atomizaciones')).toBeVisible();
    await expect(page.locator('text=Dosis Recomendada Hoy')).toBeVisible();

    // Change city and temperature
    const citySelect = page.locator('#clima-olfativo select').first();
    await citySelect.selectOption('Viña del Mar / Valparaíso');

    const tempSelect = page.locator('#clima-olfativo select').nth(1);
    await tempSelect.selectOption('frio');

    // Verify updated spray formula
    await expect(page.locator('text=6 - 7 Atomizaciones')).toBeVisible();
  });

  test('07. Full Catalog: Live Search, Filters & Sorting', async ({ page }) => {
    const catalogSection = page.locator('#catalogo');
    await catalogSection.scrollIntoViewIfNeeded();

    // Live search for 'King'
    const searchInput = page.locator('input[placeholder*="Buscar por nombre"]');
    await searchInput.fill('King');
    await page.waitForTimeout(300);

    // Verify search results contain King
    await expect(page.locator('#catalogo h3:has-text("King")').first()).toBeVisible();

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

  test('09. Redesigned Shopping Bag, Coupon & Free Shipping Progress', async ({ page }) => {
    // Add product to cart
    const addCartBtn = page.locator('#catalogo button:has-text("Agregar a Bolsa")').first();
    await addCartBtn.click();

    // Cart drawer should open
    await expect(page.locator('text=Bolsa de Fragancias')).toBeVisible();

    // Test Invalid Coupon
    const couponInput = page.locator('input[placeholder*="Cupón"]');
    await couponInput.fill('INVALIDCODE');
    await page.locator('button:has-text("Aplicar")').click();
    await expect(page.locator('text=Código de cupón no válido')).toBeVisible();

    // Test Valid Coupon
    await couponInput.fill('NICOPRO10');
    await page.locator('button:has-text("Aplicar")').click();
    await expect(page.locator('text=¡Cupón del 10% de descuento aplicado con éxito!')).toBeVisible();
    await expect(page.locator('text=Descuento Cupón')).toBeVisible();

    // Close Cart
    await page.locator('button[aria-label="Cerrar bolsa"]').click();
  });

  test('10. Integrated Shipping Info Form in Cart Drawer', async ({ page }) => {
    // Add product to cart first so shipping tabs are available
    const addCartBtn = page.locator('#catalogo button:has-text("Agregar a Bolsa")').first();
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
    const wholesaleSection = page.locator('#mayorista');
    await wholesaleSection.scrollIntoViewIfNeeded();

    // Verify Wholesale Tiers
    await expect(page.locator('text=Portal Mayorista & Revendedores B2B')).toBeVisible();
    await expect(page.locator('h3:has-text("Nivel Bronce Starter")')).toBeVisible();
    await expect(page.locator('h3:has-text("Nivel Plata Pro")')).toBeVisible();
    await expect(page.locator('h3:has-text("Nivel Oro VIP Distribuidor")')).toBeVisible();

    // Test Simulation button
    await page.locator('button:has-text("Simular Plan Oro")').click();
    await expect(page.locator('text=Nivel Oro VIP (52% OFF)')).toBeVisible();
  });

  test('12. Online Checkout Flow & Order Confirmation Ticket', async ({ page }) => {
    // Add item to cart
    const addCartBtn = page.locator('#catalogo button:has-text("Agregar a Bolsa")').first();
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
