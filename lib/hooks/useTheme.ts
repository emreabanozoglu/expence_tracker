// useTheme hook - Manage theme state via Context
'use client';

import { useThemeContext, Theme } from '@/lib/context/ThemeContext';

export type { Theme };

export function useTheme() {
    return useThemeContext();
}
