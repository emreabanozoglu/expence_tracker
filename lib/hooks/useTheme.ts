// useTheme hook - Manage theme state with localStorage persistence

'use client';

import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Get theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';

        const initialTheme = savedTheme || systemTheme;
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return { theme, toggleTheme, mounted };
}
