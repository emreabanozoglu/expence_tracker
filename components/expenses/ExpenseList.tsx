// ExpenseList Component - Display list of expenses

'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import ExpenseItem from './ExpenseItem';

export interface ExpenseListProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
    onItemClick?: (expense: Expense) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete, onItemClick }: ExpenseListProps) {
    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 px-6 bg-base-100 rounded-lg border-2 border-dashed border-base-300" data-testid="empty-state">
                <div className="text-6xl mb-6 opacity-50">💸</div>
                <h3 className="text-2xl font-bold mb-2 text-base-content">No transactions yet</h3>
                <p className="text-base text-base-content/60 max-w-sm mx-auto">
                    Start tracking your income and expenses by clicking the "Add Expense" button above.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {expenses.map((expense) => (
                <ExpenseItem
                    key={expense.id}
                    expense={expense}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onClick={onItemClick}
                />
            ))}
        </div>
    );
}
