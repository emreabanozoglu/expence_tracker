'use client';

import React, { useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { DateRangePreset, Expense } from '@/lib/types';
import TypeFilter from './TypeFilter';
import DateRangeFilter from './DateRangeFilter';
import RecurringFilter, { RecurringFilterType } from './RecurringFilter';
import Button from '../ui/Button';

export interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    dateRange: DateRangePreset;
    setDateRange: (range: DateRangePreset) => void;
    filterType: 'all' | 'expense' | 'income';
    setFilterType: (type: 'all' | 'expense' | 'income') => void;
    recurringFilter: RecurringFilterType;
    setRecurringFilter: (type: RecurringFilterType) => void;
    expenses: Expense[];
    onReset: () => void;
}

export default function FilterDrawer({
    isOpen,
    onClose,
    dateRange,
    setDateRange,
    filterType,
    setFilterType,
    recurringFilter,
    setRecurringFilter,
    expenses,
    onReset,
}: FilterDrawerProps) {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <div className={`fixed inset-0 z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Drawer Panel */}
            <div className={`
                absolute bottom-0 md:bottom-auto md:top-0 right-0 
                w-full md:w-[400px] h-[85vh] md:h-screen 
                bg-base-100 rounded-t-3xl md:rounded-none md:rounded-l-2xl shadow-2xl 
                flex flex-col
                transition-transform duration-300 ease-out transform
                ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 md:p-6 border-b border-base-200">
                    <h2 className="text-xl font-bold text-base-content m-0">Filters</h2>
                    <button 
                        onClick={onClose}
                        className="btn btn-sm btn-circle btn-ghost"
                        aria-label="Close filters"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-8">
                    {/* Transaction Type */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-base-content/80">
                            Transaction Type
                        </label>
                        <TypeFilter selected={filterType} onSelect={setFilterType} />
                    </div>

                    {/* Recurring Status */}
                    {filterType === 'expense' && (
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
                            <label className="text-sm font-semibold text-base-content/80">
                                Recurring Status
                            </label>
                            {/* Make Recurring filter take full width in drawer */}
                            <div className="w-full">
                                <RecurringFilter selected={recurringFilter} onSelect={setRecurringFilter} />
                            </div>
                        </div>
                    )}

                    {/* Date Period */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-base-content/80">
                            Date Period
                        </label>
                        {/* We use a wrapper here to ensure z-index issues don't occur if DateRangeFilter expands inside the drawer */}
                        <div className="relative z-50">
                            <DateRangeFilter selected={dateRange} onSelect={setDateRange} expenses={expenses} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 md:p-6 border-t border-base-200 bg-base-100 flex gap-3 mt-auto rounded-none md:rounded-bl-2xl">
                    <Button 
                        variant="ghost" 
                        className="flex-1 border border-base-content/20 hover:bg-base-200 text-base-content"
                        onClick={onReset}
                    >
                        <RotateCcw size={16} className="mr-2" />
                        Reset All
                    </Button>
                    <Button 
                        variant="primary" 
                        className="flex-1 shadow-lg shadow-primary/20"
                        onClick={onClose}
                    >
                        Show Results
                    </Button>
                </div>
            </div>
        </div>
    );
}
