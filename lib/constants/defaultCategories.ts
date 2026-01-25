// Default categories configuration

import { CustomCategory } from '../types';

export const DEFAULT_INCOME_CATEGORIES: CustomCategory[] = [
    {
        id: 'salary',
        name: 'Salary',
        color: 'hsl(140, 60%, 45%)',
        icon: '💰',
        isDefault: true,
        type: 'income',
    },
    {
        id: 'freelance',
        name: 'Freelance',
        color: 'hsl(180, 60%, 45%)',
        icon: '💻',
        isDefault: true,
        type: 'income',
    },
    {
        id: 'investments',
        name: 'Investments',
        color: 'hsl(210, 60%, 50%)',
        icon: '📈',
        isDefault: true,
        type: 'income',
    },
    {
        id: 'gift',
        name: 'Gift',
        color: 'hsl(300, 60%, 60%)',
        icon: '🎁',
        isDefault: true,
        type: 'income',
    },
    {
        id: 'income_other',
        name: 'Other',
        color: 'hsl(0, 0%, 50%)',
        icon: '📦',
        isDefault: true,
        type: 'income',
    },
];

export const DEFAULT_CATEGORIES: CustomCategory[] = [
    {
        id: 'food',
        name: 'Food',
        color: 'hsl(25, 85%, 55%)',
        icon: '🍔',
        isDefault: true,
        type: 'expense',
    },
    {
        id: 'transport',
        name: 'Transport',
        color: 'hsl(200, 85%, 55%)',
        icon: '🚗',
        isDefault: true,
        type: 'expense',
    },
    {
        id: 'entertainment',
        name: 'Entertainment',
        color: 'hsl(280, 85%, 60%)',
        icon: '🎬',
        isDefault: true,
        type: 'expense',
    },
    {
        id: 'bills',
        name: 'Bills',
        color: 'hsl(0, 70%, 55%)',
        icon: '📄',
        isDefault: true,
        type: 'expense',
    },
    {
        id: 'shopping',
        name: 'Shopping',
        color: 'hsl(340, 85%, 60%)',
        icon: '🛍️',
        isDefault: true,
        type: 'expense',
    },
    {
        id: 'health',
        name: 'Health',
        color: 'hsl(140, 70%, 50%)',
        icon: '⚕️',
        isDefault: true,
        type: 'expense',
    },
    {
        id: 'education',
        name: 'Education',
        color: 'hsl(45, 85%, 55%)',
        icon: '📚',
        isDefault: true,
        type: 'expense',
    },
    {
        id: 'other',
        name: 'Other',
        color: 'hsl(0, 0%, 50%)',
        icon: '📦',
        isDefault: true,
        type: 'expense',
    },
    ...DEFAULT_INCOME_CATEGORIES
];
