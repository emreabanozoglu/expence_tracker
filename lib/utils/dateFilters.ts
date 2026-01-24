// Date filtering utility functions

import { Expense, DateRangePreset } from '../types';
import { startOfMonth, endOfMonth, subMonths, parse, isSameMonth } from 'date-fns';

export function filterExpensesByDateRange(
    expenses: Expense[],
    preset: DateRangePreset
): Expense[] {
    if (preset === 'all') {
        return expenses;
    }

    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    if (preset === 'thisMonth') {
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
    } else if (preset === 'lastMonth') {
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
    } else if (/^\d{4}-\d{2}$/.test(preset)) {
        // Handle specific month format (YYYY-MM)
        const targetDate = parse(preset, 'yyyy-MM', new Date());
        return expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return isSameMonth(expenseDate, targetDate);
        });
    } else {
        return expenses;
    }

    return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
    });
}
