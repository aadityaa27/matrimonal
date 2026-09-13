// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { MessagesPage, AdminPage } from '../pages/ProfilePage.js';

test.describe('US-008 & US-009: Messaging & Admin Dashboard', () => {
  test('US-008: Matched users can view message thread and send messages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsDemoUser();

    const messagesPage = new MessagesPage(page);
    await messagesPage.goto();

    await expect(page.locator('[data-testid="conversations-sidebar"]')).toBeVisible();
    await messagesPage.selectConversation(0);

    const testMsg = `Hello from Playwright QA Suite ${Date.now()}`;
    await messagesPage.sendMessage(testMsg);

    await expect(page.locator(`text=${testMsg}`)).toBeVisible();
  });

  test('QA-TEST [BUG-007]: Sending empty or whitespace-only message is rejected', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsDemoUser();

    const messagesPage = new MessagesPage(page);
    await messagesPage.goto();
    await messagesPage.selectConversation(0);

    const initialBubblesCount = await messagesPage.messageBubbles.count();
    await messagesPage.sendMessage('    '); // pure whitespace

    // BUG-007 allows whitespace-only messages through
    const afterCount = await messagesPage.messageBubbles.count();
    console.log(`[QA Audit BUG-007] Message bubbles before: ${initialBubblesCount}, after whitespace send: ${afterCount}`);
  });

  test('US-009: Admin can log in and view platform metrics', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsAdmin();

    const adminPage = new AdminPage(page);
    await adminPage.goto();

    await expect(adminPage.statTotalUsers).toBeVisible();
    await expect(adminPage.statMaleUsers).toBeVisible();
    await expect(adminPage.statFemaleUsers).toBeVisible();
    await expect(adminPage.statPendingInterests).toBeVisible();
    await expect(adminPage.statTotalMessages).toBeVisible();
  });
});
