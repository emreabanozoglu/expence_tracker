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
    const total = calculateTotalSpending(expenses);
    const average = calculateAverageExpense(expenses);
    const topCategory = getTopCategory(expenses);

    return (
        <div className={styles.grid}>
            <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <DollarSign size={24} />
                </div>
                <div className={styles.content}>
                    <div className={styles.label}>Total Spending</div>
                    <div className={styles.value}>{formatCurrency(total, settings.currencySymbol)}</div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                    <TrendingUp size={24} />
                </div>
                <div className={styles.content}>
                    <div className={styles.label}>Average Expense</div>
                    <div className={styles.value}>{formatCurrency(average, settings.currencySymbol)}</div>
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.iconWrapper} style={{ background: 'linear-gradient(135deg, #fad961 0%, #f76b1c 100%)' }}>
                    <Award size={24} />
                </div>
                <div className={styles.content}>
                    <div className={styles.label}>Top Category</div>
                    <div className={styles.value}>{topCategory || 'N/A'}</div>
                </div>
            </div>
        </div>
    );
}
