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
        await authFixture.createAndLoginUserViaApi();

        settingsPage = new SettingsPage(page);
        await settingsPage.goto();
    });

    test.afterEach(async () => {
        await authFixture.cleanup();
    });

    test('should change currency', async ({ page }) => {
        // Ensure we are on General tab (needed for mobile where menu is default)
        await settingsPage.switchToTab('General');

        // Change to EUR
        await settingsPage.changeCurrency('EUR');

        // Currency should be updated
        // Currency should be updated
        await expect(settingsPage.currencySelector).toHaveValue('EUR');
    });

    test('should persist currency after page refresh', async ({ page }) => {
        // Ensure we are on General tab
        await settingsPage.switchToTab('General');

        // Change to GBP
        await settingsPage.changeCurrency('GBP');

        // Wait for persistence (since useSettings is not optimistic)
        await expect(settingsPage.currencySelector).toHaveValue('GBP');

        // Refresh page
        await page.reload();

        // On mobile, reload resets to menu view, so we need to navigate back
        await settingsPage.switchToTab('General');

        // Currency should still be GBP
        // Currency should still be GBP
        await expect(settingsPage.currencySelector).toHaveValue('GBP');
    });

    test('should add a custom category', async () => {
        const categoryName = `Test Category ${Date.now()}`;

        // Switch to categories tab
        await settingsPage.switchToTab('Categories');

        await settingsPage.addCategory(categoryName);

        // Category should be visible in the list
        await expect(settingsPage.getCategoryByName(categoryName)).toBeVisible();
    });

    test('should delete a custom category', async () => {
        const categoryName = `Delete Me ${Date.now()}`;

        // Switch to categories tab
        await settingsPage.switchToTab('Categories');

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

        // Switch to categories tab
        await settingsPage.switchToTab('Categories');

        // Add custom category
        await settingsPage.addCategory(categoryName);

        // Go to expenses page
        const expensesPage = new ExpensesPage(page);
        await expensesPage.goto();

        // Open add expense form
        await expensesPage.addExpenseButton.click();

        // Custom category should be available in dropdown
        // Using toContainText on the select element checks if any option contains the text, with auto-retry
        await expect(expensesPage.categorySelect).toContainText(categoryName);
    });

    test('should persist custom categories after logout', async ({ page }) => {
        const categoryName = `Persistent Category ${Date.now()}`;

        // Switch to categories tab
        await settingsPage.switchToTab('Categories');

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
        await settingsPage.switchToTab('Categories');

        // Category should still be there
        await expect(settingsPage.getCategoryByName(categoryName)).toBeVisible();
    });

    test('should handle multiple currency changes', async ({ page }) => {
        // Ensure we are on General tab
        await settingsPage.switchToTab('General');

        // Change currency multiple times
        await settingsPage.changeCurrency('EUR');
        await expect(settingsPage.currencySelector).toHaveValue('EUR');

        await settingsPage.changeCurrency('JPY');
        await expect(settingsPage.currencySelector).toHaveValue('JPY');

        await settingsPage.changeCurrency('USD');
        await expect(settingsPage.currencySelector).toHaveValue('USD');
    });

    test('should add multiple custom categories', async () => {
        const categories = [
            `Category 1 ${Date.now()}`,
            `Category 2 ${Date.now()}`,
            `Category 3 ${Date.now()}`,
        ];

        // Switch to categories tab
        await settingsPage.switchToTab('Categories');

        for (const category of categories) {
            await settingsPage.addCategory(category);
        }

        // All categories should be visible
        for (const category of categories) {
            await expect(settingsPage.getCategoryByName(category)).toBeVisible();
        }
    });

    test('should trigger export csv download', async ({ page }) => {
        // We need data to export, otherwise button might be disabled
        const expensesPage = new ExpensesPage(page);
        await expensesPage.goto();
        await expensesPage.addExpense({
            description: 'Export Test Expense',
            amount: '123.45',
            category: 'Food',
            date: new Date().toISOString().split('T')[0],
            isRecurring: false
        });

        await settingsPage.goto();
        await settingsPage.switchToTab('Export');

        // Start waiting for download before clicking
        const downloadPromise = page.waitForEvent('download');

        // Click download button
        await page.getByRole('button', { name: /download csv/i }).click();

        const download = await downloadPromise;

        // Verify filename
        expect(download.suggestedFilename()).toMatch(/expenses_.*\.csv/);
    });
});
