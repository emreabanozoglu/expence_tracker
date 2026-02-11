'use client';

import React from 'react';
import { Expense } from '@/lib/types';

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

    // Helper to get color class based on status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good': return 'bg-success';
            case 'caution': return 'bg-warning';
            case 'warning': return 'bg-orange-500';
            case 'exceeded': return 'bg-error';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {expenseTarget && (
                <div className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="m-0 text-lg font-semibold text-base-content">Expense Budget</h3>
                        <span className="text-sm text-base-content/60">{currencySymbol}{expenseTarget.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 bg-base-200 rounded-full overflow-hidden mb-3">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ease-in-out ${getStatusColor(expenseStatus)}`}
                            style={{ width: `${expensePercentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-base-content">{currencySymbol}{totalExpenses.toLocaleString()} spent</span>
                        <span className={`italic ${expenseStatus === 'exceeded' ? 'text-error font-semibold' : 'text-base-content/60'}`}>{expenseMessage}</span>
                    </div>
                </div>
            )}

            {savingTarget && (
                <div className="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="m-0 text-lg font-semibold text-base-content">Savings Goal</h3>
                        <span className="text-sm text-base-content/60">{currencySymbol}{savingTarget.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 bg-base-200 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full rounded-full transition-all duration-500 ease-in-out bg-primary"
                            style={{ width: `${savingPercentage}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-base-content">{currencySymbol}{totalSavings.toLocaleString()} saved</span>
                        <span className="text-base-content/60 italic">{savingMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
