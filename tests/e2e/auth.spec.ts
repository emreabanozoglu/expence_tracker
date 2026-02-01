/**
 * E2E Tests for Authentication
 */

import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/auth.page';
import { generateUniqueEmail, generatePassword } from '../helpers/test-data';

test.describe('Authentication', () => {
    let authPage: AuthPage;

    test.beforeEach(async ({ page }) => {
        authPage = new AuthPage(page);
        await authPage.goto();
    });

    test('should sign up a new user successfully', async ({ page }) => {
        const email = generateUniqueEmail();
        const password = generatePassword();

        await authPage.signUp(email, password);

        // Wait a bit for the session check and redirect
        await page.waitForTimeout(1000);

        // Should redirect to home page after successful signup (email confirmation is disabled)
        await expect(page).toHaveURL('/', { timeout: 10000 });
    });

    test('should show error for invalid email', async ({ page }) => {
        // Switch to sign up mode
        await authPage.switchToSignUp();

        // With the new MultiStepRegister, the "Continue" button should be disabled for invalid emails
        await authPage.page.fill('[data-testid="signup-firstname-input"]', 'Test');
        await authPage.page.fill('[data-testid="signup-lastname-input"]', 'User');
        await authPage.signupPasswordInput.fill(generatePassword());

        await authPage.signupEmailInput.fill('invalid-email');
        await expect(authPage.signupSubmitButton).toBeDisabled();

        // Since we can't submit, we don't check for error message visibility in the same way,
        // but checking the button is disabled confirms validation is working.
    });

    test('should show error for short password', async ({ page }) => {
        // Switch to sign up mode
        await authPage.switchToSignUp();

        // Password should be at least 6 characters
        // The MultiStepRegister disables the button if requirements aren't met
        await authPage.page.fill('[data-testid="signup-firstname-input"]', 'Test');
        await authPage.page.fill('[data-testid="signup-lastname-input"]', 'User');
        await authPage.signupEmailInput.fill(generateUniqueEmail()); // Valid email

        await authPage.signupPasswordInput.fill('12345'); // Short password

        await expect(authPage.signupSubmitButton).toBeDisabled();
    });

    test('should sign in with existing user', async ({ page }) => {
        // First create a user
        const email = generateUniqueEmail();
        const password = generatePassword();
        await authPage.signUp(email, password);
        await expect(page).toHaveURL('/');

        // Sign out (navigate to auth page)
        await authPage.goto();

        // Sign in
        await authPage.signIn(email, password);

        // Should redirect to home page
        await expect(page).toHaveURL('/', { timeout: 10000 });
    });

    test('should show error for wrong password', async ({ page }) => {
        // Create a user
        const email = generateUniqueEmail();
        const password = generatePassword();
        await authPage.signUp(email, password);
        await expect(page).toHaveURL('/');

        // Go back to auth
        await authPage.goto();

        // Try to sign in with wrong password
        await authPage.signIn(email, 'WrongPassword123!');

        // Should show error
        await expect(authPage.errorMessage).toBeVisible();
    });

    test('should toggle between sign in and sign up forms', async ({ page }) => {
        // Start on sign in form
        await expect(authPage.signInButton).toBeVisible();

        // Click toggle to sign up
        await authPage.toggleButton.click();
        await expect(authPage.signupSubmitButton).toBeVisible();

        // Click toggle back to sign in
        await authPage.toggleButton.click();
        await expect(authPage.signInButton).toBeVisible();
    });

    test('should persist session after page refresh', async ({ page }) => {
        // Sign up
        const email = generateUniqueEmail();
        const password = generatePassword();
        await authPage.signUp(email, password);
        await expect(page).toHaveURL('/');

        // Refresh page
        await page.reload();

        // Should still be on home page (logged in)
        await expect(page).toHaveURL('/');
    });
});
