// ThemeToggle Component - Toggle between light and dark mode

'use client';

import React from 'react';
import { useTheme } from '@/lib/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const { theme, toggleTheme, mounted } = useTheme();

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <button className={styles.toggle} aria-label="Toggle theme">
                <div className={styles.iconWrapper}>
                    <Sun size={20} />
                </div>
            </button>
        );
    }

    return (
        <button
            className={styles.toggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <div className={styles.iconWrapper}>
                {theme === 'light' ? (
                    <Moon size={20} className={styles.icon} />
                ) : (
                    <Sun size={20} className={styles.icon} />
                )}
            </div>
        </button>
    );
}
