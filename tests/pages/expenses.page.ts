/**
 * Page Object Model for Expense Management
 */

import { Page, Locator } from '@playwright/test';
import { ExpenseFormData } from '../../lib/types';

export class ExpensesPage {
    readonly page: Page;
    readonly addExpenseButton: Locator;
    readonly expenseList: Locator;
    readonly emptyState: Locator;

    // Form elements
    readonly amountInput: Locator;
    readonly categorySelect: Locator;
    readonly dateInput: Locator;
    readonly descriptionInput: Locator;
    readonly submitButton: Locator;
    readonly cancelButton: Locator;

    // Type toggles
    readonly typeExpenseButton: Locator;
    readonly typeIncomeButton: Locator;

    // Expense item actions
    readonly editButton: Locator;
    readonly deleteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addExpenseButton = page.locator('[data-testid="add-expense-button"]');
        this.expenseList = page.locator('[data-testid="expense-list-section"]');
        this.emptyState = page.locator('[data-testid="empty-state"]');

        // Form elements
        this.amountInput = page.locator('[data-testid="expense-amount"]');
        this.categorySelect = page.locator('[data-testid="expense-category"]');
        this.dateInput = page.locator('[data-testid="expense-date"]');
        this.descriptionInput = page.locator('[data-testid="expense-description"]');
        this.submitButton = page.locator('[data-testid="submit-expense-button"]');
        this.cancelButton = page.locator('[data-testid="cancel-button"]');

        this.typeExpenseButton = page.locator('[data-testid="type-expense"]');
        this.typeIncomeButton = page.locator('[data-testid="type-income"]');

        // Expense item actions (these will match the first item)
        this.editButton = page.locator('[data-testid="edit-expense-button"]').first();
        this.deleteButton = page.locator('[data-testid="delete-expense-button"]').first();
    }

    async goto() {
        await this.page.goto('/');
    }

    async addExpense(data: { amount: string; category?: string; description?: string; date?: string; type?: 'income' | 'expense' }) {
        // Click add expense button
        await this.addExpenseButton.click();

        // Wait for modal to open
        await this.amountInput.waitFor({ state: 'visible' });

        // Select type if provided
        if (data.type === 'income') {
            await this.typeIncomeButton.click();
        } else if (data.type === 'expense') {
            await this.typeExpenseButton.click();
        }

        // Fill in the form
        await this.amountInput.fill(data.amount);

        if (data.category) {
            await this.categorySelect.selectOption(data.category);
        }

        if (data.date) {
            await this.dateInput.fill(data.date);
        }

        if (data.description) {
            await this.descriptionInput.fill(data.description);
        }

        // Submit the form
        await this.submitButton.click();

        // Wait for modal to close
        await this.amountInput.waitFor({ state: 'hidden', timeout: 5000 });
    }

    getExpenseByDescription(description: string): Locator {
        return this.page.locator('[data-testid="expense-list-section"]').getByText(description);
    }

    getExpenseItemByDescription(description: string): Locator {
        // Find the expense-item that contains the description text
        return this.page.locator('[data-testid="expense-item"]').filter({ hasText: description });
    }

    async editExpense(targetDescription: string, data: { amount?: string; category?: string; description?: string }) {
        // Find the item container that has the text, then find the edit button within it
        // The structure is: div.item > div.content > ... > p.description
        // And div.item > div.actions > button (edit)

        // Using a locator that finds the container based on text presence
        // Note: Using a broad selector for the item container. 
        // Based on ExpenseItem.tsx: <div className={styles.item}>
        // Since we don't have a testid on the item container yet, we have to rely on class structure or text relationship
        // A better way is to find the common ancestor

        const expenseItem = this.expenseList.locator('div').filter({ hasText: targetDescription }).first();
        // Note: This 'div' might be too generic, but filtering by text should narrow it down to the Card/Item.
        // Let's assume the ExpenseList renders ExpenseItems which are div blocks.

        await expenseItem.locator('[data-testid="edit-expense-button"]').click();

        // Wait for modal
        await this.amountInput.waitFor({ state: 'visible' });

        // Update fields
        if (data.amount) {
            await this.amountInput.fill(data.amount);
        }

        if (data.category) {
            await this.categorySelect.selectOption(data.category);
        }

        if (data.description) {
            await this.descriptionInput.fill(data.description);
        }

        // Submit
        await this.submitButton.click();

        // Wait for modal to close
        await this.amountInput.waitFor({ state: 'hidden', timeout: 5000 });
    }

    // Overload or modification to support legacy usage (no description)?
    // The previous tests called editExpense('Original Description', newData);
    // My signature above is editExpense(targetDescription, data).
    // So that works perfectly.

    async deleteExpense(targetDescription: string) {
        const expenseItem = this.expenseList.locator('[data-testid="expense-item"]').filter({ hasText: targetDescription }).first();
        await expenseItem.locator('[data-testid="delete-expense-button"]').click();

        // Wait a bit for deletion to complete
        await this.page.waitForTimeout(500);
    }

    async getExpenseCount(): Promise<number> {
        return await this.page.locator('[data-testid="edit-expense-button"]').count();
    }

    async cancelAddingExpense() {
        await this.addExpenseButton.click();
        await this.cancelButton.click();
    }
}
