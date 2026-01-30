'use client';

import React from 'react';
import styles from './TypeFilter.module.css';

interface TypeFilterProps {
    selected: 'all' | 'expense' | 'income';
    onSelect: (type: 'all' | 'expense' | 'income') => void;
}

export default function TypeFilter({ selected, onSelect }: TypeFilterProps) {
    return (
        <div className={styles.filter}>
            <button
                className={`${styles.button} ${selected === 'all' ? styles.active : ''}`}
                onClick={() => onSelect('all')}
            >
                All
            </button>
            <button
                className={`${styles.button} ${selected === 'expense' ? styles.active : ''}`}
                onClick={() => onSelect('expense')}
            >
                Expense
            </button>
            <button
                className={`${styles.button} ${selected === 'income' ? styles.active : ''}`}
                onClick={() => onSelect('income')}
            >
                Income
            </button>
        </div>
    );
}
