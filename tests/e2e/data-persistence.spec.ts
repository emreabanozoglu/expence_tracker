/**
 * E2E Tests for Data Persistence
 */

import { test, expect } from '@playwright/test';
import { AuthFixture } from '../fixtures/auth.fixture';
import { ExpensesPage } from '../pages/expenses.page';
import { generateExpenseData } from '../helpers/test-data';

test.describe('Data Persistence', () => {
    let authFixture: AuthFixture;
    let expensesPage: ExpensesPage;

    test.beforeEach(async ({ page }) => {
        authFixture = new AuthFixture(page);
        await authFixture.createAndLoginUser();

        expensesPage = new ExpensesPage(page);
    });

    test('should persist expenses after page refresh', async ({ page }) => {
        // Add an expense
        const expenseData = generateExpenseData({ description: 'Persistent Expense' });
        await expensesPage.goto();
        await expensesPage.addExpense(expenseData);

        // Verify it's there
        await expect(expensesPage.getExpenseByDescription('Persistent Expense')).toBeVisible();

        // Refresh the page
        await page.reload();

        // Expense should still be there
        await expect(expensesPage.getExpenseByDescription('Persistent Expense')).toBeVisible();
    });

    test('should persist expenses after logout and login', async ({ page }) => {
        // Add an expense
        const expenseData = generateExpenseData({ description: 'Logout Test Expense' });
        await expensesPage.goto();
        await expensesPage.addExpense(expenseData);

        // Get credentials
        const { email, password } = authFixture.getCredentials();

        // Logout
        await authFixture.logout();

        // Login again
        await authFixture.login(email, password);

        // Go to expenses page
        await expensesPage.goto();

        // Expense should still be there
        await expect(expensesPage.getExpenseByDescription('Logout Test Expense')).toBeVisible();
    });

    test('should isolate data between different users', async ({ page, context }) => {
        // User 1 adds an expense
        const user1ExpenseData = generateExpenseData({ description: 'User 1 Expense' });
        await expensesPage.goto();
        await expensesPage.addExpense(user1ExpenseData);

        // Logout user 1
        await authFixture.logout();

        // Create and login user 2 in a new page
        const page2 = await context.newPage();
        const authFixture2 = new AuthFixture(page2);
        await authFixture2.createAndLoginUser();

        const expensesPage2 = new ExpensesPage(page2);
        await expensesPage2.goto();

        // User 2 should not see User 1's expense
        await expect(expensesPage2.getExpenseByDescription('User 1 Expense')).not.toBeVisible();

        // User 2 should see empty state
        await expect(expensesPage2.emptyState).toBeVisible();

        // Add User 2's expense
        const user2ExpenseData = generateExpenseData({ description: 'User 2 Expense' });
        await expensesPage2.addExpense(user2ExpenseData);

        // User 2 should see their own expense
        await expect(expensesPage2.getExpenseByDescription('User 2 Expense')).toBeVisible();

        await page2.close();
    });

    test('should persist multiple expenses correctly', async ({ page }) => {
        // Add multiple expenses
        const expenses = [
            generateExpenseData({ description: 'Expense 1', amount: '10.00' }),
            generateExpenseData({ description: 'Expense 2', amount: '20.00' }),
            generateExpenseData({ description: 'Expense 3', amount: '30.00' }),
        ];

        await expensesPage.goto();
        for (const expense of expenses) {
            await expensesPage.addExpense(expense);
        }

        // Refresh page
        await page.reload();

        // All expenses should still be there
        for (const expense of expenses) {
            await expect(expensesPage.getExpenseByDescription(expense.description)).toBeVisible();
        }

        // Count should be correct
        const count = await expensesPage.getExpenseCount();
        expect(count).toBe(3);
    });

    test('should persist edited expenses', async ({ page }) => {
        // Add an expense
        const originalData = generateExpenseData({ description: 'Original' });
        await expensesPage.goto();
        await expensesPage.addExpense(originalData);

        // Edit it
        await expensesPage.editExpense('Original', { description: 'Edited' });

        // Refresh page
        await page.reload();

        // Edited version should persist
        await expect(expensesPage.getExpenseByDescription('Edited')).toBeVisible();
        await expect(expensesPage.getExpenseByDescription('Original')).not.toBeVisible();
    });

    test('should persist deletions', async ({ page }) => {
        // Add two expenses
        await expensesPage.goto();
        await expensesPage.addExpense(generateExpenseData({ description: 'Keep This' }));
        await expensesPage.addExpense(generateExpenseData({ description: 'Delete This' }));

        // Delete one
        await expensesPage.deleteExpense('Delete This');

        // Refresh page
        await page.reload();

        // Deleted expense should not be there
        await expect(expensesPage.getExpenseByDescription('Delete This')).not.toBeVisible();

        // Other expense should still be there
        await expect(expensesPage.getExpenseByDescription('Keep This')).toBeVisible();
    });
});
