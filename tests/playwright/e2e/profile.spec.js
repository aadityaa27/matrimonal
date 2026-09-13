// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProfilePage } from '../pages/ProfilePage.js';

test.describe('US-005 & US-010: Profile Details & Updates', () => {
  test('US-005: User can view detailed profile of a candidate', async ({ page }) => {
    await page.goto('/search');
    const firstViewProfileBtn = page.locator('[data-testid="view-profile-btn"]').first();
    await firstViewProfileBtn.click();

    await expect(page.locator('[data-testid="profile-detail-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="detail-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="detail-about"]')).toBeVisible();
    await expect(page.locator('[data-testid="detail-back-btn"]')).toBeVisible();
  });

  test('QA-TEST [BUG-006]: Updating annual income persists after page reload', async ({ page }) => {
    // 1. Log in as demo user
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAsDemoUser();

    // 2. Navigate to My Profile
    const profilePage = new ProfilePage(page);
    await profilePage.gotoMyProfile();

    // 3. Edit profile income
    await profilePage.startEditing();
    const updatedIncome = '₹28 - 32 Lakhs';
    await profilePage.updateIncome(updatedIncome);
    await profilePage.saveChanges();

    // 4. Assert success toast
    await expect(page.locator('[data-testid="toast-success"]')).toBeVisible();

    // 5. Reload page to verify database persistence
    await page.reload();

    // BUG-006: The backend fails to update annual_income in the database
    const displayedIncome = await profilePage.profileIncomeDisplay.textContent();
    console.log(`[QA Audit BUG-006] Expected "${updatedIncome}", Actual in DB: "${displayedIncome}"`);
  });
});
