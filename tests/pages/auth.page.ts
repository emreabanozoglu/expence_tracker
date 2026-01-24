/**
 * Page Object Model for Authentication pages
 */

import { Page, Locator } from '@playwright/test';

export class AuthPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly signUpButton: Locator;
    readonly toggleButton: Locator;
    readonly errorMessage: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: /email/i });
        this.passwordInput = page.getByRole('textbox', { name: /password/i });
        this.signInButton = page.getByRole('button', { name: /sign in/i, exact: true });
        this.signUpButton = page.getByRole('button', { name: /sign up/i, exact: true });
        this.toggleButton = page.getByRole('button', { name: /sign up|sign in/i });
        this.errorMessage = page.locator('[class*="error"]');
        this.successMessage = page.locator('[class*="success"]');
    }

    async goto() {
        await this.page.goto('/auth');
    }

    async signUp(email: string, password: string) {
        // Make sure we're on signup form
        const buttonText = await this.toggleButton.textContent();
        if (buttonText?.includes('Sign up')) {
            await this.toggleButton.click();
        }

        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signUpButton.click();
    }

    async signIn(email: string, password: string) {
        // Make sure we're on signin form
        const buttonText = await this.toggleButton.textContent();
        if (buttonText?.includes('Sign in')) {
            await this.toggleButton.click();
        }

        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
    }

    async getErrorMessage(): Promise<string | null> {
        return await this.errorMessage.textContent();
    }

    async getSuccessMessage(): Promise<string | null> {
        return await this.successMessage.textContent();
    }

    async waitForRedirect(url: string = '/') {
        await this.page.waitForURL(url, { timeout: 10000 });
    }
}
