'use client';

import React from 'react';
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
        <div className="inline-flex items-center gap-2 p-1 bg-transparent border-none h-auto flex-nowrap">
            <Repeat size={16} className="text-base-content/60 flex-shrink-0" />
            <div className="flex gap-0.5 bg-base-200 p-0.5 rounded items-center border border-base-content/10 h-8">
                {filters.map((option) => (
                    <TouchButton
                        key={option.value}
                        className={`
                            px-2 py-0.5 text-xs font-medium border-none rounded bg-transparent cursor-pointer flex items-center justify-center whitespace-nowrap min-w-[60px] touch-manipulation transition-all
                            ${selected === option.value
                                ? 'bg-base-100 text-primary shadow-sm font-semibold'
                                : 'text-base-content/60 hover:text-base-content hover:bg-base-content/5'}
                        `}
                        onTap={() => onSelect(option.value)}
                    >
                        {option.label}
                    </TouchButton>
                ))}
            </div>
        </div>
    );
}
