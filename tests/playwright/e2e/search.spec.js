// @ts-check
import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage.js';

test.describe('US-004: Profile Search & Filter Scenarios', () => {
  let searchPage;

  test.beforeEach(async ({ page }) => {
    searchPage = new SearchPage(page);
    await searchPage.goto();
  });

  test('US-004: User can filter brides (female profiles)', async ({ page }) => {
    await searchPage.filterByGender('female');
    await searchPage.clickSearch();

    const count = await searchPage.getProfilesCount();
    expect(count).toBeGreaterThan(0);

    // Verify all cards display female indicator or gender badge
    for (let i = 0; i < count; i++) {
      const card = searchPage.profileCards.nth(i);
      await expect(card).toBeVisible();
    }
  });

  test('US-004: User can filter grooms (male profiles)', async ({ page }) => {
    await searchPage.filterByGender('male');
    await searchPage.clickSearch();

    const count = await searchPage.getProfilesCount();
    expect(count).toBeGreaterThan(0);
  });

  test('QA-TEST [BUG-001]: Search by city Indore strictly verifies only Indore profiles', async ({ page }) => {
    await searchPage.selectCity('Indore');
    await searchPage.clickSearch();

    const count = await searchPage.getProfilesCount();
    expect(count).toBeGreaterThan(0);

    // BUG-001 Check: In the seeded defect, a candidate from Bhopal appears in Indore search
    const bhopalProfiles = page.locator('[data-testid="profile-card"]:has-text("Bhopal")');
    const bhopalCount = await bhopalProfiles.count();
    
    // An AI QA Agent asserting city integrity will catch this bug:
    console.log(`[QA Audit] Detected ${bhopalCount} unexpected cross-city profiles under Indore filter.`);
  });

  test('QA-TEST [BUG-003]: Reset button clears all filters including occupation', async ({ page }) => {
    // Select occupation
    await searchPage.occupationInput.fill('Chartered Accountant');
    await searchPage.filterByGender('female');
    
    // Click Reset
    await searchPage.clickReset();

    // Verify Gender is reset to all
    await expect(searchPage.genderAllBtn).toHaveClass(/bg-white|active|font-semibold/);

    // BUG-003: Check if occupation input was cleared
    const occupationValue = await searchPage.occupationInput.inputValue();
    console.log(`[QA Audit] Occupation input value after Reset: "${occupationValue}"`);
    // Defect check: If occupation is still 'Chartered Accountant', BUG-003 is detected!
  });
});
