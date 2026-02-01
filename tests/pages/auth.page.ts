/**
 * Page Object Model for Authentication pages
 */

import { Page, Locator } from '@playwright/test';

export class AuthPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly toggleButton: Locator;
    readonly errorMessage: Locator;

    // Signup specific
    readonly signupEmailInput: Locator;
    readonly signupPasswordInput: Locator;
    readonly signupSubmitButton: Locator;

    // Legacy support usually, but strictly finding by id now
    readonly signInButton: Locator;
    readonly signUpButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.locator('[data-testid="email-input"]');
        this.passwordInput = page.locator('[data-testid="password-input"]');
        this.submitButton = page.locator('[data-testid="auth-submit-button"]');
        this.toggleButton = page.locator('[data-testid="auth-toggle-button"]');
        this.errorMessage = page.locator('[data-testid="auth-error-message"]');

        // Signup locators
        this.signupEmailInput = page.locator('[data-testid="signup-email-input"]');
        this.signupPasswordInput = page.locator('[data-testid="signup-password-input"]');
        this.signupSubmitButton = page.locator('[data-testid="signup-submit-button"]');

        // Aliases for compatibility with existing tests that might use these props
        this.signInButton = this.submitButton;
        this.signUpButton = this.submitButton;
    }

    async goto() {
        await this.page.goto('/auth');
    }

    async switchToSignUp() {
        if (await this.toggleButton.isVisible()) {
            const buttonText = await this.toggleButton.textContent();
            if (buttonText?.includes("Sign up")) {
                await this.toggleButton.click();
                await this.page.waitForTimeout(300);
            }
        }
    }

    async signUp(email: string, password: string) {
        await this.switchToSignUp();

        // Handle Multi-Step Form
        // Step 1: Credentials
        await this.page.fill('[data-testid="signup-firstname-input"]', 'Test');
        await this.page.fill('[data-testid="signup-lastname-input"]', 'User');
        await this.signupEmailInput.fill(email);
        await this.signupPasswordInput.fill(password);
        await this.page.click('[data-testid="signup-submit-button"]'); // Continue

        // Step 2: Currency (default is USD, just click continue)
        await this.page.waitForSelector('[data-testid="signup-currency-select"]');
        await this.page.click('[data-testid="signup-submit-button"]'); // Continue

        // Step 3: Review & Terms
        await this.page.waitForSelector('[data-testid="signup-terms-checkbox"]');
        await this.page.check('[data-testid="signup-terms-checkbox"]');
        await this.page.click('[data-testid="signup-submit-button"]'); // Create Account
    }

    async signIn(email: string, password: string) {
        // Check if we need to toggle to signin form
        if (await this.toggleButton.isVisible()) {
            const buttonText = await this.toggleButton.textContent();
            // Covers "Already have an account?" (if used) or "Login instead"
            if (buttonText?.includes("Already have") || buttonText?.includes("Login instead")) {
                await this.toggleButton.click();
                // Wait for form to switch
                await this.page.waitForTimeout(300);
            }
        }

        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async getErrorMessage(): Promise<string | null> {
        return await this.errorMessage.textContent();
    }

    async waitForRedirect(urlOrPattern: string | RegExp = '/') {
        // If it's a simple string like '/auth', make it a glob to be safer against query params
        // or ensure strict matching if desired. Here we use strict but Playwright resolves relative.
        // To allow query params, we can checking if url is part of the string.

        if (typeof urlOrPattern === 'string' && !urlOrPattern.startsWith('http')) {
            await this.page.waitForURL(`**${urlOrPattern}**`, { timeout: 30000 });
        } else {
            await this.page.waitForURL(urlOrPattern, { timeout: 30000 });
        }
    }
}
