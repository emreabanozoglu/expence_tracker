/**
 * E2E Tests for Recurring Transactions
 */

import { test, expect } from '@playwright/test';
import { AuthFixture } from '../fixtures/auth.fixture';
import { ExpensesPage } from '../pages/expenses.page';
import { SettingsPage } from '../pages/settings.page';
import { generateExpenseData } from '../helpers/test-data';

test.describe('Recurring Transactions', () => {
    let authFixture: AuthFixture;
    let expensesPage: ExpensesPage;
    let settingsPage: SettingsPage;

    test.beforeEach(async ({ page }) => {
        authFixture = new AuthFixture(page);
        await authFixture.createAndLoginUserViaApi();

        expensesPage = new ExpensesPage(page);
        settingsPage = new SettingsPage(page);

        // Start at home
        await expensesPage.goto();
    });

    test.afterEach(async () => {
        await authFixture.cleanup();
    });

    test('should add a recurring transaction and edit it in settings', async ({ page }) => {
        const expenseData = generateExpenseData({ description: 'Netflix Subscription' });

        // 1. Add Recurring Expense
        await expensesPage.addExpense({
            ...expenseData,
            isRecurring: true,
            frequency: 'monthly'
        });

        // 2. Go to Settings
        await settingsPage.goto();

        // 3. Verify it appears
        const recurringItem = settingsPage.getRecurringTransactionByDescription('Netflix Subscription');
        await expect(recurringItem).toBeVisible();

        // 4. Edit it
        await settingsPage.editRecurringTransaction('Netflix Subscription', {
            amount: '20.00',
            frequency: 'weekly'
        });

        // 5. Verify updates in the list (simple text check)
        await expect(recurringItem).toContainText('$20.00');
        await expect(recurringItem).toContainText('weekly');

        // 6. Verify Toggle is NOT visible in Modal (User Requirement)
        // Re-open modal
        await recurringItem.getByLabel('Edit recurring transaction').click();
        await expect(page.getByText('Edit Recurring Transaction')).toBeVisible();

        // Check toggle is hidden
        const toggle = page.locator('[data-testid="expense-is-recurring"]');
        await expect(toggle).not.toBeVisible();

        // Check frequency is visible
        const frequency = page.locator('[data-testid="expense-frequency"]');
        await expect(frequency).toBeVisible();
        await expect(frequency).toHaveValue('weekly');
    });

    test('should delete a recurring transaction', async () => {
        const expenseData = generateExpenseData({ description: 'Spotify' });

        // Add
        await expensesPage.addExpense({
            ...expenseData,
            isRecurring: true,
            frequency: 'monthly'
        });

        // Go to Settings
        await settingsPage.goto();

        // Verify exists
        const recurringItem = settingsPage.getRecurringTransactionByDescription('Spotify');
        await expect(recurringItem).toBeVisible();

        // Delete
        await settingsPage.deleteRecurringTransaction('Spotify');

        // Verify gone
        await expect(recurringItem).not.toBeVisible();
    });
});
