/**
 * Authentication fixture for creating and managing test users
 */

import { Page } from '@playwright/test';
import { generateUniqueEmail, generatePassword } from '../helpers/test-data';
import { DatabaseCleanup } from '../helpers/db-cleanup';
import { AuthPage } from '../pages/auth.page';
import { createClient } from '@supabase/supabase-js';

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
     * Create a new user and login via Supabase API (bypassing UI)
     * Faster and more reliable for non-auth tests
     */
    async createAndLoginUserViaApi(): Promise<{ email: string; password: string }> {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!; // Anon key

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase env vars missing for API auth');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Sign Up
        const { data, error } = await supabase.auth.signUp({
            email: this.email,
            password: this.password,
        });

        if (error) throw error;
        if (!data.session) throw new Error('No session returned after signup (Email confirmation might be enabled?)');

        this.userId = data.user?.id || null;

        // 2. Set Session in Browser
        // Extract project ID from URL (e.g. https://<project-id>.supabase.co)
        const projectIdResult = /https:\/\/([^.]+)\./.exec(supabaseUrl);
        const projectId = projectIdResult ? projectIdResult[1] : 'supabase-token';
        const storageKey = `sb-${projectId}-auth-token`;

        await this.page.goto('/auth'); // Need to be on the domain to set localStorage. Using public page avoids redirects.
        // It's fine to set it then goto '/' again or reload.

        await this.page.evaluate(({ key, value }) => {
            localStorage.setItem(key, JSON.stringify(value));
        }, { key: storageKey, value: data.session });

        // 3. Reload/Navigate to verify
        await this.page.goto('/');

        return { email: this.email, password: this.password };
    }

    /**
     * Create a new user and log them in
     */
    async createAndLoginUser(): Promise<{ email: string; password: string }> {
        await this.authPage.goto();
        // toggleMode not needed, signUp handles it
        await this.authPage.signUp(this.email, this.password);

        // Capture User ID from localStorage after successful login
        // This is needed for cleanup
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const projectIdResult = /https:\/\/([^.]+)\./.exec(supabaseUrl);
        const projectId = projectIdResult ? projectIdResult[1] : 'supabase-token';
        const storageKey = `sb-${projectId}-auth-token`;

        const sessionStr = await this.page.evaluate((key) => localStorage.getItem(key), storageKey);
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            this.userId = session.user?.id;
        }

        return { email: this.email, password: this.password };
    }

    /**
     * Clean up the test user
     */
    async cleanup() {
        if (this.userId) {
            await this.dbCleanup.deleteUserData(this.userId);
        }
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

        // Try desktop logout button first
        const desktopLogoutBtn = this.page.locator('[data-testid="logout-button"]');
        if (await desktopLogoutBtn.isVisible()) {
            await desktopLogoutBtn.click();
            await this.authPage.waitForRedirect('/auth');
            return;
        }

        // If desktop button not visible, try mobile menu
        const mobileLogoutBtn = this.page.locator('[data-testid="mobile-logout-button"]');
        if (await mobileLogoutBtn.count() > 0) {
            // Check if mobile logout button is visible
            const isVisible = await mobileLogoutBtn.isVisible();

            if (!isVisible) {
                // Open mobile menu first
                const menuToggle = this.page.locator('button:has-text("Toggle menu"), [aria-label="Toggle menu"]');
                if (await menuToggle.count() > 0) {
                    await menuToggle.click();
                    // Wait for menu to open
                    await this.page.waitForTimeout(300);
                }
            }

            await mobileLogoutBtn.click();
            await this.authPage.waitForRedirect('/auth');
            return;
        }

        // Fallback: try any logout/sign out button
        const anyLogoutBtn = this.page.locator('button:has-text("Logout"), button:has-text("Sign Out")');
        if (await anyLogoutBtn.count() > 0) {
            await anyLogoutBtn.first().click({ force: true });
            await this.authPage.waitForRedirect('/auth');
        } else {
            // Last resort: navigate directly
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
}
