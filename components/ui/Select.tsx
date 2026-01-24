// Reusable Select Component

import React from 'react';
import styles from './Select.module.css';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
    fullWidth?: boolean;
}

export default function Select({
    label,
    error,
    options,
    fullWidth = false,
    className = '',
    id,
    ...props
}: SelectProps) {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`${styles.selectWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`${styles.select} ${error ? styles.error : ''} ${className}`}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}
