// Reusable Input Component

import React from 'react';

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
        <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
            {label && (
                <label htmlFor={inputId} className="text-sm font-semibold text-base-content mb-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
                    input input-bordered w-full transition-all
                    ${error ? 'input-error' : ''} 
                    ${className}
                `}
                {...props}
            />
            {error && <span className="text-error text-sm mt-1">{error}</span>}
        </div>
    );
}
