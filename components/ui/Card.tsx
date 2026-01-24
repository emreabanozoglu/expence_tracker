// Reusable Card Component

import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    hoverable?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className = '', hoverable = false, onClick }: CardProps) {
    const classes = [
        styles.card,
        hoverable ? styles.hoverable : '',
        onClick ? styles.clickable : '',
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
