// ExpenseItem Component - Single expense display

'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { Edit2, Trash2 } from 'lucide-react';
import styles from './ExpenseItem.module.css';

export interface ExpenseItemProps {
    expense: Expense;
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

export default function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
    const { settings } = useSettingsContext();
    const categoryColor = CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.Other;
    const categoryIcon = CATEGORY_ICONS[expense.category] || CATEGORY_ICONS.Other;

    const handleDelete = () => {
        onDelete(expense.id);
    };

    return (
        <div className={styles.item}>
            <div className={styles.categoryBadge} style={{ backgroundColor: categoryColor }}>
                <span className={styles.icon}>{categoryIcon}</span>
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h3 className={styles.category}>{expense.category}</h3>
                        <p className={styles.date}>{formatDate(expense.date)}</p>
                    </div>
                    <div className={styles.amount}>{formatCurrency(expense.amount, settings.currencySymbol)}</div>
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
                >
                    <Edit2 size={18} />
                </button>
                <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={handleDelete}
                    aria-label="Delete expense"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}
