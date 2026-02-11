'use client';

import React from 'react';
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
        <div className="flex items-center gap-3 p-1 bg-[var(--card-bg)] rounded-2xl border border-base-content/5 w-full shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-base-200/50 flex items-center justify-center text-base-content/70">
                <Filter size={18} />
            </div>
            <div className="flex bg-base-200/50 p-1 rounded-xl flex-1 relative h-10">
                {filters.map((option) => (
                    <TouchButton
                        key={option.value}
                        className={`
                            flex-1 relative z-10 text-sm font-medium rounded-lg transition-all duration-200 border-none cursor-pointer flex items-center justify-center
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
    );
}
