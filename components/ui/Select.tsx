// Reusable Select Component

import React from 'react';

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
        <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label htmlFor={selectId} className="text-sm font-semibold text-base-content mb-1">
                    {label}
                </label>
            )}
            <select
                id={selectId}
                className={`
                    select select-bordered w-full transition-all text-base
                    ${error ? 'select-error' : ''} 
                    ${className}
                `}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-error text-sm mt-1">{error}</span>}
        </div>
    );
}
