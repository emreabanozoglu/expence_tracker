// Default categories configuration

import { CustomCategory } from '../types';

export const DEFAULT_CATEGORIES: CustomCategory[] = [
    {
        id: 'food',
        name: 'Food',
        color: 'hsl(25, 85%, 55%)',
        icon: '🍔',
        isDefault: true,
    },
    {
        id: 'transport',
        name: 'Transport',
        color: 'hsl(200, 85%, 55%)',
        icon: '🚗',
        isDefault: true,
    },
    {
        id: 'entertainment',
        name: 'Entertainment',
        color: 'hsl(280, 85%, 60%)',
        icon: '🎬',
        isDefault: true,
    },
    {
        id: 'bills',
        name: 'Bills',
        color: 'hsl(0, 70%, 55%)',
        icon: '📄',
        isDefault: true,
    },
    {
        id: 'shopping',
        name: 'Shopping',
        color: 'hsl(340, 85%, 60%)',
        icon: '🛍️',
        isDefault: true,
    },
    {
        id: 'health',
        name: 'Health',
        color: 'hsl(140, 70%, 50%)',
        icon: '⚕️',
        isDefault: true,
    },
    {
        id: 'education',
        name: 'Education',
        color: 'hsl(45, 85%, 55%)',
        icon: '📚',
        isDefault: true,
    },
    {
        id: 'other',
        name: 'Other',
        color: 'hsl(0, 0%, 50%)',
        icon: '📦',
        isDefault: true,
    },
];
