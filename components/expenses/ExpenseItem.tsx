// ExpenseItem Component - Single expense display

'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDateDynamic } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { Edit2, Trash2 } from 'lucide-react';
import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';

export interface ExpenseItemProps {
    expense: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    onClick?: (expense: Expense) => void;
}

export default function ExpenseItem({ expense, onEdit, onDelete, onClick }: ExpenseItemProps) {
    const { settings } = useSettingsContext();

    // Determine type (default to expense if missing)
    const isIncome = expense.type === 'income';

    // Find category from settings or default income categories
    const categoryObj =
        settings.categories.find(c => c.name === expense.category) ||
        DEFAULT_INCOME_CATEGORIES.find(c => c.name === expense.category);

    const categoryColor = categoryObj?.color || CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other;
    const categoryIcon = categoryObj?.icon || CATEGORY_ICONS[expense.category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.Other;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(expense.id);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(expense);
    };

    return (
        <div
            className={`
                flex gap-4 p-4 rounded-2xl animate-[fadeIn_0.3s_ease-out] touch-manipulation
                hover:bg-[var(--hover-bg)] transition-all duration-200
                items-center border-b border-base-content/5 last:border-none
            `}
            data-testid="expense-item"
            onClick={() => onClick && onClick(expense)}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <div
                className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm bg-base-100"
                style={{ backgroundColor: categoryColor }}
            >
                <span className="drop-shadow-sm">{categoryIcon}</span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3 mb-0.5">
                    <div>
                        <h3 className="text-base font-bold text-base-content m-0 leading-tight">{expense.category}</h3>
                        <p className="text-xs text-base-content/60 m-0 mt-0.5 font-medium">{formatDateDynamic(expense.date, settings.dateFormat)}</p>
                    </div>
                    <div className={`text-base font-bold whitespace-nowrap ${isIncome ? 'text-success' : 'text-base-content'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(expense.amount, settings.currencySymbol)}
                    </div>
                </div>

                {expense.description && (
                    <p className="text-sm text-base-content/70 m-0 leading-relaxed truncate mt-1">{expense.description}</p>
                )}
            </div>

            <div className="flex gap-1 flex-shrink-0 ml-1">
                <button
                    className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-primary hover:bg-base-200"
                    onClick={handleEdit}
                    aria-label="Edit expense"
                    title="Edit"
                    data-testid="edit-expense-button"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-error hover:bg-error/10"
                    onClick={handleDelete}
                    aria-label="Delete expense"
                    title="Delete"
                    data-testid="delete-expense-button"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
