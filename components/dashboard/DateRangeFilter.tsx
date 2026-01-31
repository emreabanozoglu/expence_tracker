// Date Range Filter Component with Month Dropdown

'use client';

import React, { useMemo, useState } from 'react';
import { DateRangePreset } from '@/lib/types';
import { Expense } from '@/lib/types';
import { getAvailableMonths } from '@/lib/utils/monthFilters';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './DateRangeFilter.module.css';

export interface DateRangeFilterProps {
    selected: DateRangePreset;
    onSelect: (preset: DateRangePreset) => void;
    expenses: Expense[];
}

export default function DateRangeFilter({ selected, onSelect, expenses }: DateRangeFilterProps) {
    const [isExpanded, setIsExpanded] = useState(false);
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

    // Get the label for the currently selected filter
    const getSelectedLabel = () => {
        if (selectedMonth) return selectedMonth.label;
        const quickFilter = quickFilters.find((f) => f.value === selected);
        return quickFilter?.label || 'All Time';
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`${styles.filter} ${isExpanded ? styles.expanded : styles.collapsed}`}>
            {/* Collapsed Header - Always Visible */}
            <div className={styles.filterHeader} onClick={toggleExpanded}>
                <div className={styles.headerLeft}>
                    <Calendar size={20} className={styles.icon} />
                    <span className={styles.selectedLabel}>{getSelectedLabel()}</span>
                </div>
                <button className={styles.toggleButton} aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {/* Filter Content (Date Controls) - Hidden when collapsed on mobile */}
            <div className={styles.filterContent}>
                <Calendar size={20} className={styles.icon} />
                <div className={styles.buttons}>
                    {quickFilters.map((option) => (
                        <button
                            key={option.value}
                            className={`${styles.button} ${selected === option.value ? styles.active : ''}`}
                            onClick={() => {
                                onSelect(option.value);
                                setIsExpanded(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {availableMonths.length > 0 && (
                    <div className={styles.dropdown}>
                        <select
                            className={styles.select}
                            value={isMonthSelected ? selected : ''}
                            onChange={(e) => {
                                if (e.target.value) {
                                    onSelect(e.target.value);
                                    setIsExpanded(false);
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
        </div>
    );
}
