/**
 * Page Object Model for Settings
 */

import { Page, Locator, expect } from '@playwright/test';

export class SettingsPage {
    readonly page: Page;
    readonly currencySelector: Locator;
    readonly categoryList: Locator;
    readonly addCategoryButton: Locator;
    readonly resetCategoriesButton: Locator;
    readonly loadingState: Locator;

    // Category item actions
    readonly editCategoryButton: Locator;
    readonly deleteCategoryButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.currencySelector = page.locator('[data-testid="currency-selector"]');
        this.categoryList = page.locator('[data-testid="category-list"]');
        this.addCategoryButton = page.locator('[data-testid="add-category-button"]');
        this.resetCategoriesButton = page.locator('[data-testid="reset-categories-button"]');
        this.loadingState = page.locator('[data-testid="settings-loading"]');

        this.editCategoryButton = page.locator('[data-testid="edit-category-button"]').first();
        this.deleteCategoryButton = page.locator('[data-testid="delete-category-button"]').first();
    }

    async switchToTab(tabName: 'General' | 'Budget' | 'Categories' | 'Recurring' | 'Export') {
        // Check for mobile back button (if we are in a tab on mobile, sidebar is hidden)
        const backButton = this.page.getByRole('button', { name: 'Back to Settings' });
        if (await backButton.isVisible()) {
            await backButton.click();
        }

        await this.page.getByRole('button', { name: tabName }).click();
        // Wait for potential content change / loading
        await this.page.waitForTimeout(500);
    }

    // Recurring Transaction Locators
    get recurringList() { return this.page.locator('.RecurringTransactionsList_list__Z1h_1'); } // Or better selector if available

    getRecurringTransactionByDescription(description: string): Locator {
        // Use the specific test ID and filter by text description
        return this.page.locator('[data-testid="recurring-item"]').filter({ hasText: description });
    }

    async editRecurringTransaction(description: string, updates: { amount?: string, frequency?: string }) {
        const item = this.getRecurringTransactionByDescription(description);
        await item.getByLabel('Edit recurring transaction').click();

        // Wait for modal
        const modal = this.page.locator('div[class*="Modal_modal"]'); // or by title
        await this.page.getByText('Edit Recurring Transaction').waitFor({ state: 'visible' });

        if (updates.amount) {
            await this.page.locator('[data-testid="expense-amount"]').fill(updates.amount);
        }

        if (updates.frequency) {
            await this.page.locator('[data-testid="expense-frequency"]').selectOption(updates.frequency);
        }

        await this.page.locator('[data-testid="submit-expense-button"]').click();
        await this.page.getByText('Edit Recurring Transaction').waitFor({ state: 'hidden' });
    }

    async deleteRecurringTransaction(description: string) {
        const item = this.getRecurringTransactionByDescription(description);
        await item.getByLabel('Delete recurring transaction').click();
    }

    async goto() {
        await this.page.goto('/settings');
    }

    async changeCurrency(currencyCode: string) {
        // Handle potential DOM detachment (re-renders) by retrying
        // Use a polling approach or simple retry since the element might be replaced
        await expect(async () => {
            await this.currencySelector.selectOption(currencyCode);
        }).toPass({ timeout: 10000 });
    }

    async getSelectedCurrency(): Promise<string> {
        return await this.currencySelector.inputValue();
    }

    // Alias for tests
    async getCurrency(): Promise<string> {
        return this.getSelectedCurrency();
    }

    getCategoryByName(name: string): Locator {
        return this.page.locator('[data-testid="category-card"]').filter({ hasText: name });
    }

    async addCategory(name: string, color: string = '#FF5733') {
        await this.addCategoryButton.click({ force: true });


        // Wait for modal
        const nameInput = this.page.locator('[data-testid="category-name-input"]');
        await nameInput.waitFor({ state: 'visible' });

        await nameInput.fill(name);

        // Simplification: just using default color or first available
        // In a real test we might interact with a color picker

        await this.page.locator('[data-testid="submit-category-button"]').click();

        // Wait for modal to close
        await nameInput.waitFor({ state: 'hidden' });

        // Wait for the category to appear in the list (confirms persistence)
        await this.getCategoryByName(name).waitFor({ state: 'visible' });
    }

    async deleteCategory(name: string) {
        const card = this.page.locator('[data-testid="category-card"]').filter({ hasText: name }).first();
        const deleteBtn = card.locator('[data-testid="delete-category-button"]');

        // Ensure button is ready
        await deleteBtn.waitFor({ state: 'visible' });
        await deleteBtn.click();

        // Wait for deletion to verify persistence
        await card.waitFor({ state: 'hidden' });
    }

    async resetCategories() {
        await this.resetCategoriesButton.click(); // First click to show confirm
        await this.page.waitForTimeout(100);
        await this.resetCategoriesButton.click(); // Second click to confirm

        // Wait for reset to process
        await this.page.waitForTimeout(1000);
    }
}
