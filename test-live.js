import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  page.on('request', request => {
    if (request.url().includes('functions/v1')) {
      console.log('API REQUEST STARTED:', request.method(), request.url());
    }
  });

  page.on('response', response => {
    if (response.url().includes('functions/v1')) {
      console.log('API RESPONSE RECEIVED:', response.status(), response.url());
    }
  });

  try {
    await page.goto('https://anveeksha.vercel.app/', { waitUntil: 'networkidle' });

    console.log("Filling out form...");
    await page.fill('input[name="name"]', 'Deployment Test');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('textarea[name="message"]', 'Testing production API');

    console.log("Clicking submit...");
    await page.click('button[type="submit"]', { delay: 100 });

    await page.waitForTimeout(5000);
    console.log("Test finished successfully.");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await browser.close();
  }
})();
