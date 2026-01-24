// Calculation utilities for expense analytics

import { Expense, CategoryTotal, Category } from '../types';
import { CATEGORIES } from '../constants';

export function calculateTotalSpending(expenses: Expense[]): number {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

export function calculateCategoryTotals(expenses: Expense[]): CategoryTotal[] {
    const totalSpending = calculateTotalSpending(expenses);

    const categoryMap = new Map<Category, { total: number; count: number }>();

    // Initialize all categories
    CATEGORIES.forEach(category => {
        categoryMap.set(category, { total: 0, count: 0 });
    });

    // Calculate totals
    expenses.forEach(expense => {
        const current = categoryMap.get(expense.category);
        if (current) {
            current.total += expense.amount;
            current.count += 1;
        }
    });

    // Convert to array with percentages
    const result: CategoryTotal[] = [];
    categoryMap.forEach((value, category) => {
        result.push({
            category,
            total: value.total,
            count: value.count,
            percentage: totalSpending > 0 ? (value.total / totalSpending) * 100 : 0,
        });
    });

    // Sort by total (descending)
    return result.sort((a, b) => b.total - a.total);
}

export function calculateAverageExpense(expenses: Expense[]): number {
    if (expenses.length === 0) return 0;
    return calculateTotalSpending(expenses) / expenses.length;
}

export function getTopCategory(expenses: Expense[]): Category | null {
    if (expenses.length === 0) return null;

    const totals = calculateCategoryTotals(expenses);
    return totals[0]?.category || null;
}
