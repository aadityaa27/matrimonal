export class RegisterPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('[data-testid="register-name"]');
    this.emailInput = page.locator('[data-testid="register-email"]');
    this.passwordInput = page.locator('[data-testid="register-password"]');
    this.genderSelect = page.locator('[data-testid="register-gender"]');
    this.dobInput = page.locator('[data-testid="register-dob"]');
    this.cityInput = page.locator('[data-testid="register-city"]');
    this.phoneInput = page.locator('[data-testid="register-phone"]');
    this.submitBtn = page.locator('[data-testid="register-submit"]');
    this.errorMessage = page.locator('[data-testid="register-error-message"]');
    this.successMessage = page.locator('[data-testid="register-success-message"]');
  }

  async goto() {
    await this.page.goto('/register');
  }

  async fillForm(data) {
    if (data.name) await this.nameInput.fill(data.name);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.password) await this.passwordInput.fill(data.password);
    if (data.gender) await this.genderSelect.selectOption(data.gender);
    if (data.dob) await this.dobInput.fill(data.dob);
    if (data.city) await this.cityInput.fill(data.city);
    if (data.phone) await this.phoneInput.fill(data.phone);
  }

  async submit() {
    await this.submitBtn.click();
  }
}
