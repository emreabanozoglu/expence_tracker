// Date Range Filter Component with Month Dropdown

'use client';

import React, { useMemo } from 'react';
import { DateRangePreset } from '@/lib/types';
import { Expense } from '@/lib/types';
import { getAvailableMonths } from '@/lib/utils/monthFilters';
import { Calendar, ChevronDown } from 'lucide-react';
import styles from './DateRangeFilter.module.css';

export interface DateRangeFilterProps {
    selected: DateRangePreset;
    onSelect: (preset: DateRangePreset) => void;
    expenses: Expense[];
}

export default function DateRangeFilter({ selected, onSelect, expenses }: DateRangeFilterProps) {
    const availableMonths = useMemo(() => getAvailableMonths(expenses), [expenses]);

    const quickFilters: { value: DateRangePreset; label: string }[] = [
        { value: 'all', label: 'All Time' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'lastMonth', label: 'Last Month' },
    ];

    // Check if selected is a specific month
    const isMonthSelected = /^\d{4}-\d{2}$/.test(selected);
    const selectedMonth = isMonthSelected
        ? availableMonths.find((m) => m.value === selected)
        : null;

    return (
        <div className={styles.filter}>
            <Calendar size={20} className={styles.icon} />

            <div className={styles.buttons}>
                {quickFilters.map((option) => (
                    <button
                        key={option.value}
                        className={`${styles.button} ${selected === option.value ? styles.active : ''}`}
                        onClick={() => onSelect(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {availableMonths.length > 0 && (
                <div className={styles.divider} />
            )}

            {availableMonths.length > 0 && (
                <div className={styles.dropdown}>
                    <select
                        className={styles.select}
                        value={isMonthSelected ? selected : ''}
                        onChange={(e) => {
                            if (e.target.value) {
                                onSelect(e.target.value);
                            }
                        }}
                    >
                        <option value="">Select Month</option>
                        {availableMonths.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className={styles.dropdownIcon} />
                </div>
            )}
        </div>
    );
}
