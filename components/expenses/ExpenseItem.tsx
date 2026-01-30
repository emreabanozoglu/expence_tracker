// ExpenseItem Component - Single expense display

'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDateDynamic } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { Edit2, Trash2 } from 'lucide-react';
import styles from './ExpenseItem.module.css';

export interface ExpenseItemProps {
    expense: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
    const { settings } = useSettingsContext();

    // Determine type (default to expense if missing)
    const isIncome = expense.type === 'income';

    // Find category from settings or default income categories
    const categoryObj =
        settings.categories.find(c => c.name === expense.category) ||
        DEFAULT_INCOME_CATEGORIES.find(c => c.name === expense.category);

    const categoryColor = categoryObj?.color || CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other;
    const categoryIcon = categoryObj?.icon || CATEGORY_ICONS[expense.category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.Other;

    const handleDelete = () => {
        onDelete(expense.id);
    };

    return (
        <div className={styles.item} data-testid="expense-item">
            <div className={styles.categoryBadge} style={{ backgroundColor: categoryColor }}>
                <span className={styles.icon}>{categoryIcon}</span>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h3 className={styles.category}>{expense.category}</h3>
                        <p className={styles.date}>{formatDateDynamic(expense.date, settings.dateFormat)}</p>
                    </div>
                    <div className={`${styles.amount} ${isIncome ? styles.income : styles.expense}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(expense.amount, settings.currencySymbol)}
                    </div>
                </div>

                {expense.description && (
                    <p className={styles.description}>{expense.description}</p>
                )}
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.actionButton}
                    onClick={() => onEdit(expense)}
                    aria-label="Edit expense"
                    title="Edit"
                    data-testid="edit-expense-button"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
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
