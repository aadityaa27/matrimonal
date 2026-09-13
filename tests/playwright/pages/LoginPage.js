export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="login-email"]');
    this.passwordInput = page.locator('[data-testid="login-password"]');
    this.submitBtn = page.locator('[data-testid="login-submit"]');
    this.quickUserBtn = page.locator('[data-testid="quick-login-user"]');
    this.quickAdminBtn = page.locator('[data-testid="quick-login-admin"]');
    this.errorMessage = page.locator('[data-testid="login-error-message"]');
    this.navLogout = page.locator('[data-testid="nav-logout"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }

  async loginAsDemoUser() {
    if (await this.quickUserBtn.isVisible()) {
      await this.quickUserBtn.click();
      await this.submitBtn.click();
    } else {
      await this.login('demo@bandhan.com', 'Demo@123');
    }
  }

  async loginAsAdmin() {
    if (await this.quickAdminBtn.isVisible()) {
      await this.quickAdminBtn.click();
      await this.submitBtn.click();
    } else {
      await this.login('admin@bandhan.com', 'Admin@123');
    }
  }
}
