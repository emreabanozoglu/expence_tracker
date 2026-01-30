'use client';

import React from 'react';
import { Expense } from '@/lib/types';
import styles from './BudgetProgress.module.css';

interface BudgetProgressProps {
    expenses: Expense[];
    expenseTarget?: number;
    savingTarget?: number;
    currencySymbol: string;
}

export default function BudgetProgress({
    expenses,
    expenseTarget,
    savingTarget,
    currencySymbol,
}: BudgetProgressProps) {
    if (!expenseTarget && !savingTarget) return null;

    // Calculate totals for this month
    const totalExpenses = expenses
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = expenses
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalSavings = totalIncome - totalExpenses;

    // Expense Logic
    const expensePercentage = expenseTarget
        ? Math.min((totalExpenses / expenseTarget) * 100, 100)
        : 0;

    let expenseStatus = 'good';
    let expenseMessage = 'You are within your budget.';

    if (expenseTarget) {
        if (totalExpenses > expenseTarget) {
            expenseStatus = 'exceeded';
            expenseMessage = `You've exceeded your budget by ${currencySymbol}${(totalExpenses - expenseTarget).toFixed(2)}!`;
        } else if (expensePercentage >= 90) {
            expenseStatus = 'warning';
            expenseMessage = 'You are close to your budget limit.';
        } else if (expensePercentage >= 75) {
            expenseStatus = 'caution';
            expenseMessage = 'You have used 75% of your budget.';
        }
    }

    // Savings Logic
    const savingPercentage = savingTarget
        ? Math.min((Math.max(totalSavings, 0) / savingTarget) * 100, 100)
        : 0;

    let savingMessage = 'Keep going to reach your savings goal!';
    if (savingTarget) {
        if (totalSavings >= savingTarget) {
            savingMessage = 'Congratulations! You reached your savings goal!';
        } else if (totalSavings < 0) {
            savingMessage = 'You are currently in negative savings.';
        }
    }

    return (
        <div className={styles.container}>
            {expenseTarget && (
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h3>Expense Budget</h3>
                        <span className={styles.target}>{currencySymbol}{expenseTarget.toLocaleString()}</span>
                    </div>
                    <div className={styles.progressContainer}>
                        <div
                            className={`${styles.progressBar} ${styles[expenseStatus]}`}
                            style={{ width: `${expensePercentage}%` }}
                        />
                    </div>
                    <div className={styles.details}>
                        <span className={styles.current}>{currencySymbol}{totalExpenses.toLocaleString()} spent</span>
                        <span className={`${styles.message} ${styles[expenseStatus]}`}>{expenseMessage}</span>
                    </div>
                </div>
            )}

            {savingTarget && (
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h3>Savings Goal</h3>
                        <span className={styles.target}>{currencySymbol}{savingTarget.toLocaleString()}</span>
                    </div>
                    <div className={styles.progressContainer}>
                        <div
                            className={`${styles.progressBar} ${styles.saving}`}
                            style={{ width: `${savingPercentage}%` }}
                        />
                    </div>
                    <div className={styles.details}>
                        <span className={styles.current}>{currencySymbol}{totalSavings.toLocaleString()} saved</span>
                        <span className={styles.message}>{savingMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
