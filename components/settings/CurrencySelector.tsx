// Currency Selector Component

'use client';

import React from 'react';
import { CURRENCIES, getCurrencyByCode } from '@/lib/utils/currency';
import styles from './CurrencySelector.module.css';

export interface CurrencySelectorProps {
    selectedCurrency: string;
    onCurrencyChange: (code: string, symbol: string) => void;
}

export default function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const currency = getCurrencyByCode(e.target.value);
        onCurrencyChange(currency.code, currency.symbol);
    };

    const currentCurrency = getCurrencyByCode(selectedCurrency);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Currency</h3>
                <p className={styles.description}>
                    Choose your preferred currency for displaying amounts
                </p>
            </div>

            <div className={styles.content}>
                <select
                    value={selectedCurrency}
                    onChange={handleChange}
                    className={styles.select}
                >
                    {CURRENCIES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                            {currency.symbol} - {currency.name} ({currency.code})
                        </option>
                    ))}
                </select>

                <div className={styles.preview}>
                    <span className={styles.previewLabel}>Preview:</span>
                    <span className={styles.previewAmount}>
                        {currentCurrency.symbol}1,234.56
                    </span>
                </div>
            </div>
        </div>
    );
}
