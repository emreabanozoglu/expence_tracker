'use client';

import React from 'react';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import styles from './BudgetSettings.module.css';

export default function BudgetSettings() {
    const { settings, updateBudgetTargets } = useSettingsContext();

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Budget & Goals</h2>
            <div className={styles.grid}>
                <div className={styles.card}>
                    <label className={styles.label}>Monthly Expense Budget</label>
                    <div className={styles.inputWrapper}>
                        <span className={styles.currency}>{settings.currencySymbol}</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={settings.expenseTarget || ''}
                            onChange={(e) => updateBudgetTargets(e.target.value ? parseFloat(e.target.value) : undefined, settings.savingTarget)}
                            className={styles.input}
                        />
                    </div>
                    <p className={styles.helperText}>
                        Set a limit for your monthly spending.
                    </p>
                </div>

                <div className={styles.card}>
                    <label className={styles.label}>Monthly Savings Goal</label>
                    <div className={styles.inputWrapper}>
                        <span className={`${styles.currency} ${styles.success}`}>{settings.currencySymbol}</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={settings.savingTarget || ''}
                            onChange={(e) => updateBudgetTargets(settings.expenseTarget, e.target.value ? parseFloat(e.target.value) : undefined)}
                            className={styles.input}
                        />
                    </div>
                    <p className={styles.helperText}>
                        Target amount to save (Income - Expenses).
                    </p>
                </div>
            </div>
        </div>
    );
}
