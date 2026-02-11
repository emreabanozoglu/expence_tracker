// Date Range Filter Component with Month Dropdown

'use client';

import React, { useMemo, useState } from 'react';
import { DateRangePreset } from '@/lib/types';
import { Expense } from '@/lib/types';
import { getAvailableMonths } from '@/lib/utils/monthFilters';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { TouchButton } from '../ui/TouchButton';

export interface DateRangeFilterProps {
    selected: DateRangePreset;
    onSelect: (preset: DateRangePreset) => void;
    expenses: Expense[];
}

export default function DateRangeFilter({ selected, onSelect, expenses }: DateRangeFilterProps) {
    // ... existing state and logic ...
    const [isExpanded, setIsExpanded] = useState(false);
    const availableMonths = useMemo(() => getAvailableMonths(expenses), [expenses]);

    const quickFilters: { value: DateRangePreset; label: string }[] = [
        { value: 'all', label: 'All Time' },
        { value: 'thisMonth', label: 'This Month' },
        { value: 'lastMonth', label: 'Last Month' },
    ];

    // ... existing helper functions ...
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
        <div className={`
            flex items-center gap-3 p-1 bg-[var(--card-bg)] rounded-2xl border border-base-content/5 w-full transition-all duration-300 shadow-sm
            ${isExpanded ? 'bg-[var(--card-bg)] shadow-xl ring-1 ring-base-content/5 z-50 absolute top-0 left-0 right-0' : 'relative'}
        `}>
            {/* Expanded Overlay Background (Mobile) */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[-1] md:hidden"
                    onClick={() => setIsExpanded(false)}
                />
            )}

            <TouchButton
                className="w-10 h-10 rounded-xl bg-base-200/50 flex items-center justify-center text-base-content/70 cursor-pointer md:cursor-default border-none p-0 bg-opacity-50"
                onTap={toggleExpanded}
            >
                <Calendar size={18} />
            </TouchButton>

            {/* Desktop & Expanded Mobile View */}
            <div className={`
                flex-1 gap-2
                ${isExpanded
                    ? 'flex flex-col items-stretch absolute top-full left-0 right-0 mt-2 p-3 bg-[var(--card-bg)] rounded-2xl border border-base-content/10 shadow-xl z-40'
                    : 'hidden'
                }
                md:flex md:flex-row md:items-center md:static md:p-0 md:bg-transparent md:border-none md:shadow-none md:mt-0 md:z-auto
            `}>
                <div className="flex bg-base-200/50 p-1 rounded-xl flex-1 relative h-10">
                    {quickFilters.map((option) => (
                        <TouchButton
                            key={option.value}
                            className={`
                                flex-1 relative z-10 text-sm font-medium rounded-lg transition-all duration-200 px-3 whitespace-nowrap border-none cursor-pointer flex items-center justify-center
                                ${selected === option.value
                                    ? 'bg-primary text-primary-content shadow-sm'
                                    : 'text-base-content/60 hover:bg-base-300/50 hover:text-base-content'
                                }
                            `}
                            onTap={() => {
                                onSelect(option.value);
                                setIsExpanded(false);
                            }}
                        >
                            {option.label}
                        </TouchButton>
                    ))}
                </div>

                {availableMonths.length > 0 && (
                    <div className="relative w-full md:w-48">
                        <select
                            className={`
                                w-full h-10 pl-4 pr-10 text-sm font-medium rounded-xl bg-base-200 appearance-none cursor-pointer transition-all
                                focus:outline-none focus:ring-2 focus:ring-primary/20
                                ${isMonthSelected ? 'text-primary font-bold bg-primary/10 border border-primary/20' : 'text-base-content/70 border border-transparent hover:bg-base-300/50'}
                            `}
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
                        <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isMonthSelected ? 'text-primary' : 'text-base-content/50'}`} />
                    </div>
                )}
            </div>

            {/* Mobile Header Label (Collapsed) */}
            <TouchButton
                className="md:hidden flex-1 flex items-center justify-between px-2 cursor-pointer bg-transparent border-none text-left"
                onTap={toggleExpanded}
            >
                <span className="font-semibold text-sm text-base-content">{getSelectedLabel()}</span>
                {isExpanded ? <ChevronUp size={16} className="text-base-content/50" /> : <ChevronDown size={16} className="text-base-content/50" />}
            </TouchButton>
        </div>
    );
}
