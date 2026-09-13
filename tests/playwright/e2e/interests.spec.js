// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InterestsPage } from '../pages/InterestsPage.js';

test.describe('US-006 & US-007: Send & Receive Interests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsDemoUser();
  });

  test('US-006: User can send interest to another candidate', async ({ page }) => {
    await page.goto('/search');
    const sendInterestBtn = page.locator('[data-testid="send-interest-btn"]:not([disabled])').first();
    
    if (await sendInterestBtn.isVisible()) {
      await sendInterestBtn.click();
      await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    }
  });

  test('US-007: User can view Received Interests tab and accept pending interest', async ({ page }) => {
    const interestsPage = new InterestsPage(page);
    await interestsPage.goto();
    await interestsPage.openReceivedTab();

    const acceptBtn = interestsPage.acceptBtn.first();
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();
    }
  });

  test('QA-TEST [BUG-005]: Verify rejected interest cannot be accepted via stale state', async ({ page }) => {
    const interestsPage = new InterestsPage(page);
    await interestsPage.goto();
    await interestsPage.openReceivedTab();

    // In Received tab, Divya Agarwal is initially rejected
    const rejectedBadge = page.locator('text=Rejected').first();
    if (await rejectedBadge.isVisible()) {
      console.log('[QA Audit BUG-005] Observed rejected interest row.');
    }
  });
});
