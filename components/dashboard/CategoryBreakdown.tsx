// Category Breakdown Chart Component

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense } from '@/lib/types';
import { calculateCategoryTotals } from '@/lib/utils/calculations';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '@/lib/constants';
import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';
import Card from '../ui/Card';

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
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

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
        <Card className="flex flex-col min-h-auto p-0 gap-0 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-base-content/5 flex-wrap gap-3 bg-base-100/50">
                <h3 className="text-xl font-bold m-0">
                    {filterType === 'all' ? 'Income vs Expense' : 'Breakdown'}
                </h3>
                {selectedCategory && (
                    <button
                        className="bg-transparent border border-base-content/20 px-3 py-1 rounded text-xs text-base-content/60 cursor-pointer touch-manipulation transition-all hover:bg-base-200 hover:text-base-content hover:border-base-content/40"
                        onClick={() => onCategorySelect?.(null)}
                    >
                        Clear Filter
                    </button>
                )}
            </div>

            {chartData.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-base-content/60 border-2 border-dashed border-base-content/10 rounded-xl w-full text-center">
                    <p>No data to display</p>
                </div>
            ) : (
                <div className="flex flex-1 gap-8 items-center justify-center p-6 max-[900px]:flex-col max-[900px]:gap-6 max-[900px]:items-stretch">
                    {/* Donut Chart */}
                    <div className="flex-1 h-[300px] relative flex items-center justify-center max-[900px]:w-full max-[900px]:min-h-[300px] max-[900px]:max-w-[350px] max-[900px]:mx-auto max-[900px]:flex-none max-[900px]:block">
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
                                    onMouseEnter={isTouch ? undefined : (_, index) => setFocusedIndex(index)}
                                    onMouseLeave={isTouch ? undefined : () => setFocusedIndex(null)}
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
                                {!isTouch && (
                                    <Tooltip
                                        content={() => null}
                                        cursor={false}
                                    />
                                )}
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <div className="text-sm text-base-content/60 mb-1">{centerInfo.label}</div>
                            <div className="text-2xl font-bold text-base-content">{centerInfo.value}</div>
                        </div>
                    </div>

                    {/* Interactive Legend List */}
                    <div className="flex-[1.2] flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 max-[900px]:w-full max-[900px]:max-h-none custom-scrollbar">
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
                                    className={`
                                        flex items-center gap-3 p-3 rounded-xl bg-base-200 border border-transparent cursor-pointer relative overflow-hidden flex-shrink-0 touch-manipulation tap-highlight-transparent transition-all
                                        ${isSelected ? 'border-primary bg-primary/5' : ''}
                                        ${(isFocused || isSelected) ? 'shadow-sm translate-x-1 border-base-300' : ''}
                                    `}
                                    onMouseEnter={isTouch ? undefined : () => setFocusedIndex(index)}
                                    onMouseLeave={isTouch ? undefined : () => setFocusedIndex(null)}
                                    onClick={() => handleCategoryClick(item.name)}
                                    style={{
                                        opacity: isDimmed ? 0.5 : 1,
                                    }}
                                >
                                    {/* Background Progress Bar */}
                                    <div
                                        className="absolute left-0 top-0 bottom-0 bg-base-100 opacity-50 z-0 transition-[width] duration-500 ease-in-out"
                                        style={{
                                            width: `${relativeWidth}%`,
                                            backgroundColor: color,
                                            opacity: 0.1
                                        }}
                                    />

                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-base-100 flex-shrink-0 relative z-[2]" style={{ color: color }}>
                                        {icon}
                                    </div>

                                    <div className="flex-1 relative z-[2]">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-semibold text-[15px] whitespace-nowrap overflow-hidden text-ellipsis mr-2">{item.name}</span>
                                            <span className="text-sm text-base-content/70 font-medium">{formatCurrency(item.value, settings.currencySymbol)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-base-content/60">
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
