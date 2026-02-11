// ThemeToggle Component - Toggle between light and dark mode

'use client';

import React from 'react';
import { useTheme } from '@/lib/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme();

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <button className="btn btn-ghost btn-circle" aria-label="Toggle theme">
                <div className="flex items-center justify-center">
                    <Sun size={20} />
                </div>
            </button>
        );
    }

    return (
        <button
            className="btn btn-ghost btn-circle transition-all duration-300 hover:scale-105"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className="flex items-center justify-center transition-transform duration-300">
                {theme === 'light' ? (
                    <Moon size={20} className="animate-[rotateIn_0.3s_ease-out]" />
                ) : (
                    <Sun size={20} className="animate-[rotateIn_0.3s_ease-out]" />
                )}
            </div>
        </button>
    );
}
