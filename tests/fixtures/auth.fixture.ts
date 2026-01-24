/**
 * Authentication fixture for creating and managing test users
 */

import { Page } from '@playwright/test';
import { generateUniqueEmail, generatePassword } from '../helpers/test-data';
import { DatabaseCleanup } from '../helpers/db-cleanup';

export class AuthFixture {
    private page: Page;
    private email: string;
    private password: string;
    private userId: string | null = null;
    private dbCleanup: DatabaseCleanup;

    constructor(page: Page) {
        this.page = page;
        this.email = generateUniqueEmail();
        this.password = generatePassword();
        this.dbCleanup = new DatabaseCleanup();
    }

    /**
     * Create a new user and log them in
     */
    async createAndLoginUser(): Promise<{ email: string; password: string }> {
        await this.page.goto('/auth');

        // Click sign up toggle
        await this.page.getByRole('button', { name: /sign up/i }).click();

        // Fill in signup form
        await this.page.getByRole('textbox', { name: /email/i }).fill(this.email);
        await this.page.getByRole('textbox', { name: /password/i }).fill(this.password);

        // Submit form
        await this.page.getByRole('button', { name: /sign up/i, exact: true }).click();

        // Wait for successful signup (user should be logged in automatically if email confirmation is disabled)
        await this.page.waitForURL('/', { timeout: 10000 });

        return { email: this.email, password: this.password };
    }

    /**
     * Login with existing credentials
     */
    async login(email?: string, password?: string): Promise<void> {
        const loginEmail = email || this.email;
        const loginPassword = password || this.password;

        await this.page.goto('/auth');

        // Fill in login form
        await this.page.getByRole('textbox', { name: /email/i }).fill(loginEmail);
        await this.page.getByRole('textbox', { name: /password/i }).fill(loginPassword);

        // Submit form
        await this.page.getByRole('button', { name: /sign in/i }).click();

        // Wait for successful login
        await this.page.waitForURL('/', { timeout: 10000 });
    }

    /**
     * Logout the current user
     */
    async logout(): Promise<void> {
        // Navigate to home if not already there
        await this.page.goto('/');

        // Click logout button (adjust selector based on your UI)
        await this.page.getByRole('button', { name: /logout|sign out/i }).click();

        // Wait for redirect to auth page
        await this.page.waitForURL('/auth', { timeout: 5000 });
    }

    /**
     * Get the current user's credentials
     */
    getCredentials(): { email: string; password: string } {
        return { email: this.email, password: this.password };
    }

    /**
     * Set the user ID (useful for cleanup)
     */
    setUserId(userId: string): void {
        this.userId = userId;
    }

    /**
     * Clean up test user data
     */
    async cleanup(): Promise<void> {
        if (this.userId) {
            await this.dbCleanup.deleteUserData(this.userId);
        }
    }
}
