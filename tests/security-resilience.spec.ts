import { test, expect } from '@playwright/test';

test.describe('Nico Perfume - Security Hardening & Resilience Suite', () => {

  test('01. HTTP Security Headers (HSTS, CSP, X-Frame, MIME Sniffing)', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();

    const headers = response.headers();
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['strict-transport-security']).toContain('max-age=63072000');
  });

  test('02. Admin Auth Brute-Force Rate Limiting (5 Attempts Lockout)', async ({ request }) => {
    // 5 failed attempts
    for (let i = 1; i <= 5; i++) {
      const res = await request.post('/api/admin/auth', {
        data: { username: 'admin', password: `wrongpass_${i}_${Date.now()}` }
      });
      const data = await res.json();
      if (i < 5) {
        expect(res.status()).toBe(401);
        expect(data.message).toContain('Credenciales incorrectas');
      } else {
        // 5th attempt locks out
        expect(res.status()).toBe(429);
        expect(data.message).toContain('bloqueado');
      }
    }

    // 6th attempt must be strictly blocked with 429
    const blockedRes = await request.post('/api/admin/auth', {
      data: { username: 'admin', password: 'NicoPerfume2026!' }
    });
    expect(blockedRes.status()).toBe(429);
    const blockedData = await blockedRes.json();
    expect(blockedData.message).toContain('bloqueado');
  });

  test('03. Anti-Bot Honeypot silently blocks spam order submissions', async ({ page }) => {
    // 1. Add item to cart first
    await page.goto('/catalogo');
    const addCartBtn = page.locator('button:has-text("Agregar a Bolsa")').first();
    await addCartBtn.click();
    await page.locator('text=Ir al Checkout').click();
    await expect(page).toHaveURL(/.*checkout/);
    
    // 2. Fill the hidden honeypot field (simulate a bot filling hidden fields)
    await page.evaluate(() => {
      const input = document.querySelector('input[name="website_url"]') as HTMLInputElement;
      if (input) {
        input.value = 'http://spam-bot-automation.com';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // 3. Try submitting
    await page.locator('button:has-text("Confirmar y Pagar")').click();

    // 4. Success screen should NOT appear because bot was silently dropped
    await expect(page.locator('text=¡Orden Recibida con Éxito!')).not.toBeVisible();
  });

  test('04. Excel Upload API rejects unauthenticated or corrupt requests gracefully', async ({ request }) => {
    // Unauthenticated request should be 401
    const unauthRes = await request.post('/api/admin/upload-excel');
    expect(unauthRes.status()).toBe(401);

    // Corrupt multipart payload with valid PIN
    const corruptRes = await request.post('/api/admin/upload-excel', {
      headers: { 'x-admin-pin': 'nico2026' },
      multipart: {
        file: {
          name: 'corrupted.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          buffer: Buffer.from('NOT_A_VALID_EXCEL_STREAM_CORRUPT_BYTES')
        }
      }
    });

    // Should return 400 or 500 without crashing
    expect([400, 500]).toContain(corruptRes.status());
    const errData = await corruptRes.json();
    expect(errData.error).toBeTruthy();
  });

});
