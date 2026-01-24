/**
 * Page Object Model for Settings page
 */

import { Page, Locator } from '@playwright/test';

export class SettingsPage {
    readonly page: Page;

    // Currency settings
    readonly currencySelect: Locator;
    readonly currencySymbolDisplay: Locator;

    // Category management
    readonly categoryInput: Locator;
    readonly addCategoryButton: Locator;
    readonly categoryList: Locator;

    // Save button
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Currency settings
        this.currencySelect = page.getByLabel(/currency/i);
        this.currencySymbolDisplay = page.locator('[data-testid="currency-symbol"]');

        // Category management
        this.categoryInput = page.getByLabel(/category name|new category/i);
        this.addCategoryButton = page.getByRole('button', { name: /add category/i });
        this.categoryList = page.locator('[data-testid="category-list"]');

        // Save button
        this.saveButton = page.getByRole('button', { name: /save/i });
    }

    async goto() {
        await this.page.goto('/settings');
    }

    async changeCurrency(currencyCode: string) {
        await this.currencySelect.selectOption(currencyCode);
        // Wait for update
        await this.page.waitForTimeout(500);
    }

    async getCurrency(): Promise<string> {
        return await this.currencySelect.inputValue();
    }

    async addCategory(categoryName: string) {
        await this.categoryInput.fill(categoryName);
        await this.addCategoryButton.click();
        // Wait for category to be added
        await this.page.waitForTimeout(500);
    }

    async deleteCategory(categoryName: string) {
        const categoryItem = this.getCategoryByName(categoryName);
        const deleteButton = categoryItem.getByRole('button', { name: /delete|remove/i });
        await deleteButton.click();
        // Wait for deletion
        await this.page.waitForTimeout(500);
    }

    getCategoryByName(name: string): Locator {
        return this.page.locator(`[data-testid="category-item"]:has-text("${name}")`);
    }

    async isCategoryVisible(name: string): Promise<boolean> {
        return await this.getCategoryByName(name).isVisible();
    }

    async saveSettings() {
        await this.saveButton.click();
        // Wait for save to complete
        await this.page.waitForTimeout(500);
    }
}
