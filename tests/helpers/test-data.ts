/**
 * Test data generators for creating unique test data
 */

export function generateUniqueEmail(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `test-${timestamp}-${random}@playwright-test.com`;
}

export function generatePassword(): string {
    return 'TestPassword123!';
}

export interface ExpenseData {
    amount: string;
    category: string;
    description: string;
    date: string;
}

export function generateExpenseData(overrides?: Partial<ExpenseData>): ExpenseData {
    const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Education', 'Other'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    return {
        amount: (Math.random() * 100 + 10).toFixed(2),
        category: randomCategory,
        description: `Test expense ${Date.now()}`,
        date: formattedDate,
        ...overrides,
    };
}

export function generateMultipleExpenses(count: number): ExpenseData[] {
    return Array.from({ length: count }, () => generateExpenseData());
}

export function generateExpenseForMonth(year: number, month: number): ExpenseData {
    const date = new Date(year, month - 1, Math.floor(Math.random() * 28) + 1);
    const formattedDate = date.toISOString().split('T')[0];

    return generateExpenseData({ date: formattedDate });
}

export function getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
