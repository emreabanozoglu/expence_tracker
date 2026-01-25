// ExpenseList Component - Display list of expenses

'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { Edit2, Trash2 } from 'lucide-react';
import ExpenseItem from './ExpenseItem';
import styles from './ExpenseList.module.css';

export interface ExpenseListProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
    if (expenses.length === 0) {
        return (
            <div className={styles.empty} data-testid="empty-state">
                <div className={styles.emptyIcon}>💸</div>
                <h3 className={styles.emptyTitle}>No transactions yet</h3>
                <p className={styles.emptyText}>
                    Start tracking your income and expenses by clicking the "Add Expense" button above.
                </p>
            </div>
        );
    }

    return (
        <div className={styles.list}>
            {expenses.map((expense) => (
                <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
