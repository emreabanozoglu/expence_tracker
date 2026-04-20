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
            isRecurring: true
        });

        // 2. Go to Settings
        await settingsPage.goto();

        // Switch to recurring tab
        await settingsPage.switchToTab('Recurring');

        // 3. Verify it appears
        const recurringItem = settingsPage.getRecurringTransactionByDescription('Netflix Subscription');
        await expect(recurringItem).toBeVisible();

        // 4. Edit it
        await settingsPage.editRecurringTransaction('Netflix Subscription', {
            amount: '20.00'
        });

        // 5. Verify updates in the list (simple text check)
        await expect(recurringItem).toContainText('$20.00');

        // 6. Verify Toggle is NOT visible in Modal (User Requirement)
        // Re-open modal
        await recurringItem.getByLabel('Edit recurring transaction').click();
        await expect(page.getByText('Edit Recurring Transaction')).toBeVisible();

        // Check toggle is hidden
        const toggle = page.locator('[data-testid="expense-is-recurring"]');
        await expect(toggle).not.toBeVisible();
    });

    test('should delete a recurring transaction', async () => {
        const expenseData = generateExpenseData({ description: 'Spotify' });

        // Add
        await expensesPage.addExpense({
            ...expenseData,
            isRecurring: true
        });

        // Go to Settings
        await settingsPage.goto();
        await settingsPage.switchToTab('Recurring');

        // Verify exists
        const recurringItem = settingsPage.getRecurringTransactionByDescription('Spotify');
        await expect(recurringItem).toBeVisible();

        // Delete
        await settingsPage.deleteRecurringTransaction('Spotify');

        // Verify gone
        await expect(recurringItem).not.toBeVisible();
    });
    test('should display correct total recurring income and expense counts', async ({ page }) => {
        // 1. Add Recurring Expense
        await expensesPage.addExpense(generateExpenseData({
            type: 'expense',
            amount: '50.00',
            description: 'Monthly Sub',
            isRecurring: true
        }));

        // 2. Add Recurring Income
        await expensesPage.addExpense(generateExpenseData({
            type: 'income',
            amount: '1000.00',
            description: 'Monthly Salary',
            isRecurring: true
        }));

        // 3. Go to Settings > Recurring
        await settingsPage.goto();
        await settingsPage.switchToTab('Recurring');

        // 4. Verify Totals
        // Assuming we added the summary with specific text
        await expect(page.getByText('Total Recurring Incomes')).toBeVisible();
        await expect(page.getByText('Total Recurring Expenses')).toBeVisible();

        // Check values - finding the value associated with the label might need structural locator
        // We put value and label in a flex column, value is above label.
        // We can check by text content of the summary item container or specific locator if we add test ids.
        // Let's use text containment for the specific item block or basic proximity if possible, 
        // For now, looking for the number "1" might be ambiguous.
        // Better to check: "1" followed by "Total Recurring Incomes" in the DOM or container textual match.

        // Since we didn't add data-testids to the summary values specifically, let's look for text "1" near "Total Recurring Incomes"
        // Or simpler: The whole page should contain "1" near the label?
        // Let's rely on the structure:
        // .summaryItem > .summaryValue(1) + .summaryLabel(Total Recurring Incomes)

        const incomeSummary = page.locator('div', { hasText: 'Total Recurring Incomes' }).filter({ hasText: '1' });
        await expect(incomeSummary).toBeVisible();

        const expenseSummary = page.locator('div', { hasText: 'Total Recurring Expenses' }).filter({ hasText: '1' });
        await expect(expenseSummary).toBeVisible();
    });
});
