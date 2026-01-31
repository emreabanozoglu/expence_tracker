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
    selectedCategory?: string | null;
    onCategorySelect?: (category: string | null) => void;
}

export default function CategoryBreakdown({
    expenses,
    filterType,
    selectedCategory,
    onCategorySelect
}: CategoryBreakdownProps) {
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
            if (expense > 0) data.push({ name: 'Expense', value: expense, percentage: 0, count: 0, type: 'expense' });
            if (income > 0) data.push({ name: 'Income', value: income, percentage: 0, count: 0, type: 'income' });

            // Calculate percentages for legend
            const total = income + expense;
            return data.map(item => ({
                ...item,
                percentage: total > 0 ? (item.value / total) * 100 : 0,
                count: expenses.filter(t => t.type === item.type).length
            }));

        } else {
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

    const handleCategoryClick = (categoryName: string) => {
        if (!onCategorySelect) return;

        if (selectedCategory === categoryName) {
            onCategorySelect(null); // Deselect
        } else {
            onCategorySelect(categoryName); // Select
        }
    };

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

        if (filterType === 'all') {
            const income = expenses
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            const expense = expenses
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                label: 'Net Balance',
                value: formatCurrency(income - expense, settings.currencySymbol)
            };
        }

        return {
            label: 'Total',
            value: formatCurrency(totalAmount, settings.currencySymbol)
        };
    }, [focusedIndex, chartData, totalAmount, settings.currencySymbol, filterType, expenses]);

    // Determine opacity/highlight
    const getOpacity = (entryName: string, index: number) => {
        if (selectedCategory) {
            return selectedCategory === entryName ? 1 : 0.3;
        }
        if (focusedIndex !== null) {
            return focusedIndex === index ? 1 : 0.6;
        }
        return 1;
    };

    return (
        <Card className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>
                    {filterType === 'all' ? 'Income vs Expense' : 'Breakdown'}
                </h3>
                {selectedCategory && (
                    <button
                        className={styles.clearButton}
                        onClick={() => onCategorySelect?.(null)}
                    >
                        Clear Filter
                    </button>
                )}
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
                                        const opacity = getOpacity(entry.name, index);
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={color}
                                                strokeWidth={selectedCategory === entry.name || focusedIndex === index ? 2 : 0}
                                                stroke="#fff"
                                                opacity={opacity}
                                                onClick={() => handleCategoryClick(entry.name)}
                                                style={{ cursor: 'pointer' }}
                                            />
                                        );
                                    })}
                                </Pie>
                                <Tooltip
                                    content={() => null}
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
                            const isSelected = selectedCategory === item.name;
                            const isDimmed = selectedCategory && !isSelected;

                            // Find the max percentage to scale the progress bars relative to the biggest item
                            const maxPercentage = Math.max(...chartData.map(c => c.percentage));
                            const relativeWidth = (item.percentage / maxPercentage) * 100;

                            return (
                                <div
                                    key={item.name}
                                    className={`${styles.legendItem} ${isSelected ? styles.selected : ''}`}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    onMouseLeave={() => setFocusedIndex(null)}
                                    onClick={() => handleCategoryClick(item.name)}
                                    style={{
                                        borderColor: isFocused || isSelected ? 'var(--border)' : 'transparent',
                                        background: isFocused || isSelected ? 'var(--hover-bg)' : 'transparent',
                                        opacity: isDimmed ? 0.5 : 1,
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
