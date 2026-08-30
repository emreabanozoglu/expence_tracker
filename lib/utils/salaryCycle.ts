// Salary cycle utilities
//
// Payday is defined by a PaydayConfig stored on the user's salary recurring
// transaction; DEFAULT_PAYDAY_CONFIG applies when none is set.
// A salary cycle spans [payday of month M, payday of month M+1).

import { Expense, PaydayConfig, PaydayRule } from '../types';
import {
    addDays,
    differenceInCalendarDays,
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

/** Parse a stored date. 'YYYY-MM-DD' is treated as local, not UTC. */
export const parseDateKey = (value: string | Date): Date => {
    if (value instanceof Date) return startOfDay(value);
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) {
        return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }
    return startOfDay(new Date(value));
};

export const DEFAULT_PAYDAY_CONFIG: PaydayConfig = {
    rule: 'dayBeforeLastWorkingDay',
};

export const PAYDAY_RULE_LABELS: Record<PaydayRule, string> = {
    dayBeforeLastWorkingDay: 'Day before last working day',
    lastWorkingDay: 'Last working day',
    fixedDayOfMonth: 'Fixed day of month',
    exactDayNoShift: 'Exact day (no weekend shift)',
};

export const PAYDAY_RULE_NEEDS_DAY: PaydayRule[] = ['fixedDayOfMonth', 'exactDayNoShift'];

export function paydayRuleRequiresDay(rule: PaydayRule): boolean {
    return PAYDAY_RULE_NEEDS_DAY.includes(rule);
}

/** Human-readable summary, e.g. 'Fixed day of month (15th)'. */
export function describePaydayConfig(config: PaydayConfig): string {
    const label = PAYDAY_RULE_LABELS[config.rule];
    return paydayRuleRequiresDay(config.rule) && config.dayOfMonth
        ? `${label} (${config.dayOfMonth})`
        : label;
}

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

/** Clamp a day number to a month that may be shorter (e.g. 31 in February). */
const dayInMonth = (year: number, month: number, day: number): Date => {
    const lastDay = endOfMonth(new Date(year, month, 1)).getDate();
    return new Date(year, month, Math.min(day, lastDay));
};

/** Payday for the given month under the given rule. */
export function getPayday(
    year: number,
    month: number,
    config: PaydayConfig = DEFAULT_PAYDAY_CONFIG
): Date {
    // Normalize so callers may pass month = -1 or 12.
    const anchor = new Date(year, month, 1);
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    const day = config.dayOfMonth ?? 1;

    switch (config.rule) {
        case 'lastWorkingDay':
            return lastWorkingDayOfMonth(y, m);
        case 'fixedDayOfMonth': {
            const target = dayInMonth(y, m, day);
            // Shift backwards off a weekend.
            let cursor = target;
            while (isWeekend(cursor)) {
                cursor = subDays(cursor, 1);
            }
            return cursor;
        }
        case 'exactDayNoShift':
            return dayInMonth(y, m, day);
        case 'dayBeforeLastWorkingDay':
        default:
            return previousWorkingDay(lastWorkingDayOfMonth(y, m));
    }
}

/**
 * The first payday strictly after `after`. Used to schedule the next
 * generation of a salary recurring transaction.
 */
export function getNextPaydayAfter(
    after: Date,
    config: PaydayConfig = DEFAULT_PAYDAY_CONFIG
): Date {
    const day = startOfDay(after);

    // A rule can place this month's payday before or after `day`; check the
    // current month first, then walk forward. Two steps is always enough.
    for (let offset = 0; offset <= 2; offset++) {
        const candidate = getPayday(day.getFullYear(), day.getMonth() + offset, config);
        if (candidate > day) return candidate;
    }

    return getPayday(day.getFullYear(), day.getMonth() + 1, config);
}

/** Format a date as 'YYYY-MM-DD' in local time (never UTC-shifted). */
export function toDateKey(date: Date): string {
    return format(startOfDay(date), 'yyyy-MM-dd');
}

/** Cycle keyed by the month its payday falls in. */
export function getCycleByKeyMonth(
    year: number,
    month: number,
    config: PaydayConfig = DEFAULT_PAYDAY_CONFIG
): SalaryCycleOption {
    const start = getPayday(year, month, config);
    const nextPayday = getPayday(year, month + 1, config);
    const end = subDays(nextPayday, 1);

    return {
        value: `${SALARY_CYCLE_PREFIX}${format(start, 'yyyy-MM')}`,
        label: `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`,
        start,
        end,
    };
}

/** The cycle containing the given date. */
export function getCycleForDate(
    date: Date,
    config: PaydayConfig = DEFAULT_PAYDAY_CONFIG
): SalaryCycleOption {
    const day = startOfDay(date);
    const currentMonthPayday = getPayday(day.getFullYear(), day.getMonth(), config);

    return day >= currentMonthPayday
        ? getCycleByKeyMonth(day.getFullYear(), day.getMonth(), config)
        : getCycleByKeyMonth(day.getFullYear(), day.getMonth() - 1, config);
}

export function getCurrentCycle(
    config: PaydayConfig = DEFAULT_PAYDAY_CONFIG
): SalaryCycleOption {
    return getCycleForDate(new Date(), config);
}

export function isSalaryCyclePreset(preset: string): boolean {
    return new RegExp(`^${SALARY_CYCLE_PREFIX}\\d{4}-\\d{2}$`).test(preset);
}

export function parseSalaryCyclePreset(
    preset: string,
    config: PaydayConfig = DEFAULT_PAYDAY_CONFIG
): SalaryCycleOption | null {
    if (!isSalaryCyclePreset(preset)) return null;
    const keyMonth = parse(preset.slice(SALARY_CYCLE_PREFIX.length), 'yyyy-MM', new Date());
    return getCycleByKeyMonth(keyMonth.getFullYear(), keyMonth.getMonth(), config);
}

export function filterExpensesBySalaryCycle(
    expenses: Expense[],
    cycle: SalaryCycleOption
): Expense[] {
    const endExclusive = addDays(cycle.end, 1);
    return expenses.filter((expense) => {
        const date = parseDateKey(expense.date);
        return date >= cycle.start && date < endExclusive;
    });
}

export interface CycleProgress {
    dayIndex: number; // 0-based day within the cycle, clamped to its length
    lengthInDays: number;
    /** dayIndex normalized to 0..1 - comparable across cycles of different lengths. */
    elapsedRatio: number;
    isComplete: boolean;
}

export function getCycleLengthInDays(cycle: SalaryCycleOption): number {
    return differenceInCalendarDays(cycle.end, cycle.start) + 1;
}

/** Position of a date within a cycle, normalized so cycles of unequal length compare. */
export function getCycleProgress(
    cycle: SalaryCycleOption,
    date: Date = new Date()
): CycleProgress {
    const lengthInDays = getCycleLengthInDays(cycle);
    const rawIndex = differenceInCalendarDays(startOfDay(date), cycle.start);
    const dayIndex = Math.min(Math.max(rawIndex, 0), lengthInDays - 1);

    return {
        dayIndex,
        lengthInDays,
        elapsedRatio: lengthInDays <= 1 ? 1 : dayIndex / (lengthInDays - 1),
        isComplete: rawIndex >= lengthInDays - 1,
    };
}

/**
 * Total spend per normalized position in the cycle, for comparing cycles of
 * different lengths. Returns `buckets` cumulative points spanning the cycle.
 */
export function getNormalizedCycleSpend(
    expenses: Expense[],
    cycle: SalaryCycleOption,
    buckets = 30
): { ratio: number; cumulative: number }[] {
    const inCycle = filterExpensesBySalaryCycle(expenses, cycle).filter(
        (expense) => expense.type === 'expense'
    );
    const lengthInDays = getCycleLengthInDays(cycle);

    const dailyTotals = new Array<number>(lengthInDays).fill(0);
    inCycle.forEach((expense) => {
        const index = differenceInCalendarDays(parseDateKey(expense.date), cycle.start);
        if (index >= 0 && index < lengthInDays) {
            dailyTotals[index] += expense.amount;
        }
    });

    return Array.from({ length: buckets }, (_, bucket) => {
        const ratio = buckets === 1 ? 1 : bucket / (buckets - 1);
        const throughDay = Math.round(ratio * (lengthInDays - 1));
        const cumulative = dailyTotals
            .slice(0, throughDay + 1)
            .reduce((sum, amount) => sum + amount, 0);
        return { ratio, cumulative };
    });
}

/**
 * Spend rate per day, the length-independent way to compare cycle totals.
 * Only counts elapsed days so an in-progress cycle is not understated.
 */
export function getCycleDailyBurnRate(
    expenses: Expense[],
    cycle: SalaryCycleOption,
    asOf: Date = new Date()
): number {
    const total = filterExpensesBySalaryCycle(expenses, cycle)
        .filter((expense) => expense.type === 'expense')
        .reduce((sum, expense) => sum + expense.amount, 0);

    const { dayIndex, lengthInDays, isComplete } = getCycleProgress(cycle, asOf);
    const elapsedDays = isComplete ? lengthInDays : dayIndex + 1;

    return elapsedDays > 0 ? total / elapsedDays : 0;
}

/** Projected full-cycle spend from the rate so far. */
export function getProjectedCycleSpend(
    expenses: Expense[],
    cycle: SalaryCycleOption,
    asOf: Date = new Date()
): number {
    return getCycleDailyBurnRate(expenses, cycle, asOf) * getCycleLengthInDays(cycle);
}

/** Cycles covering every expense, plus the current one. Most recent first. */
export function getAvailableSalaryCycles(
    expenses: Expense[],
    config: PaydayConfig = DEFAULT_PAYDAY_CONFIG
): SalaryCycleOption[] {
    const cycles = new Map<string, SalaryCycleOption>();

    const current = getCurrentCycle(config);
    cycles.set(current.value, current);

    expenses.forEach((expense) => {
        const cycle = getCycleForDate(parseDateKey(expense.date), config);
        cycles.set(cycle.value, cycle);
    });

    return Array.from(cycles.values()).sort(
        (a, b) => b.start.getTime() - a.start.getTime()
    );
}
