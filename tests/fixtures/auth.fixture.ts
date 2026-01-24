/**
 * Authentication fixture for creating and managing test users
 */

import { Page } from '@playwright/test';
import { generateUniqueEmail, generatePassword } from '../helpers/test-data';
import { DatabaseCleanup } from '../helpers/db-cleanup';
import { AuthPage } from '../pages/auth.page';

export class AuthFixture {
    private page: Page;
    private authPage: AuthPage;
    private email: string;
    private password: string;
    private userId: string | null = null;
    private dbCleanup: DatabaseCleanup;

    constructor(page: Page) {
        this.page = page;
        this.authPage = new AuthPage(page);
        this.email = generateUniqueEmail();
        this.password = generatePassword();
        this.dbCleanup = new DatabaseCleanup();
    }

    /**
     * Create a new user and log them in
     */
    async createAndLoginUser(): Promise<{ email: string; password: string }> {
        await this.authPage.goto();
        await this.authPage.signUp(this.email, this.password);
        await this.authPage.waitForRedirect('/');
        return { email: this.email, password: this.password };
    }

    /**
     * Login with existing credentials
     */
    async login(email?: string, password?: string): Promise<void> {
        const loginEmail = email || this.email;
        const loginPassword = password || this.password;

        await this.authPage.goto();
        await this.authPage.signIn(loginEmail, loginPassword);
        await this.authPage.waitForRedirect('/');
    }

    /**
     * Logout the current user
     */
    async logout(): Promise<void> {
        // Navigate to home if not already there
        if (this.page.url().includes('/auth')) {
            return;
        }

        // This assumes a logout button exists on dashboard or header
        // Since AuthPage doesn't have logout, we might need to add it or keep simplified logic here
        // But for consistency let's look for known testid if possible
        const logoutBtn = this.page.locator('button:has-text("Logout"), button:has-text("Sign Out"), [data-testid="logout-button"]');
        if (await logoutBtn.count() > 0) {
            await logoutBtn.first().click();
            await this.authPage.waitForRedirect('/auth');
        } else {
            // Fallback or explicit goto
            await this.page.goto('/auth');
        }
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
