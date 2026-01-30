// Settings Context - Provide settings throughout the app

'use client';

import React, { createContext, useContext } from 'react';
import { useSettings } from '../hooks/useSettings';
import { AppSettings, CustomCategory } from '../types';

interface SettingsContextType {
    settings: AppSettings;
    isLoading: boolean;
    updateCurrency: (currencyCode: string, currencySymbol: string) => void;
    updateDateFormat: (dateFormat: string) => void;
    updateBudgetTargets: (expense: number | undefined, saving: number | undefined) => void;
    addCategory: (category: Omit<CustomCategory, 'id'>) => void;
    updateCategory: (id: string, updates: Partial<CustomCategory>) => void;
    deleteCategory: (id: string) => void;
    resetCategories: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const settingsHook = useSettings();

    return (
        <SettingsContext.Provider value={settingsHook}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettingsContext() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettingsContext must be used within a SettingsProvider');
    }
    return context;
}
