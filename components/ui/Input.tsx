// Reusable Input Component

import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export default function Input({
    label,
    error,
    fullWidth = false,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`${styles.inputWrapper} ${fullWidth ? styles.fullWidth : ''}`}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`${styles.input} ${error ? styles.error : ''} ${className}`}
                {...props}
            />
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
}
