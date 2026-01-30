// useSettings hook - Manage app settings with Supabase persistence

'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppSettings, CustomCategory } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/defaultCategories';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

import { getCurrencyByCode } from '../utils/currency';

const DEFAULT_SETTINGS: AppSettings = {
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'MM/dd/yyyy',
    categories: DEFAULT_CATEGORIES,
};

export function useSettings() {
    const { user } = useAuth();
    const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings from Supabase
    const loadSettings = useCallback(async () => {
        if (!user) {
            setSettings(DEFAULT_SETTINGS);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await (supabase
                .from('user_settings') as any)
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                // If no settings exist, create default settings
                if (error.code === 'PGRST116') {
                    // Check if user has currency in metadata (from registration)
                    const metaCurrency = user.user_metadata?.currency;
                    const currencyCode = metaCurrency || 'USD';
                    let currencySymbol = '$';

                    // improved simple symbol lookup if not USD
                    if (currencyCode !== 'USD') {
                        try {
                            const c = getCurrencyByCode(currencyCode);
                            if (c) currencySymbol = c.symbol;
                        } catch (e) {
                            console.error('Error getting currency symbol', e);
                        }
                    }

                    const insertPayload = {
                        user_id: user.id,
                        currency_code: currencyCode,
                        currency_symbol: currencySymbol,
                        date_format: 'MM/dd/yyyy',
                        categories: DEFAULT_CATEGORIES,
                    };

                    const { data: newSettings, error: insertError } = await (supabase
                        .from('user_settings') as any)
                        .insert(insertPayload)
                        .select()
                        .single();

                    if (insertError) throw insertError;

                    setSettings({
                        currency: newSettings.currency_code,
                        currencySymbol: newSettings.currency_symbol,
                        dateFormat: newSettings.date_format || 'MM/dd/yyyy',
                        categories: newSettings.categories as CustomCategory[],
                    });
                } else {
                    console.error('Fetch error (not PGRST116):', error);
                    throw error;
                }
            } else {
                let finalCurrency = data.currency_code;
                let finalSymbol = data.currency_symbol;

                // Fix for race condition/trigger: If settings exist but are default USD, 
                // and user has different metadata currency, and account is new (< 5 mins), update it.
                if (data.currency_code === 'USD' && user.user_metadata?.currency) {
                    const metaCurrency = user.user_metadata.currency;

                    if (metaCurrency !== 'USD') {
                        // Check if row is recent (created within last 5 minutes)
                        const createdAt = data.created_at ? new Date(data.created_at).getTime() : Date.now();
                        const isRecent = (Date.now() - createdAt) < 5 * 60 * 1000; // 5 mins

                        if (isRecent) {
                            try {
                                const c = getCurrencyByCode(metaCurrency);
                                const newSymbol = c ? c.symbol : '$';

                                // Update database
                                await (supabase
                                    .from('user_settings') as any)
                                    .update({
                                        currency_code: metaCurrency,
                                        currency_symbol: newSymbol
                                    })
                                    .eq('user_id', user.id);

                                finalCurrency = metaCurrency;
                                finalSymbol = newSymbol;
                            } catch (updateError) {
                                console.error('Failed to auto-correct currency:', updateError);
                            }
                        }
                    }
                }

                setSettings({
                    currency: finalCurrency,
                    currencySymbol: finalSymbol,
                    dateFormat: data.date_format || 'MM/dd/yyyy',
                    expenseTarget: data.expense_target,
                    savingTarget: data.saving_target,
                    categories: (data.categories && Array.isArray(data.categories) && data.categories.length > 0)
                        ? (data.categories as CustomCategory[])
                        : DEFAULT_CATEGORIES,
                });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            setSettings(DEFAULT_SETTINGS);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const saveSettings = useCallback(
        async (newSettings: AppSettings) => {
            if (!user) return;

            try {
                const { error } = await (supabase
                    .from('user_settings') as any)
                    .update({
                        currency_code: newSettings.currency,
                        currency_symbol: newSettings.currencySymbol,
                        expense_target: newSettings.expenseTarget,
                        saving_target: newSettings.savingTarget,
                        date_format: newSettings.dateFormat,
                        categories: newSettings.categories,
                    })
                    .eq('user_id', user.id);

                if (error) throw error;

                setSettings(newSettings);
            } catch (error) {
                console.error('Failed to save settings:', error);
            }
        },
        [user]
    );

    const updateBudgetTargets = useCallback(
        (expenseTarget: number | undefined, savingTarget: number | undefined) => {
            const newSettings = {
                ...settings,
                expenseTarget,
                savingTarget,
            };
            saveSettings(newSettings);
        },
        [settings, saveSettings]
    );

    const updateCurrency = useCallback(
        (currencyCode: string, currencySymbol: string) => {
            const newSettings = {
                ...settings,
                currency: currencyCode,
                currencySymbol,
            };
            saveSettings(newSettings);
        },
        [settings, saveSettings]
    );

    const updateDateFormat = useCallback(
        (dateFormat: string) => {
            const newSettings = {
                ...settings,
                dateFormat,
            };
            saveSettings(newSettings);
        },
        [settings, saveSettings]
    );

    const addCategory = useCallback(
        (category: Omit<CustomCategory, 'id'>) => {
            const newCategory: CustomCategory = {
                ...category,
                id: `custom-${Date.now()}`,
            };
            const newSettings = {
                ...settings,
                categories: [...settings.categories, newCategory],
            };
            saveSettings(newSettings);
        },
        [settings, saveSettings]
    );

    const updateCategory = useCallback(
        (id: string, updates: Partial<CustomCategory>) => {
            const newSettings = {
                ...settings,
                categories: settings.categories.map((cat) =>
                    cat.id === id ? { ...cat, ...updates } : cat
                ),
            };
            saveSettings(newSettings);
        },
        [settings, saveSettings]
    );

    const deleteCategory = useCallback(
        (id: string) => {
            const newSettings = {
                ...settings,
                categories: settings.categories.filter((cat) => cat.id !== id),
            };
            saveSettings(newSettings);
        },
        [settings, saveSettings]
    );

    const resetCategories = useCallback(() => {
        const newSettings = {
            ...settings,
            categories: DEFAULT_CATEGORIES,
        };
        saveSettings(newSettings);
    }, [settings, saveSettings]);

    return {
        settings,
        isLoading,
        updateCurrency,
        updateDateFormat,
        updateBudgetTargets,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategories,
    };
}
