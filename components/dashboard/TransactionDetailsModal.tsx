import React from 'react';
import { Expense } from '@/lib/types';
import Modal from '@/components/ui/Modal';
import { formatCurrency, formatDateDynamic } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '@/lib/constants';
import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';

interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    expense: Expense | null;
}

export default function TransactionDetailsModal({ isOpen, onClose, expense }: TransactionDetailsModalProps) {
    const { settings } = useSettingsContext();

    if (!expense) return null;

    const isIncome = expense.type === 'income';

    // Find category styling
    const categoryObj =
        settings.categories.find(c => c.name === expense.category) ||
        DEFAULT_INCOME_CATEGORIES.find(c => c.name === expense.category);

    const categoryColor = categoryObj?.color || CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Other;
    const categoryIcon = categoryObj?.icon || CATEGORY_ICONS[expense.category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.Other;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Transaction Details"
            size="sm"
        >
            <div style={{ padding: '0 0 16px 0' }}>
                {/* Header Section with Icon and Amount */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '24px',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '24px'
                }}>
                    <div style={{
                        backgroundColor: categoryColor,
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        marginBottom: '16px',
                        boxShadow: 'var(--shadow-md)'
                    }}>
                        {categoryIcon}
                    </div>

                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: isIncome ? 'var(--success)' : 'var(--foreground)',
                        marginBottom: '4px'
                    }}>
                        {isIncome ? '+' : '-'}{formatCurrency(expense.amount, settings.currencySymbol)}
                    </h2>

                    <span style={{
                        fontSize: '0.875rem',
                        color: 'var(--gray-500)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600
                    }}>
                        {expense.category}
                    </span>
                </div>

                {/* Details Grid */}
                <div style={{ display: 'grid', gap: '20px' }}>

                    {/* Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.925rem' }}>Date</span>
                        <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>
                            {formatDateDynamic(expense.date, settings.dateFormat)}
                        </span>
                    </div>

                    {/* Type */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--gray-500)', fontSize: '0.925rem' }}>Type</span>
                        <span style={{
                            fontWeight: 500,
                            color: isIncome ? 'var(--success)' : 'var(--foreground)',
                            textTransform: 'capitalize'
                        }}>
                            {expense.type}
                        </span>
                    </div>

                    {/* Description */}
                    {expense.description && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span style={{ color: 'var(--gray-500)', fontSize: '0.925rem' }}>Description</span>
                            <div style={{
                                backgroundColor: 'var(--gray-100)',
                                padding: '12px',
                                borderRadius: '8px',
                                fontSize: '0.925rem',
                                color: 'var(--gray-700)',
                                lineHeight: 1.5
                            }}>
                                {expense.description}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
