// Summary Cards Component - Display key metrics

'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/formatting';
import { calculateTotalSpending, calculateAverageExpense, getTopCategory } from '@/lib/utils/calculations';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { DollarSign, TrendingUp, Award } from 'lucide-react';
import styles from './SummaryCards.module.css';

export interface SummaryCardsProps {
    expenses: Expense[];
}

export default function SummaryCards({ expenses }: SummaryCardsProps) {
    const { settings } = useSettingsContext();

    const income = expenses
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = expenses
        .filter(t => t.type === 'expense' || !t.type)
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    return (
        <div className={styles.grid} data-testid="summary-cards">
            <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <DollarSign size={24} />
                </div>
                <div className={styles.content}>
                    <div className={styles.label}>Total Income</div>
                    <div className={styles.value} style={{ color: 'var(--success)' }} data-testid="total-income">
                        {formatCurrency(income, settings.currencySymbol)}
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}>
                    <TrendingUp size={24} />
                </div>
                <div className={styles.content}>
                    <div className={styles.label}>Total Expense</div>
                    <div className={styles.value} style={{ color: 'var(--error)' }} data-testid="total-expense">
                        {formatCurrency(expense, settings.currencySymbol)}
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                    <Award size={24} />
                </div>
                <div className={styles.content}>
                    <div className={styles.label}>Net Balance</div>
                    <div className={styles.value} style={{ color: balance >= 0 ? 'var(--success)' : 'var(--error)' }} data-testid="net-balance">
                        {formatCurrency(balance, settings.currencySymbol)}
                    </div>
                </div>
            </div>
        </div>
    );
}
