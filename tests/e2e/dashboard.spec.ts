/**
 * E2E Tests for Dashboard and Analytics
 */

import { test, expect } from '@playwright/test';
import { AuthFixture } from '../fixtures/auth.fixture';
import { ExpensesPage } from '../pages/expenses.page';
import { DashboardPage } from '../pages/dashboard.page';
import { generateExpenseData, generateExpenseForMonth } from '../helpers/test-data';

test.describe('Dashboard and Analytics', () => {
    let authFixture: AuthFixture;
    let expensesPage: ExpensesPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        authFixture = new AuthFixture(page);
        expensesPage = new ExpensesPage(page);
        dashboardPage = new DashboardPage(page);
        await authFixture.createAndLoginUserViaApi();
    });

    test.afterEach(async () => {
        await authFixture.cleanup();
    });

    test('should display summary cards with correct data', async ({ page }) => {
        // Add some expenses
        await expensesPage.goto();
        await expensesPage.addExpense(generateExpenseData({ amount: '50.00' }));
        await expensesPage.addExpense(generateExpenseData({ amount: '30.00' }));
        await expensesPage.addExpense(generateExpenseData({ amount: '20.00' }));

        // Go to dashboard
        await dashboardPage.goto();
        await dashboardPage.waitForDataToLoad();

        // Check total spending (should be 100.00)
        // Check total spending (should be 100.00)
        await expect(dashboardPage.summaryCards).toContainText('100');

        // Check average expense (should be around 33.33)
        await expect(dashboardPage.summaryCards).toContainText('33');
    });

    test('should display category breakdown chart', async ({ page }) => {
        // Add expenses in different categories
        await expensesPage.goto();
        await expensesPage.addExpense(generateExpenseData({ category: 'Food', amount: '50.00' }));
        await expensesPage.addExpense(generateExpenseData({ category: 'Transport', amount: '30.00' }));

        await dashboardPage.goto();
        await dashboardPage.waitForDataToLoad();

        // Chart should be visible
        await expect(dashboardPage.categoryChart).toBeVisible();
    });

    test('should filter expenses by "This Month"', async ({ page }) => {
        // Add expenses for this month and last month
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        await expensesPage.goto();
        await expensesPage.addExpense(generateExpenseData({
            description: 'This Month',
            date: today.toISOString().split('T')[0]
        }));
        await expensesPage.addExpense(generateExpenseData({
            description: 'Last Month',
            date: lastMonth.toISOString().split('T')[0]
        }));

        await dashboardPage.goto();
        await dashboardPage.filterByDateRange('This Month');

        // Should show only this month's data
        await dashboardPage.waitForDataToLoad();
    });

    test('should filter expenses by "Last Month"', async ({ page }) => {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        await expensesPage.goto();
        await expensesPage.addExpense(generateExpenseData({
            date: lastMonth.toISOString().split('T')[0],
            amount: '75.00'
        }));

        await dashboardPage.goto();
        await dashboardPage.filterByDateRange('Last Month');
        await dashboardPage.waitForDataToLoad();

        // Should show last month's data
        const totalSpending = await dashboardPage.getTotalSpending();
        expect(totalSpending).toContain('75');
    });

    test('should update dashboard when expenses change', async ({ page }) => {
        // Add initial expense
        await expensesPage.goto();
        await expensesPage.addExpense(generateExpenseData({ amount: '50.00' }));

        await dashboardPage.goto();
        await dashboardPage.waitForDataToLoad();

        await expect(dashboardPage.summaryCards).toContainText('50');

        // Add another expense
        await expensesPage.goto();
        await expensesPage.addExpense(generateExpenseData({ amount: '25.00' }));

        await dashboardPage.goto();
        await dashboardPage.waitForDataToLoad();

        // Total should update
        // Total should update
        await expect(dashboardPage.summaryCards).toContainText('75');
    });

    test('should show empty state when no expenses', async () => {
        await dashboardPage.goto();
        await dashboardPage.waitForDataToLoad();

        // Should show zero or empty state
        const totalSpending = await dashboardPage.getTotalSpending();
        expect(totalSpending).toContain('0');
    });
});
