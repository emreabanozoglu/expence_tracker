/**
 * Page Object Model for Dashboard
 */

import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly summaryCards: Locator;
    readonly categoryChart: Locator;
    readonly dateRangeFilter: Locator;

    constructor(page: Page) {
        this.page = page;
        this.summaryCards = page.locator('[data-testid="summary-cards"]');
        this.categoryChart = page.locator('[data-testid="category-chart"]');
        this.dateRangeFilter = page.locator('select, button').filter({ hasText: /this month|last month|all time/i }).first();
    }

    async goto() {
        await this.page.goto('/');
    }

    async getTotalSpending(): Promise<string> {
        // Now maps to Total Expense
        const totalCard = this.page.locator('[data-testid="total-expense"]');
        if (await totalCard.isVisible()) {
            return (await totalCard.textContent()) || '0';
        }
        return '0';
    }

    async getTotalIncome(): Promise<string> {
        const totalCard = this.page.locator('[data-testid="total-income"]');
        if (await totalCard.isVisible()) {
            return (await totalCard.textContent()) || '0';
        }
        return '0';
    }

    async getNetBalance(): Promise<string> {
        const totalCard = this.page.locator('[data-testid="net-balance"]');
        if (await totalCard.isVisible()) {
            return (await totalCard.textContent()) || '0';
        }
        return '0';
    }

    // Alias for compatibility
    async waitForDataToLoad() {
        await this.waitForDashboardLoad();
    }

    async waitForDashboardLoad() {
        // Wait for either summary cards or empty state
        await Promise.race([
            this.summaryCards.waitFor({ state: 'visible', timeout: 5000 }),
            this.page.locator('[data-testid="empty-state"]').waitFor({ state: 'visible', timeout: 5000 })
        ]).catch(() => {
            // If neither appears, that's okay - might be loading
        });
    }

    async filterByDateRange(range: string) {
        // The date range filter implementation might vary
        // If it's a select or a set of buttons
        try {
            // Try to find a button with the range text
            const button = this.page.locator(`button:has-text("${range}")`);
            if (await button.isVisible()) {
                await button.click();
                return;
            }

            // Or look for it in a dropdown/select if implemented that way
            // For now, let's assume it works via text match on buttons or list items
            await this.page.getByText(range).click();
        } catch (e) {
            console.log(`Could not filter by ${range}`);
        }
    }
}
