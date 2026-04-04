import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console and network errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
    else console.log('PAGE LOG:', msg.text());
  });

  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });

  page.on('response', response => {
    if (response.url().includes('send-inquiry')) {
      console.log('INQUIRY RESPONSE:', response.status(), response.url());
    }
  });

  try {
    console.log("Navigating to https://venkatesh7305.me...");
    await page.goto('https://venkatesh7305.me', { waitUntil: 'networkidle' });

    console.log("Filling out form...");
    await page.fill('input[name="name"]', 'Playwright Test');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('textarea[name="message"]', 'Hello from Playwright');

    console.log("Clicking submit...");
    await page.click('button[type="submit"]');

    // Wait 5 seconds to capture responses
    await page.waitForTimeout(5000);
    console.log("Test finished.");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    await browser.close();
  }
})();
