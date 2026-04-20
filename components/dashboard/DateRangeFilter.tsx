// Date Range Filter Component with Month Dropdown

'use client';

import React, { useMemo } from 'react';
import { DateRangePreset } from '@/lib/types';
import { Expense } from '@/lib/types';
import { getAvailableMonths } from '@/lib/utils/monthFilters';
import { Calendar, ChevronDown } from 'lucide-react';
import { TouchButton } from '../ui/TouchButton';

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

    const isMonthSelected = /^\d{4}-\d{2}$/.test(selected);

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center gap-3 p-1 bg-[var(--card-bg)] rounded-2xl border border-base-content/5 shadow-sm w-full">
                <div className="w-10 h-10 rounded-xl bg-base-200/50 flex items-center justify-center text-base-content/70 hidden md:flex">
                    <Calendar size={18} />
                </div>
                <div className="flex bg-base-200/50 p-1 rounded-xl flex-1 h-10 w-full overflow-x-auto hide-scrollbar">
                    {quickFilters.map((option) => (
                        <TouchButton
                            key={option.value}
                            className={`
                                flex-1 px-3 min-w-max relative z-10 text-sm font-medium rounded-lg transition-all duration-200 border-none cursor-pointer flex items-center justify-center
                                ${selected === option.value
                                    ? 'bg-primary text-primary-content shadow-sm'
                                    : 'text-base-content/60 hover:bg-base-300/50 hover:text-base-content'
                                }
                            `}
                            onTap={() => onSelect(option.value)}
                        >
                            {option.label}
                        </TouchButton>
                    ))}
                </div>
            </div>

            {availableMonths.length > 0 && (
                <div className="relative w-full">
                    <select
                        className={`
                            w-full h-[48px] md:h-[48px] pl-4 pr-10 text-sm font-medium rounded-2xl bg-[var(--card-bg)] appearance-none cursor-pointer transition-all
                            focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm
                            ${isMonthSelected ? 'text-primary font-bold bg-primary/5 border border-primary/30' : 'text-base-content/80 border border-base-content/10 hover:bg-base-200/50'}
                        `}
                        value={isMonthSelected ? selected : ''}
                        onChange={(e) => {
                            if (e.target.value) {
                                onSelect(e.target.value);
                            }
                        }}
                    >
                        <option value="">Select Month...</option>
                        {availableMonths.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isMonthSelected ? 'text-primary' : 'text-base-content/50'}`} />
                </div>
            )}
        </div>
    );
}
