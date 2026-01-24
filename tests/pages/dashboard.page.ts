/**
 * Page Object Model for Dashboard and Analytics
 */

import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;

    // Summary cards
    readonly totalSpendingCard: Locator;
    readonly averageExpenseCard: Locator;
    readonly topCategoryCard: Locator;

    // Filters
    readonly dateRangeFilter: Locator;
    readonly monthFilter: Locator;

    // Chart
    readonly categoryChart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Summary cards - adjust selectors based on your actual implementation
        this.totalSpendingCard = page.locator('[data-testid="total-spending"]');
        this.averageExpenseCard = page.locator('[data-testid="average-expense"]');
        this.topCategoryCard = page.locator('[data-testid="top-category"]');

        // Filters
        this.dateRangeFilter = page.getByLabel(/date range|filter/i);
        this.monthFilter = page.getByLabel(/month/i);

        // Chart
        this.categoryChart = page.locator('[data-testid="category-chart"], .recharts-wrapper');
    }

    async goto() {
        await this.page.goto('/');
    }

    async getTotalSpending(): Promise<string> {
        return await this.totalSpendingCard.textContent() || '0';
    }

    async getAverageExpense(): Promise<string> {
        return await this.averageExpenseCard.textContent() || '0';
    }

    async getTopCategory(): Promise<string> {
        return await this.topCategoryCard.textContent() || '';
    }

    async filterByDateRange(range: 'All Time' | 'This Month' | 'Last Month') {
        await this.dateRangeFilter.selectOption(range);
        // Wait for data to update
        await this.page.waitForTimeout(500);
    }

    async filterByMonth(month: string) {
        await this.monthFilter.selectOption(month);
        // Wait for data to update
        await this.page.waitForTimeout(500);
    }

    async isChartVisible(): Promise<boolean> {
        return await this.categoryChart.isVisible();
    }

    async getChartData(): Promise<any> {
        // This would require more specific implementation based on your chart library
        // For now, just check if chart is rendered
        return await this.isChartVisible();
    }

    async waitForDataToLoad() {
        // Wait for any loading indicators to disappear
        await this.page.waitForTimeout(1000);
    }
}
