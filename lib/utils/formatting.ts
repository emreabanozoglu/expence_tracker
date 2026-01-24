// Formatting utility functions

/**
 * Format a number as currency
 * Uses the currency from settings if available, otherwise defaults to USD
 */
export function formatCurrency(amount: number, currencySymbol: string = '$'): string {
    return `${currencySymbol}${amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format a date string to a short format (MMM DD)
 */
export function formatDateShort(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format a number as a percentage
 */
export function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
}

/**
 * Parse an amount string and return a valid number or null
 */
export function parseAmount(value: string): number | null {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);

    if (isNaN(parsed) || parsed <= 0) {
        return null;
    }

    // Round to 2 decimal places
    return Math.round(parsed * 100) / 100;
}
