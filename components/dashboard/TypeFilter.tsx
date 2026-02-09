'use client';

import React from 'react';
import styles from './TypeFilter.module.css';
import { Filter } from 'lucide-react';
import { TouchButton } from '../ui/TouchButton';

interface TypeFilterProps {
    selected: 'all' | 'expense' | 'income';
    onSelect: (type: 'all' | 'expense' | 'income') => void;
}

export default function TypeFilter({ selected, onSelect }: TypeFilterProps) {
    const filters: { value: 'all' | 'expense' | 'income'; label: string }[] = [
        { value: 'all', label: 'All' },
        { value: 'expense', label: 'Expense' },
        { value: 'income', label: 'Income' },
    ];

    return (
        <div className={styles.filterWrapper}>
            <Filter size={20} className={styles.icon} />
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
