// useSettings hook - Manage app settings with Supabase persistence

'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppSettings, CustomCategory } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/defaultCategories';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

const DEFAULT_SETTINGS: AppSettings = {
    currency: 'USD',
    currencySymbol: '$',
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
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error) {
                // If no settings exist, create default settings
                if (error.code === 'PGRST116') {
                    const { data: newSettings, error: insertError } = await supabase
                        .from('user_settings')
                        .insert({
                            user_id: user.id,
                            currency_code: 'USD',
                            currency_symbol: '$',
                            categories: DEFAULT_CATEGORIES,
                        })
                        .select()
                        .single();

                    if (insertError) throw insertError;

                    setSettings({
                        currency: newSettings.currency_code,
                        currencySymbol: newSettings.currency_symbol,
                        categories: newSettings.categories as CustomCategory[],
                    });
                } else {
                    throw error;
                }
            } else {
                setSettings({
                    currency: data.currency_code,
                    currencySymbol: data.currency_symbol,
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
                const { error } = await supabase
                    .from('user_settings')
                    .update({
                        currency_code: newSettings.currency,
                        currency_symbol: newSettings.currencySymbol,
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
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategories,
    };
}
