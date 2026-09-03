const { chromium } = require('playwright');
const http = require('http');

async function checkServer() {
  return new Promise((resolve) => {
    http.get('http://localhost:3008', (res) => resolve(true)).on('error', () => resolve(false));
  });
}

async function takeScreenshots() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop
  const contextDesktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.goto('http://localhost:3008', { waitUntil: 'networkidle' });
  await pageDesktop.waitForTimeout(2000);
  await pageDesktop.screenshot({ path: 'public/verification/new_hero_desktop.png' });

  // 2. Mobile (iPhone 14 / Pixel 7 view)
  const contextMobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const pageMobile = await contextMobile.newPage();
  await pageMobile.goto('http://localhost:3008', { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(2000);
  await pageMobile.screenshot({ path: 'public/verification/new_hero_mobile.png' });

  await browser.close();
  console.log('Screenshots captured successfully!');
}

takeScreenshots().catch(console.error);
