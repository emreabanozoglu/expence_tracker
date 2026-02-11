// Reusable Card Component

import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
    const classes = [
        'bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-base-content/5',
        hoverable ? 'hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200' : '',
        onClick ? 'cursor-pointer active:scale-[0.98] touch-manipulation' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
}
