/**
 * E2E Tests for Settings
 */

import { test, expect } from '@playwright/test';
import { AuthFixture } from '../fixtures/auth.fixture';
import { SettingsPage } from '../pages/settings.page';
import { ExpensesPage } from '../pages/expenses.page';

test.describe('Settings', () => {
    let authFixture: AuthFixture;
    let settingsPage: SettingsPage;

    test.beforeEach(async ({ page }) => {
        authFixture = new AuthFixture(page);
        await authFixture.createAndLoginUser();

        settingsPage = new SettingsPage(page);
        await settingsPage.goto();
    });

    test('should change currency', async ({ page }) => {
        // Change to EUR
        await settingsPage.changeCurrency('EUR');

        // Currency should be updated
        const currency = await settingsPage.getCurrency();
        expect(currency).toBe('EUR');
    });

    test('should persist currency after page refresh', async ({ page }) => {
        // Change to GBP
        await settingsPage.changeCurrency('GBP');

        // Refresh page
        await page.reload();

        // Currency should still be GBP
        const currency = await settingsPage.getCurrency();
        expect(currency).toBe('GBP');
    });

    test('should add a custom category', async () => {
        const categoryName = `Test Category ${Date.now()}`;

        await settingsPage.addCategory(categoryName);

        // Category should be visible in the list
        await expect(settingsPage.getCategoryByName(categoryName)).toBeVisible();
    });

    test('should delete a custom category', async () => {
        const categoryName = `Delete Me ${Date.now()}`;

        // Add category
        await settingsPage.addCategory(categoryName);
        await expect(settingsPage.getCategoryByName(categoryName)).toBeVisible();

        // Delete it
        await settingsPage.deleteCategory(categoryName);

        // Should not be visible anymore
        await expect(settingsPage.getCategoryByName(categoryName)).not.toBeVisible();
    });

    test('should show custom category in expense form', async ({ page }) => {
        const categoryName = `Expense Category ${Date.now()}`;

        // Add custom category
        await settingsPage.addCategory(categoryName);

        // Go to expenses page
        const expensesPage = new ExpensesPage(page);
        await expensesPage.goto();

        // Open add expense form
        await expensesPage.addExpenseButton.click();

        // Custom category should be available in dropdown
        const options = await expensesPage.categorySelect.locator('option').allTextContents();
        expect(options).toContain(categoryName);
    });

    test('should persist custom categories after logout', async ({ page }) => {
        const categoryName = `Persistent Category ${Date.now()}`;

        // Add category
        await settingsPage.addCategory(categoryName);

        // Get credentials
        const { email, password } = authFixture.getCredentials();

        // Logout
        await authFixture.logout();

        // Login again
        await authFixture.login(email, password);

        // Go to settings
        await settingsPage.goto();

        // Category should still be there
        await expect(settingsPage.getCategoryByName(categoryName)).toBeVisible();
    });

    test('should handle multiple currency changes', async ({ page }) => {
        // Change currency multiple times
        await settingsPage.changeCurrency('EUR');
        expect(await settingsPage.getCurrency()).toBe('EUR');

        await settingsPage.changeCurrency('JPY');
        expect(await settingsPage.getCurrency()).toBe('JPY');

        await settingsPage.changeCurrency('USD');
        expect(await settingsPage.getCurrency()).toBe('USD');
    });

    test('should add multiple custom categories', async () => {
        const categories = [
            `Category 1 ${Date.now()}`,
            `Category 2 ${Date.now()}`,
            `Category 3 ${Date.now()}`,
        ];

        for (const category of categories) {
            await settingsPage.addCategory(category);
        }

        // All categories should be visible
        for (const category of categories) {
            await expect(settingsPage.getCategoryByName(category)).toBeVisible();
        }
    });
});
