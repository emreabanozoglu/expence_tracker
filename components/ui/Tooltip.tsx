import React, { useState } from 'react';
import styles from './Tooltip.module.css';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className={styles.container}>
            <div className={styles.trigger}>
                {children}
            </div>
            <div className={styles.tooltip} role="tooltip">
                {content}
            </div>
        </div>
    );
}
