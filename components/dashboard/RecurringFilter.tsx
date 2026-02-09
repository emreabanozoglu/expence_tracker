'use client';

import React from 'react';
import styles from './RecurringFilter.module.css';
import { Repeat } from 'lucide-react';
import { TouchButton } from '../ui/TouchButton';

export type RecurringFilterType = 'all' | 'recurring' | 'non-recurring';

interface RecurringFilterProps {
    selected: RecurringFilterType;
    onSelect: (type: RecurringFilterType) => void;
}

export default function RecurringFilter({ selected, onSelect }: RecurringFilterProps) {
    const filters: { value: RecurringFilterType; label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'non-recurring', label: 'One-time' },
        { value: 'recurring', label: 'Recurring' },
    ];

    return (
        <div className={styles.filterWrapper}>
            <Repeat size={20} className={styles.icon} />
            <div className={styles.buttonContainer}>
                {filters.map((option) => (
                    <TouchButton
                        key={option.value}
                        className={`${styles.button} ${selected === option.value ? styles.active : ''}`}
                        onTap={() => onSelect(option.value)}
                    >
                        {option.label}
                    </TouchButton>
                ))}
            </div>
        </div>
    );
}
