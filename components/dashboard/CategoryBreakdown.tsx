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
}

export default function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
    const { settings } = useSettingsContext();
    const [activeType, setActiveType] = useState<TransactionType>('expense');
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    // Filter transactions by active type
    const activeTransactions = useMemo(() => {
        return expenses.filter(e => {
            if (activeType === 'expense') return e.type === 'expense' || !e.type;
            return e.type === 'income';
        });
    }, [expenses, activeType]);

    // Calculate totals
    const categoryTotals = useMemo(() => {
        return calculateCategoryTotals(activeTransactions);
    }, [activeTransactions]);

    // Active categories (non-zero)
    const activeCategories = useMemo(() => {
        return categoryTotals.filter(cat => cat.total > 0);
    }, [categoryTotals]);

    const totalAmount = activeTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Prepare chart data
    const chartData = useMemo(() => activeCategories.map(cat => ({
        name: cat.category,
        value: cat.total,
        percentage: cat.percentage,
        count: cat.count,
    })), [activeCategories]);

    // Helper to get Icon and Color safely
    const getCategoryStyles = (categoryName: string) => {
        const customCat = settings.categories.find(c => c.name === categoryName) ||
            DEFAULT_INCOME_CATEGORIES.find(c => c.name === categoryName);

        const color = customCat?.color || CATEGORY_COLORS[categoryName as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other;
        const icon = customCat?.icon || CATEGORY_ICONS[categoryName as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.Other;

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
            label: 'Total',
            value: formatCurrency(totalAmount, settings.currencySymbol)
        };
    }, [focusedIndex, chartData, totalAmount, settings.currencySymbol]);

    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>Breakdown</h3>

                <div className={styles.typeToggle}>
                    <button
                        className={`${styles.typeButton} ${activeType === 'expense' ? styles.activeType : ''}`}
                        onClick={() => setActiveType('expense')}
                    >
                        Expense
                    </button>
                    <button
                        className={`${styles.typeButton} ${activeType === 'income' ? styles.activeType : ''}`}
                        onClick={() => setActiveType('income')}
                    >
                        Income
                    </button>
                </div>
            </div>

            {activeCategories.length === 0 ? (
                <div className={styles.empty}>
                    <p>No {activeType} data to display</p>
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
                        {activeCategories.map((cat, index) => {
                            const { color, icon } = getCategoryStyles(cat.category);
                            const isFocused = focusedIndex === index;

                            // Find the max percentage to scale the progress bars relative to the biggest item
                            const maxPercentage = Math.max(...activeCategories.map(c => c.percentage));
                            const relativeWidth = (cat.percentage / maxPercentage) * 100;

                            return (
                                <div
                                    key={cat.category}
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
                                            <span className={styles.itemName}>{cat.category}</span>
                                            <span className={styles.itemValue}>{formatCurrency(cat.total, settings.currencySymbol)}</span>
                                        </div>
                                        <div className={styles.itemHeader} style={{ marginBottom: 0 }}>
                                            <span className={styles.itemPercentage}>
                                                {formatPercentage(cat.percentage)} • {cat.count} txns
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
