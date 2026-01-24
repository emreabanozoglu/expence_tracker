// localStorage utility functions

import { Expense } from '../types';
import { STORAGE_KEY, APP_VERSION } from '../constants';

interface StorageData {
    expenses: Expense[];
    version: string;
}

export function loadExpenses(): Expense[] {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];

        const parsed: StorageData = JSON.parse(data);

        // Version check for future migrations
        if (parsed.version !== APP_VERSION) {
            console.warn('Storage version mismatch, using data as-is');
        }

        return parsed.expenses || [];
    } catch (error) {
        console.error('Failed to load expenses:', error);
        return [];
    }
}

export function saveExpenses(expenses: Expense[]): boolean {
    if (typeof window === 'undefined') return false;

    try {
        const data: StorageData = {
            expenses,
            version: APP_VERSION,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded');
            alert('Storage quota exceeded. Please export and delete old expenses.');
        } else {
            console.error('Failed to save expenses:', error);
        }
        return false;
    }
}

export function clearExpenses(): boolean {
    if (typeof window === 'undefined') return false;

    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Failed to clear expenses:', error);
        return false;
    }
}
