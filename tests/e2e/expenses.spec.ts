/**
 * E2E Tests for Expense Management
 */

import { test, expect } from '@playwright/test';
import { AuthFixture } from '../fixtures/auth.fixture';
import { ExpensesPage } from '../pages/expenses.page';
import { generateExpenseData } from '../helpers/test-data';

test.describe('Expense Management', () => {
    let authFixture: AuthFixture;
    let expensesPage: ExpensesPage;

    test.beforeEach(async ({ page }) => {
        // Create and login a unique user for each test
        authFixture = new AuthFixture(page);
        await authFixture.createAndLoginUserViaApi();

        expensesPage = new ExpensesPage(page);
        await expensesPage.goto();
    });

    test.afterEach(async () => {
        await authFixture.cleanup();
    });

    test('should display empty state when no expenses', async () => {
        await expect(expensesPage.emptyState).toBeVisible();
    });

    test('should add a new expense with all fields', async () => {
        const expenseData = generateExpenseData();

        await expensesPage.addExpense(expenseData);

        // Expense should be visible in the list
        const expense = expensesPage.getExpenseByDescription(expenseData.description);
        await expect(expense).toBeVisible();

        // Empty state should not be visible
        await expect(expensesPage.emptyState).not.toBeVisible();
    });

    test('should add multiple expenses', async () => {
        const expense1 = generateExpenseData({ description: 'Test Expense 1' });
        const expense2 = generateExpenseData({ description: 'Test Expense 2' });
        const expense3 = generateExpenseData({ description: 'Test Expense 3' });

        await expensesPage.addExpense(expense1);
        await expensesPage.addExpense(expense2);
        await expensesPage.addExpense(expense3);

        // All expenses should be visible
        await expect(expensesPage.getExpenseByDescription('Test Expense 1')).toBeVisible();
        await expect(expensesPage.getExpenseByDescription('Test Expense 2')).toBeVisible();
        await expect(expensesPage.getExpenseByDescription('Test Expense 3')).toBeVisible();

        // Count should be 3
        const count = await expensesPage.getExpenseCount();
        expect(count).toBe(3);
    });

    test('should edit an existing expense', async () => {
        // Add an expense
        const originalData = generateExpenseData({ description: 'Original Description' });
        await expensesPage.addExpense(originalData);

        // Edit the expense
        const newData = { description: 'Updated Description', amount: '99.99' };
        await expensesPage.editExpense('Original Description', newData);

        // Updated expense should be visible
        await expect(expensesPage.getExpenseByDescription('Updated Description')).toBeVisible();

        // Original should not be visible
        await expect(expensesPage.getExpenseByDescription('Original Description')).not.toBeVisible();
    });

    test('should delete an expense', async () => {
        // Add an expense
        const expenseData = generateExpenseData({ description: 'To Be Deleted' });
        await expensesPage.addExpense(expenseData);

        // Verify it's there
        await expect(expensesPage.getExpenseByDescription('To Be Deleted')).toBeVisible();

        // Delete it
        await expensesPage.deleteExpense('To Be Deleted');

        // Should not be visible anymore
        await expect(expensesPage.getExpenseByDescription('To Be Deleted')).not.toBeVisible();

        // Empty state should be visible again
        await expect(expensesPage.emptyState).toBeVisible();
    });

    test('should show validation error for empty amount', async ({ page }) => {
        await expensesPage.addExpenseButton.click();

        // Try to submit without filling amount
        await expensesPage.categorySelect.selectOption('Food');
        await expensesPage.descriptionInput.fill('Test');
        await expensesPage.dateInput.fill('2026-01-24');
        await expensesPage.submitButton.click();

        // Form should still be visible (validation failed)
        await expect(expensesPage.amountInput).toBeVisible();
    });

    test('should cancel adding an expense', async () => {
        await expensesPage.addExpenseButton.click();

        // Fill some data
        await expensesPage.amountInput.fill('50.00');

        // Cancel
        await expensesPage.cancelButton.click();

        // Modal should close, empty state should still be visible
        await expect(expensesPage.emptyState).toBeVisible();
    });

    test('should display expenses in correct order', async () => {
        // Add expenses with different dates
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        await expensesPage.addExpense(generateExpenseData({
            description: 'Today',
            date: today.toISOString().split('T')[0]
        }));

        await expensesPage.addExpense(generateExpenseData({
            description: 'Yesterday',
            date: yesterday.toISOString().split('T')[0]
        }));

        await expensesPage.addExpense(generateExpenseData({
            description: 'Last Week',
            date: lastWeek.toISOString().split('T')[0]
        }));

        // All should be visible
        const count = await expensesPage.getExpenseCount();
        expect(count).toBe(3);
    });
});
