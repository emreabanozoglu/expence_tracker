// Core type definitions for the Expense Tracker application

export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Bills'
  | 'Shopping'
  | 'Health'
  | 'Education'
  | 'Other';

export type IncomeCategory =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Gift'
  | 'Other';

export type Category = ExpenseCategory | IncomeCategory;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO 8601 format
  createdAt: string;
  updatedAt: string;
  isRecurring?: boolean;
}

// Alias for backward compatibility during refactor, strictly deprecated
export type Expense = Transaction;

export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type PaydayRule =
  | 'dayBeforeLastWorkingDay'
  | 'lastWorkingDay'
  | 'fixedDayOfMonth'
  | 'exactDayNoShift';

/** Payday definition attached to a salary recurring transaction. */
export interface PaydayConfig {
  rule: PaydayRule;
  dayOfMonth?: number; // required by fixedDayOfMonth / exactDayNoShift
}

export interface ExpenseFormData {
  type: TransactionType;
  amount: string;
  category: Category;
  description: string;
  date: string;
  isRecurring: boolean;
  frequency: RecurrenceFrequency;
  isSalary?: boolean;
  paydayRule?: PaydayRule;
  paydayDayOfMonth?: number;
}

export interface CategoryTotal {
  category: Category;
  total: number;
  count: number;
  percentage: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

// 'YYYY-MM' for a calendar month, 'cycle:YYYY-MM' for a salary cycle
export type DateRangePreset = 'all' | 'thisMonth' | 'lastMonth' | 'currentCycle' | string;

export interface MonthOption {
  value: string; // 'YYYY-MM' format
  label: string; // 'January 2026' format
  year: number;
  month: number;
}

export interface FilterOptions {
  type?: TransactionType | 'all';
  category?: Category | 'all';
  dateRange: DateRangePreset;
  customRange?: DateRange;
  searchQuery?: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  type: TransactionType;
}

export interface AppSettings {
  currency: string;
  currencySymbol: string;
  expenseTarget?: number;
  savingTarget?: number;
  dateFormat: string;
  categories: CustomCategory[];
}
