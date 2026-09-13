export class SearchPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.genderAllBtn = page.locator('[data-testid="filter-gender-all"]');
    this.genderFemaleBtn = page.locator('[data-testid="filter-gender-female"]');
    this.genderMaleBtn = page.locator('[data-testid="filter-gender-male"]');
    this.minAgeInput = page.locator('[data-testid="filter-min-age"]');
    this.maxAgeInput = page.locator('[data-testid="filter-max-age"]');
    this.citySelect = page.locator('[data-testid="filter-city"]');
    this.educationInput = page.locator('[data-testid="filter-education"]');
    this.occupationInput = page.locator('[data-testid="filter-occupation"]');
    this.searchBtn = page.locator('[data-testid="filter-submit"]');
    this.resetBtn = page.locator('[data-testid="filter-reset"]');
    this.profileCards = page.locator('[data-testid="profile-card"]');
    this.emptyState = page.locator('[data-testid="search-empty-state"]');
  }

  async goto() {
    await this.page.goto('/search');
  }

  async filterByGender(gender) {
    if (gender === 'female') await this.genderFemaleBtn.click();
    else if (gender === 'male') await this.genderMaleBtn.click();
    else await this.genderAllBtn.click();
  }

  async setAgeRange(minAge, maxAge) {
    if (minAge !== undefined) await this.minAgeInput.fill(String(minAge));
    if (maxAge !== undefined) await this.maxAgeInput.fill(String(maxAge));
  }

  async selectCity(cityName) {
    await this.citySelect.selectOption(cityName);
  }

  async clickSearch() {
    await this.searchBtn.click();
  }

  async clickReset() {
    await this.resetBtn.click();
  }

  async getProfilesCount() {
    return await this.profileCards.count();
  }
}
