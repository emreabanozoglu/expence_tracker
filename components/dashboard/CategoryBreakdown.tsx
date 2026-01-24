// Category Breakdown Chart Component

'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Expense } from '@/lib/types';
import { calculateCategoryTotals } from '@/lib/utils/calculations';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CATEGORY_COLORS } from '@/lib/constants';
import Card from '../ui/Card';
import styles from './CategoryBreakdown.module.css';

export interface CategoryBreakdownProps {
    expenses: Expense[];
}

export default function CategoryBreakdown({ expenses }: CategoryBreakdownProps) {
    const { settings } = useSettingsContext();
    const categoryTotals = calculateCategoryTotals(expenses);

    // Filter out categories with zero spending
    const activeCategories = categoryTotals.filter(cat => cat.total > 0);

    if (activeCategories.length === 0) {
        return (
            <Card className={styles.card}>
                <h3 className={styles.title}>Category Breakdown</h3>
                <div className={styles.empty}>
                    <p>No expenses to display</p>
                </div>
            </Card>
        );
    }

    // Prepare data for chart
    const chartData = activeCategories.map(cat => ({
        name: cat.category,
        value: cat.total,
        percentage: cat.percentage,
        count: cat.count,
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className={styles.tooltip}>
                    <p className={styles.tooltipLabel}>{data.name}</p>
                    <p className={styles.tooltipValue}>{formatCurrency(data.value, settings.currencySymbol)}</p>
                    <p className={styles.tooltipMeta}>
                        {formatPercentage(data.percentage)} • {data.count} {data.count === 1 ? 'expense' : 'expenses'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className={styles.card}>
            <h3 className={styles.title}>Category Breakdown</h3>

            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.legend}>
                {activeCategories.map((cat) => (
                    <div key={cat.category} className={styles.legendItem}>
                        <div
                            className={styles.legendColor}
                            style={{ backgroundColor: CATEGORY_COLORS[cat.category] }}
                        />
                        <div className={styles.legendContent}>
                            <div className={styles.legendLabel}>{cat.category}</div>
                            <div className={styles.legendValue}>
                                {formatCurrency(cat.total, settings.currencySymbol)} ({formatPercentage(cat.percentage)})
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
