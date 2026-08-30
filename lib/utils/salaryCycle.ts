// Salary cycle utilities
//
// Payday rule: the working day immediately before the last working day of the month.
// Weekends are skipped when walking backwards.
// A salary cycle spans [payday of month M, payday of month M+1).

import { Expense } from '../types';
import {
    addDays,
    endOfMonth,
    format,
    isWeekend,
    parse,
    startOfDay,
    subDays,
} from 'date-fns';

export interface SalaryCycleOption {
    value: string; // 'cycle:YYYY-MM' - keyed by the month the payday falls in
    label: string; // e.g. '27 Jan - 25 Feb'
    start: Date;
    end: Date; // inclusive
}

export const SALARY_CYCLE_PREFIX = 'cycle:';

const previousWorkingDay = (date: Date): Date => {
    let cursor = subDays(startOfDay(date), 1);
    while (isWeekend(cursor)) {
        cursor = subDays(cursor, 1);
    }
    return cursor;
};

const lastWorkingDayOfMonth = (year: number, month: number): Date => {
    let cursor = startOfDay(endOfMonth(new Date(year, month, 1)));
    while (isWeekend(cursor)) {
        cursor = subDays(cursor, 1);
    }
    return cursor;
};

/** Payday: the working day before the last working day of the given month. */
export function getPayday(year: number, month: number): Date {
    return previousWorkingDay(lastWorkingDayOfMonth(year, month));
}

/** Cycle keyed by the month its payday falls in. */
export function getCycleByKeyMonth(year: number, month: number): SalaryCycleOption {
    const start = getPayday(year, month);
    const nextPayday = getPayday(year, month + 1);
    const end = subDays(nextPayday, 1);

    return {
        value: `${SALARY_CYCLE_PREFIX}${format(start, 'yyyy-MM')}`,
        label: `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`,
        start,
        end,
    };
}

/** The cycle containing the given date. */
export function getCycleForDate(date: Date): SalaryCycleOption {
    const day = startOfDay(date);
    const currentMonthPayday = getPayday(day.getFullYear(), day.getMonth());

    return day >= currentMonthPayday
        ? getCycleByKeyMonth(day.getFullYear(), day.getMonth())
        : getCycleByKeyMonth(day.getFullYear(), day.getMonth() - 1);
}

export function getCurrentCycle(): SalaryCycleOption {
    return getCycleForDate(new Date());
}

export function isSalaryCyclePreset(preset: string): boolean {
    return new RegExp(`^${SALARY_CYCLE_PREFIX}\\d{4}-\\d{2}$`).test(preset);
}

export function parseSalaryCyclePreset(preset: string): SalaryCycleOption | null {
    if (!isSalaryCyclePreset(preset)) return null;
    const keyMonth = parse(preset.slice(SALARY_CYCLE_PREFIX.length), 'yyyy-MM', new Date());
    return getCycleByKeyMonth(keyMonth.getFullYear(), keyMonth.getMonth());
}

export function filterExpensesBySalaryCycle(
    expenses: Expense[],
    cycle: SalaryCycleOption
): Expense[] {
    const endExclusive = addDays(cycle.end, 1);
    return expenses.filter((expense) => {
        const date = startOfDay(new Date(expense.date));
        return date >= cycle.start && date < endExclusive;
    });
}

/** Cycles covering every expense, plus the current one. Most recent first. */
export function getAvailableSalaryCycles(expenses: Expense[]): SalaryCycleOption[] {
    const cycles = new Map<string, SalaryCycleOption>();

    const current = getCurrentCycle();
    cycles.set(current.value, current);

    expenses.forEach((expense) => {
        const cycle = getCycleForDate(new Date(expense.date));
        cycles.set(cycle.value, cycle);
    });

    return Array.from(cycles.values()).sort(
        (a, b) => b.start.getTime() - a.start.getTime()
    );
}
