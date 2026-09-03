import { test, expect } from '@playwright/test';

test.describe('Live Production & Vercel Real Browser Verification', () => {

  test('01. Diagnose live Vercel errors and check deployment status', async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on('console', msg => {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', error => {
      consoleLogs.push(`[PAGE_ERROR] ${error.message}\n${error.stack}`);
    });

    console.log('Navigating to https://nico-perfume.vercel.app...');
    await page.goto('https://nico-perfume.vercel.app', { waitUntil: 'domcontentloaded' });
    
    await page.waitForTimeout(4000);

    const title = await page.title();
    console.log('Page Title:', title);

    const bodyText = await page.locator('body').innerText();
    console.log('Body Text Preview (first 500 chars):', bodyText.substring(0, 500));

    console.log('--- ALL CONSOLE LOGS & ERRORS ---');
    consoleLogs.forEach(log => console.log(log));
    console.log('---------------------------------');

    // Save screenshot of whatever is currently on screen
    await page.screenshot({ path: 'public/verification/current_live_state.png' });
  });

});
