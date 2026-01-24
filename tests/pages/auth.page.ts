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

        // Aliases for compatibility with existing tests that might use these props
        this.signInButton = this.submitButton;
        this.signUpButton = this.submitButton;
    }

    async goto() {
        await this.page.goto('/auth');
    }

    async signUp(email: string, password: string) {
        // Check if we need to toggle to signup form
        if (await this.toggleButton.isVisible()) {
            const buttonText = await this.toggleButton.textContent();
            if (buttonText?.includes("Don't have an account")) {
                await this.toggleButton.click();
                // Wait for form to switch
                await this.page.waitForTimeout(300);
            }
        }

        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async signIn(email: string, password: string) {
        // Check if we need to toggle to signin form
        if (await this.toggleButton.isVisible()) {
            const buttonText = await this.toggleButton.textContent();
            if (buttonText?.includes("Already have an account")) {
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

    async waitForRedirect(url: string = '/') {
        await this.page.waitForURL(url, { timeout: 30000 });
    }
}
