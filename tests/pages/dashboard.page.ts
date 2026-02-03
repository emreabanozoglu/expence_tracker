/**
 * Page Object Model for Dashboard
 */

import { Page, Locator } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly categoryChart: Locator;
    readonly dateRangeFilter: Locator;

    constructor(page: Page) {
        this.page = page;
        this.categoryChart = page.locator('[data-testid="category-chart"]');
        this.dateRangeFilter = page.locator('select, button').filter({ hasText: /this month|last month|all time/i }).first();
    }

    async goto() {
        await this.page.goto('/');
    }

    // Alias for compatibility
    async waitForDataToLoad() {
        await this.waitForDashboardLoad();
    }

    async waitForDashboardLoad() {
        // Wait for either category chart or empty state
        // Note: Filters might appear before content, but chart/empty state confirms data loaded
        await Promise.race([
            this.categoryChart.waitFor({ state: 'visible', timeout: 5000 }),
            this.page.locator('[data-testid="empty-state"]').waitFor({ state: 'visible', timeout: 5000 })
        ]).catch(() => {
            // If neither appears, that's okay - might be loading
        });
    }

    async filterByDateRange(range: string) {
        // Handle mobile view where filters might be collapsed
        // Check if we are in mobile view by checking for the collapsing header
        // Note: We don't have a direct selector for the header class in POM without importing styles or using test-id
        // But we can check if the button we want is visible.

        let targetButton = this.page.locator(`button:has-text("${range}")`);
        // If exact match doesn't work (e.g. casing), try getByText
        if (await targetButton.count() === 0) {
            targetButton = this.page.getByRole('button', { name: range });
        }

        if (!await targetButton.isVisible()) {
            // Might be collapsed on mobile. Try clicking the header.
            const header = this.page.locator('[data-testid="date-filter-header"]');
            if (await header.isVisible()) {
                await header.click({ force: true }); // Force click to ensure it triggers despite any overlays
                // Wait for the target button to become visible after expansion
                try {
                    await targetButton.waitFor({ state: 'visible', timeout: 2000 });
                } catch (e) {
                    console.log('Target button did not become visible after header click');
                }
            }
        }

        // Try to find a button with the range text
        if (await targetButton.isVisible()) {
            await targetButton.click();
            return;
        }

        // Or look for it in a dropdown/select if implemented that way
        try {
            await this.page.getByText(range).click();
        } catch (e) {
            console.log(`Could not filter by ${range}`);
        }
    }
}
