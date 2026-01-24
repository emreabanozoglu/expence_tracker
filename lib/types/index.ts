// Core type definitions for the Expense Tracker application

export type Category =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Bills'
  | 'Shopping'
  | 'Health'
  | 'Education'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO 8601 format
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: Category;
  description: string;
  date: string;
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

export type DateRangePreset = 'all' | 'thisMonth' | 'lastMonth' | string; // string format: 'YYYY-MM' for specific months

export interface MonthOption {
  value: string; // 'YYYY-MM' format
  label: string; // 'January 2026' format
  year: number;
  month: number;
}

export interface FilterOptions {
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
}

export interface AppSettings {
  currency: string;
  currencySymbol: string;
  categories: CustomCategory[];
}
