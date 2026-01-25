import { test, expect } from '@playwright/test';
import { AuthFixture } from '../fixtures/auth.fixture';
import { ExpensesPage } from '../pages/expenses.page';
import { generateExpenseData } from '../helpers/test-data';

test.describe('Income Management', () => {
    let authFixture: AuthFixture;
    let expensesPage: ExpensesPage;

    test.beforeEach(async ({ page }) => {
        authFixture = new AuthFixture(page);
        await authFixture.createAndLoginUserViaApi();
        expensesPage = new ExpensesPage(page);
        await expensesPage.goto();
    });

    test.afterEach(async () => {
        await authFixture.cleanup();
    });

    test('should add a new income transaction', async ({ page }) => {
        const incomeData = {
            amount: '5000.00',
            category: 'Salary',
            description: 'Monthly Salary',
            type: 'income' as const
        };

        await expensesPage.addExpense(incomeData);

        // Verify it appears in the list
        const transactionItem = expensesPage.getExpenseItemByDescription('Monthly Salary');
        await expect(transactionItem).toBeVisible();

        // Verify positive amount display
        // Default currency is USD ($)
        await expect(transactionItem).toContainText('+$5,000.00');
    });

    test('should differentiate between income and expense in the list', async () => {
        // Add Income
        await expensesPage.addExpense({
            amount: '1000',
            category: 'Salary',
            description: 'Income Test',
            type: 'income'
        });

        // Add Expense
        await expensesPage.addExpense({
            amount: '50',
            category: 'Food',
            description: 'Expense Test',
            type: 'expense'
        });

        const incomeItem = expensesPage.getExpenseByDescription('Income Test');
        const expenseItem = expensesPage.getExpenseByDescription('Expense Test');

        await expect(incomeItem).toBeVisible();
        await expect(expenseItem).toBeVisible();
    });
});
