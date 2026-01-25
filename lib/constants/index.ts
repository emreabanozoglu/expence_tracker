// Application constants

import { Category } from '../types';

export const CATEGORIES: Category[] = [
    'Food',
    'Transport',
    'Entertainment',
    'Bills',
    'Shopping',
    'Health',
    'Education',
    'Other',
    'Salary',
    'Freelance',
    'Investments',
    'Gift',
];

export const CATEGORY_COLORS: Record<Category, string> = {
    Food: 'hsl(25, 85%, 55%)',
    Transport: 'hsl(200, 85%, 55%)',
    Entertainment: 'hsl(280, 85%, 60%)',
    Bills: 'hsl(0, 70%, 55%)',
    Shopping: 'hsl(340, 85%, 60%)',
    Health: 'hsl(140, 70%, 50%)',
    Education: 'hsl(45, 85%, 55%)',
    Other: 'hsl(0, 0%, 50%)',
    Salary: 'hsl(140, 60%, 45%)',
    Freelance: 'hsl(180, 60%, 45%)',
    Investments: 'hsl(210, 60%, 50%)',
    Gift: 'hsl(300, 60%, 60%)',
};

export const CATEGORY_ICONS: Record<Category, string> = {
    Food: '🍔',
    Transport: '🚗',
    Entertainment: '🎬',
    Bills: '📄',
    Shopping: '🛍️',
    Health: '⚕️',
    Education: '📚',
    Other: '📦',
    Salary: '💰',
    Freelance: '💻',
    Investments: '📈',
    Gift: '🎁',
};

export const STORAGE_KEY = 'expense-tracker-data';
export const THEME_STORAGE_KEY = 'expense-tracker-theme';
export const APP_VERSION = '1.0';
