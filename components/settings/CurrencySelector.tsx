// Currency Selector Component

'use client';

import React from 'react';
import { CURRENCIES, getCurrencyByCode } from '@/lib/utils/currency';

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
        <div className="w-full">
            <div className="mb-4">
                <h3 className="text-base font-bold text-base-content mb-1">Currency</h3>
                <p className="text-sm text-base-content/60 m-0">
                    Choose your preferred currency for displaying amounts
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <select
                    value={selectedCurrency}
                    onChange={handleChange}
                    className="select select-bordered w-full max-w-md text-base"
                    data-testid="currency-selector"
                >
                    {CURRENCIES.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                            {currency.symbol} - {currency.name} ({currency.code})
                        </option>
                    ))}
                </select>

                <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-lg w-fit border border-base-200">
                    <span className="text-sm font-medium text-base-content/60">Preview:</span>
                    <span className="text-lg font-bold text-primary">
                        {currentCurrency.symbol}1,234.56
                    </span>
                </div>
            </div>
        </div>
    );
}
