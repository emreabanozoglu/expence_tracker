/**
 * Page Object Model for Expense Management
 */

import { Page, Locator } from '@playwright/test';
import { ExpenseData } from '../helpers/test-data';

export class ExpensesPage {
    readonly page: Page;
    readonly addExpenseButton: Locator;
    readonly expenseList: Locator;
    readonly emptyState: Locator;

    // Form fields
    readonly amountInput: Locator;
    readonly categorySelect: Locator;
    readonly descriptionInput: Locator;
    readonly dateInput: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addExpenseButton = page.getByRole('button', { name: /add expense/i });
        this.expenseList = page.locator('[data-testid="expense-list"], [class*="expense-list"]');
        this.emptyState = page.getByText(/no expenses/i);

        // Form fields
        this.amountInput = page.getByLabel(/amount/i);
        this.categorySelect = page.getByLabel(/category/i);
        this.descriptionInput = page.getByLabel(/description/i);
        this.dateInput = page.getByLabel(/date/i);
        this.submitButton = page.getByRole('button', { name: /save|add/i });
        this.cancelButton = page.getByRole('button', { name: /cancel/i });
    }

    async goto() {
        await this.page.goto('/');
    }

    async addExpense(data: ExpenseData) {
        await this.addExpenseButton.click();

        await this.amountInput.fill(data.amount);
        await this.categorySelect.selectOption(data.category);
        await this.descriptionInput.fill(data.description);
        await this.dateInput.fill(data.date);

        await this.submitButton.click();

        // Wait for modal to close
        await this.page.waitForTimeout(500);
    }

    async editExpense(description: string, newData: Partial<ExpenseData>) {
        const expenseItem = this.getExpenseByDescription(description);
        const editButton = expenseItem.getByRole('button', { name: /edit/i });

        await editButton.click();

        if (newData.amount) await this.amountInput.fill(newData.amount);
        if (newData.category) await this.categorySelect.selectOption(newData.category);
        if (newData.description) await this.descriptionInput.fill(newData.description);
        if (newData.date) await this.dateInput.fill(newData.date);

        await this.submitButton.click();

        // Wait for modal to close
        await this.page.waitForTimeout(500);
    }

    async deleteExpense(description: string) {
        const expenseItem = this.getExpenseByDescription(description);
        const deleteButton = expenseItem.getByRole('button', { name: /delete/i });

        await deleteButton.click();

        // Wait for deletion to complete
        await this.page.waitForTimeout(500);
    }

    getExpenseByDescription(description: string): Locator {
        return this.page.locator(`[data-testid="expense-item"]:has-text("${description}")`);
    }

    async getExpenseCount(): Promise<number> {
        const expenses = this.page.locator('[data-testid="expense-item"]');
        return await expenses.count();
    }

    async isEmptyStateVisible(): Promise<boolean> {
        return await this.emptyState.isVisible();
    }

    async getAllExpenses(): Promise<string[]> {
        const expenses = this.page.locator('[data-testid="expense-item"]');
        const count = await expenses.count();
        const descriptions: string[] = [];

        for (let i = 0; i < count; i++) {
            const text = await expenses.nth(i).textContent();
            if (text) descriptions.push(text);
        }

        return descriptions;
    }
}
