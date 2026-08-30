// Month filtering utility functions

import { Expense } from '../types';
import { format, parse, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { getCurrentCycle, parseSalaryCyclePreset } from './salaryCycle';

export interface MonthOption {
    value: string; // 'YYYY-MM' format
    label: string; // 'January 2026' format
    year: number;
    month: number;
}

/**
 * Get all unique months that have expenses
 * Returns sorted array of months (most recent first)
 */
export function getAvailableMonths(expenses: Expense[]): MonthOption[] {
    if (expenses.length === 0) return [];

    // Create a Set to store unique month strings
    const monthSet = new Set<string>();

    expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const monthKey = format(date, 'yyyy-MM'); // e.g., '2026-01'
        monthSet.add(monthKey);
    });

    // Convert to array and sort (most recent first)
    const sortedMonths = Array.from(monthSet).sort((a, b) => b.localeCompare(a));

    // Convert to MonthOption objects
    return sortedMonths.map((monthKey) => {
        const date = parse(monthKey, 'yyyy-MM', new Date());
        return {
            value: monthKey,
            label: format(date, 'MMMM yyyy'), // e.g., 'January 2026'
            year: date.getFullYear(),
            month: date.getMonth(),
        };
    });
}

/**
 * Filter expenses by a specific month
 */
export function filterExpensesByMonth(
    expenses: Expense[],
    monthKey: string
): Expense[] {
    const targetDate = parse(monthKey, 'yyyy-MM', new Date());

    return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return isSameMonth(expenseDate, targetDate);
    });
}

/**
 * Get the display label for a date range preset
 */
export function getDateRangeLabel(preset: string): string {
    if (preset === 'all') return 'All Time';
    if (preset === 'thisMonth') return 'This Month';
    if (preset === 'lastMonth') return 'Last Month';
    if (preset === 'currentCycle') return `Current Cycle · ${getCurrentCycle().label}`;

    const cycle = parseSalaryCyclePreset(preset);
    if (cycle) return cycle.label;

    // If it's a month key (YYYY-MM format), parse and format it
    if (/^\d{4}-\d{2}$/.test(preset)) {
        const date = parse(preset, 'yyyy-MM', new Date());
        return format(date, 'MMMM yyyy');
    }

    return preset;
}
