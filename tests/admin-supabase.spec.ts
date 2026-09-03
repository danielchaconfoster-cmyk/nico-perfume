import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Nico Perfume - Panel Admin & Supabase Sync', () => {
  test.setTimeout(120000);

  test('Flujo completo de Login con Usuario/Password, Carga de Excel e Inspección de Catálogo', async ({ page }) => {
    // 1. Navegar a /admin
    await page.goto('/admin');
    await expect(page.getByText('NICO PERFUME')).toBeVisible();
    await expect(page.getByText('Portal de Administración')).toBeVisible();

    // 2. Probar contraseña incorrecta
    const userInput = page.getByPlaceholder('admin o nico@nicoperfume.cl');
    const passwordInput = page.getByPlaceholder('••••••••••••');

    await userInput.fill('admin');
    await passwordInput.fill('wrongpassword123');
    await page.getByRole('button', { name: 'Ingresar al Sistema' }).click();
    await expect(page.getByText(/incorrect/i)).toBeVisible();

    // 3. Probar credenciales correctas
    await userInput.fill('admin');
    await passwordInput.fill('NicoPerfume2026!');
    await page.getByRole('button', { name: 'Ingresar al Sistema' }).click();

    // 4. Verificar entrada al Dashboard
    await expect(page.getByText('Admin Pro')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Total Perfumes')).toBeVisible();
    await expect(page.getByText('Marcas en Catálogo')).toBeVisible();

    // 5. Cargar archivo Excel real
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('text=Arrastrá aquí tu lista semanal de Excel').click();
    const fileChooser = await fileChooserPromise;
    const excelPath = path.resolve(process.cwd(), 'lista 20 de agosto2026 - 3.xlsx');
    await fileChooser.setFiles(excelPath);

    // Verificar que reconozca el archivo
    await expect(page.getByText('lista 20 de agosto2026 - 3.xlsx')).toBeVisible();

    // 6. Ejecutar actualización
    const uploadBtn = page.getByRole('button', { name: 'Actualizar Precios en Vivo' });
    await uploadBtn.click();

    // 7. Esperar resultado de éxito
    await expect(page.getByText('¡Lista de Precios Actualizada con Éxito!')).toBeVisible({ timeout: 90000 });

    // 8. Navegar a la pestaña de Gestor de Catálogo
    await page.getByRole('button', { name: /Gestor de Precios/i }).click();
    await expect(page.getByPlaceholder('Buscar por perfume, marca o SKU...')).toBeVisible();
    await expect(page.getByText('Total en base de datos:')).toBeVisible();

    // 9. Navegar a la pestaña de Historial
    await page.getByRole('button', { name: 'Historial de Cargas' }).click();
    await expect(page.getByText('Historial de Cargas Semanales')).toBeVisible();
  });
});
