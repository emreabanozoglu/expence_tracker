// Category Breakdown Chart Component

'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense, TransactionType } from '@/lib/types';
import { calculateCategoryTotals } from '@/lib/utils/calculations';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';
import Card from '../ui/Card';
import styles from './CategoryBreakdown.module.css';

export interface CategoryBreakdownProps {
    expenses: Expense[];
    filterType: 'all' | 'expense' | 'income';
}

export default function CategoryBreakdown({ expenses, filterType }: CategoryBreakdownProps) {
    const { settings } = useSettingsContext();
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Calculate data based on filter type
    const chartData = useMemo(() => {
        if (filterType === 'all') {
            // Compare Total Income vs Total Expense
            const income = expenses
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = expenses
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            // Filter out zero values
            const data = [];
            if (expense > 0) data.push({ name: 'Expense', value: expense, percentage: 0, count: 0, type: 'expense' }); // Percentage calc later if needed, or ignored for simple logic
            if (income > 0) data.push({ name: 'Income', value: income, percentage: 0, count: 0, type: 'income' });

            // Calculate percentages for legend
            const total = income + expense;
            return data.map(item => ({
                ...item,
                percentage: total > 0 ? (item.value / total) * 100 : 0,
                // Count isn't strictly necessary for this high level view but let's keep shape
                count: expenses.filter(t => t.type === item.type).length
            }));

        } else {
            // Standard Category Breakdown (Income OR Expense)
            // Filter is already applied by parent to 'expenses' prop for this case? 
            // WAIT: The plan said "Pass filterType and finalDisplayedExpenses".
            // If parent passes ALL expenses + filterType='expense', we still need to filter here?
            // OR parent filters 'expenses' to ONLY be expenses?
            // Let's assume parent passes filtered list for 'income'/'expense' case, but passes ALL for 'all' case.
            // Actually, if parent passes filtered list, then expenses contains only that type.
            // So if filterType is 'expense', expenses is just expenses.

            const categoryTotals = calculateCategoryTotals(expenses);
            return categoryTotals
                .filter(cat => cat.total > 0)
                .map(cat => ({
                    name: cat.category,
                    value: cat.total,
                    percentage: cat.percentage,
                    count: cat.count,
                }));
        }
    }, [expenses, filterType]);

    const totalAmount = useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData]);

    // Helper to get Icon and Color safely
    const getCategoryStyles = (name: string) => {
        if (filterType === 'all') {
            if (name === 'Income') return { color: 'var(--success)', icon: '💰' };
            if (name === 'Expense') return { color: 'var(--error)', icon: '💸' };
        }

        const customCat = settings.categories.find(c => c.name === name) ||
            DEFAULT_INCOME_CATEGORIES.find(c => c.name === name);

        const color = customCat?.color || CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other;
        const icon = customCat?.icon || CATEGORY_ICONS[name as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.Other;

        return { color, icon };
    };

    // Determine what text to show in the center
    const centerInfo = useMemo(() => {
        if (focusedIndex !== null && chartData[focusedIndex]) {
            const item = chartData[focusedIndex];
            return {
                label: item.name,
                value: formatCurrency(item.value, settings.currencySymbol)
            };
        }
        return {
            label: filterType === 'all' ? 'Volume' : 'Total',
            value: formatCurrency(totalAmount, settings.currencySymbol)
        };
    }, [focusedIndex, chartData, totalAmount, settings.currencySymbol, filterType]);

    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {filterType === 'all' ? 'Income vs Expense' : 'Breakdown'}
                </h3>
            </div>

            {chartData.length === 0 ? (
                <div className={styles.empty}>
                    <p>No data to display</p>
                </div>
            ) : (
                <div className={styles.content}>
                    {/* Donut Chart */}
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={3}
                                    dataKey="value"
                                    onMouseEnter={(_, index) => setFocusedIndex(index)}
                                    onMouseLeave={() => setFocusedIndex(null)}
                                >
                                    {chartData.map((entry, index) => {
                                        const { color } = getCategoryStyles(entry.name);
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={color}
                                                strokeWidth={focusedIndex === index ? 2 : 0}
                                                stroke="#fff"
                                                opacity={focusedIndex !== null && focusedIndex !== index ? 0.6 : 1}
                                            />
                                        );
                                    })}
                                </Pie>
                                <Tooltip
                                    content={() => null} // Disable default tooltip to use center text
                                    cursor={false}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text */}
                        <div className={styles.centerText}>
                            <div className={styles.centerLabel}>{centerInfo.label}</div>
                            <div className={styles.centerValue}>{centerInfo.value}</div>
                        </div>
                    </div>

                    {/* Interactive Legend List */}
                    <div className={styles.legend}>
                        {chartData.map((item, index) => {
                            const { color, icon } = getCategoryStyles(item.name);
                            const isFocused = focusedIndex === index;

                            // Find the max percentage to scale the progress bars relative to the biggest item
                            const maxPercentage = Math.max(...chartData.map(c => c.percentage));
                            const relativeWidth = (item.percentage / maxPercentage) * 100;

                            return (
                                <div
                                    key={item.name}
                                    className={styles.legendItem}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    onMouseLeave={() => setFocusedIndex(null)}
                                    style={{
                                        borderColor: isFocused ? 'var(--border)' : 'transparent',
                                        background: isFocused ? 'var(--hover-bg)' : 'transparent'
                                    }}
                                >
                                    {/* Background Progress Bar */}
                                    <div
                                        className={styles.progressBar}
                                        style={{
                                            width: `${relativeWidth}%`,
                                            backgroundColor: color,
                                            opacity: 0.1
                                        }}
                                    />

                                    <div className={styles.itemIcon} style={{ color: color }}>
                                        {icon}
                                    </div>

                                    <div className={styles.itemContent}>
                                        <div className={styles.itemHeader}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <span className={styles.itemValue}>{formatCurrency(item.value, settings.currencySymbol)}</span>
                                        </div>
                                        <div className={styles.itemHeader} style={{ marginBottom: 0 }}>
                                            <span className={styles.itemPercentage}>
                                                {formatPercentage(item.percentage)}
                                                {filterType !== 'all' && ` • ${item.count} txns`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </Card>
    );
}
