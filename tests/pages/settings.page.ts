/**
 * Page Object Model for Settings
 */

import { Page, Locator } from '@playwright/test';

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

    async goto() {
        await this.page.goto('/settings');
    }

    async changeCurrency(currencyCode: string) {
        await this.currencySelector.selectOption(currencyCode);
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
        await this.addCategoryButton.click();

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
