// Date Range Filter Component - Salary Cycle & Calendar Month modes

'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { DateRangePreset, PaydayConfig } from '@/lib/types';
import { Expense } from '@/lib/types';
import { getAvailableMonths } from '@/lib/utils/monthFilters';
import {
    DEFAULT_PAYDAY_CONFIG,
    describePaydayConfig,
    getAvailableSalaryCycles,
    getCurrentCycle,
    isSalaryCyclePreset,
} from '@/lib/utils/salaryCycle';
import { Calendar, ChevronDown, Wallet } from 'lucide-react';
import { TouchButton } from '../ui/TouchButton';

export interface DateRangeFilterProps {
    selected: DateRangePreset;
    onSelect: (preset: DateRangePreset) => void;
    expenses: Expense[];
    paydayConfig?: PaydayConfig;
}

type FilterMode = 'cycle' | 'month';

const modeOf = (preset: DateRangePreset): FilterMode =>
    preset === 'currentCycle' || isSalaryCyclePreset(preset) ? 'cycle' : 'month';

export default function DateRangeFilter({
    selected,
    onSelect,
    expenses,
    paydayConfig = DEFAULT_PAYDAY_CONFIG,
}: DateRangeFilterProps) {
    const [mode, setMode] = useState<FilterMode>(() => modeOf(selected));

    useEffect(() => {
        setMode(modeOf(selected));
    }, [selected]);

    const availableMonths = useMemo(() => getAvailableMonths(expenses), [expenses]);
    const availableCycles = useMemo(
        () => getAvailableSalaryCycles(expenses, paydayConfig),
        [expenses, paydayConfig]
    );
    const currentCycleValue = useMemo(
        () => getCurrentCycle(paydayConfig).value,
        [paydayConfig]
    );

    const quickFilters: { value: DateRangePreset; label: string }[] =
        mode === 'cycle'
            ? [
                { value: 'all', label: 'All Time' },
                { value: 'currentCycle', label: 'Current Cycle' },
            ]
            : [
                { value: 'all', label: 'All Time' },
                { value: 'thisMonth', label: 'This Month' },
                { value: 'lastMonth', label: 'Last Month' },
            ];

    const handleModeChange = (next: FilterMode) => {
        setMode(next);
        if (selected === 'all') return;
        onSelect(next === 'cycle' ? 'currentCycle' : 'thisMonth');
    };

    const isExplicitCycle = isSalaryCyclePreset(selected);
    const isMonthSelected = /^\d{4}-\d{2}$/.test(selected);
    const dropdownActive = mode === 'cycle' ? isExplicitCycle : isMonthSelected;

    const modes: { value: FilterMode; label: string; icon: React.ReactNode }[] = [
        { value: 'cycle', label: 'Salary Cycle', icon: <Wallet size={14} /> },
        { value: 'month', label: 'Month', icon: <Calendar size={14} /> },
    ];

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Mode switch */}
            <div className="flex bg-base-200/50 p-1 rounded-xl h-10 w-full">
                {modes.map((option) => (
                    <TouchButton
                        key={option.value}
                        className={`
                            flex-1 px-3 gap-1.5 text-sm font-medium rounded-lg transition-all duration-200 border-none cursor-pointer flex items-center justify-center
                            ${mode === option.value
                                ? 'bg-primary text-primary-content shadow-sm'
                                : 'text-base-content/60 hover:bg-base-300/50 hover:text-base-content'
                            }
                        `}
                        onTap={() => handleModeChange(option.value)}
                    >
                        {option.icon}
                        {option.label}
                    </TouchButton>
                ))}
            </div>

            <div className="flex items-center gap-3 p-1 bg-[var(--card-bg)] rounded-2xl border border-base-content/5 shadow-sm w-full">
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

            {mode === 'cycle' ? (
                <div className="relative w-full">
                    <select
                        className={`
                            w-full h-[48px] pl-4 pr-10 text-sm font-medium rounded-2xl bg-[var(--card-bg)] appearance-none cursor-pointer transition-all
                            focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm
                            ${dropdownActive ? 'text-primary font-bold bg-primary/5 border border-primary/30' : 'text-base-content/80 border border-base-content/10 hover:bg-base-200/50'}
                        `}
                        value={isExplicitCycle ? selected : ''}
                        onChange={(e) => e.target.value && onSelect(e.target.value)}
                    >
                        <option value="">Select Cycle...</option>
                        {availableCycles.map((cycle) => (
                            <option key={cycle.value} value={cycle.value}>
                                {cycle.label}
                                {cycle.value === currentCycleValue ? ' (current)' : ''}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${dropdownActive ? 'text-primary' : 'text-base-content/50'}`} />
                    <p className="text-xs text-base-content/60 mt-2 mb-0">
                        Payday: {describePaydayConfig(paydayConfig)}
                    </p>
                </div>
            ) : (
                availableMonths.length > 0 && (
                    <div className="relative w-full">
                        <select
                            className={`
                                w-full h-[48px] pl-4 pr-10 text-sm font-medium rounded-2xl bg-[var(--card-bg)] appearance-none cursor-pointer transition-all
                                focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm
                                ${dropdownActive ? 'text-primary font-bold bg-primary/5 border border-primary/30' : 'text-base-content/80 border border-base-content/10 hover:bg-base-200/50'}
                            `}
                            value={isMonthSelected ? selected : ''}
                            onChange={(e) => e.target.value && onSelect(e.target.value)}
                        >
                            <option value="">Select Month...</option>
                            {availableMonths.map((month) => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${dropdownActive ? 'text-primary' : 'text-base-content/50'}`} />
                    </div>
                )
            )}
        </div>
    );
}
