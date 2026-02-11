'use client';

import React from 'react';
import { useSettingsContext } from '@/lib/context/SettingsContext';

export default function BudgetSettings() {
    const { settings, updateBudgetTargets } = useSettingsContext();

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold mb-6 text-base-content">Budget & Goals</h2>
            <div className="grid gap-6 max-w-xl">
                <div className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
                    <label className="block mb-2 font-medium text-base-content">Monthly Expense Budget</label>
                    <div className="flex items-center gap-3 bg-base-200/50 border border-base-200 rounded-lg px-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                        <span className="text-base-content/60 font-semibold text-lg">{settings.currencySymbol}</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={settings.expenseTarget || ''}
                            onChange={(e) => updateBudgetTargets(e.target.value ? parseFloat(e.target.value) : undefined, settings.savingTarget)}
                            className="w-full py-3 bg-transparent border-0 outline-none text-base text-base-content placeholder:text-base-content/30"
                        />
                    </div>
                    <p className="text-sm text-base-content/60 mt-2">
                        Set a limit for your monthly spending.
                    </p>
                </div>

                <div className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
                    <label className="block mb-2 font-medium text-base-content">Monthly Savings Goal</label>
                    <div className="flex items-center gap-3 bg-base-200/50 border border-base-200 rounded-lg px-3 focus-within:border-success focus-within:ring-1 focus-within:ring-success/20 transition-all">
                        <span className="text-success font-semibold text-lg">{settings.currencySymbol}</span>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={settings.savingTarget || ''}
                            onChange={(e) => updateBudgetTargets(settings.expenseTarget, e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="w-full py-3 bg-transparent border-0 outline-none text-base text-base-content placeholder:text-base-content/30"
                        />
                    </div>
                    <p className="text-sm text-base-content/60 mt-2">
                        Target amount to save (Income - Expenses).
                    </p>
                </div>
            </div>
        </div>
    );
}
