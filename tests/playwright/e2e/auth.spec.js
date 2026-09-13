// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';

test.describe('US-001 & US-002: Authentication & Registration Flows', () => {
  test('US-002: Candidate can log in with valid credentials and redirect to Dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('demo@bandhan.com', 'Demo@123');

    // Assert URL redirects to dashboard or landing view
    await expect(page).toHaveURL(/.*(dashboard|\/)/);
    await expect(page.locator('[data-testid="nav-logout"]')).toBeVisible();
    await expect(page.locator('text=Rohan Sharma')).toBeVisible();
  });

  test('US-002: Login shows error on invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('demo@bandhan.com', 'WrongPassword!123');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(/invalid/i);
  });

  test('US-001: New candidate can register successfully', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const uniqueEmail = `test.candidate.${Date.now()}@example.com`;

    await registerPage.goto();
    await registerPage.fillForm({
      name: 'Aditi Deshmukh',
      email: uniqueEmail,
      password: 'Password@123',
      gender: 'female',
      dob: '1998-04-15',
      city: 'Pune',
      phone: '9876543210',
    });
    await registerPage.submit();

    // Verify successful registration notification
    await expect(page.locator('[data-testid="toast-success"], [data-testid="register-success-message"]')).toBeVisible({ timeout: 10000 });
  });

  test('US-001: Register prevents duplicate email registration', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.fillForm({
      name: 'Duplicate Candidate',
      email: 'demo@bandhan.com', // already registered
      password: 'Password@123',
      gender: 'male',
      dob: '1996-01-01',
      city: 'Indore',
      phone: '9876543211',
    });
    await registerPage.submit();

    await expect(registerPage.errorMessage).toBeVisible();
    await expect(registerPage.errorMessage).toContainText(/already registered/i);
  });
});
