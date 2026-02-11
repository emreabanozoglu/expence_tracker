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
            <div className="pb-8">
                {/* Header Section with Icon and Amount */}
                <div className="flex flex-col items-center mb-6 border-b border-base-content/10 pb-6">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4 text-white"
                        style={{ backgroundColor: categoryColor }}
                    >
                        <span className="drop-shadow-md">{categoryIcon}</span>
                    </div>

                    <h2 className={`text-3xl font-bold mb-2 ${isIncome ? 'text-success' : 'text-base-content'}`}>
                        {isIncome ? '+' : '-'}{formatCurrency(expense.amount, settings.currencySymbol)}
                    </h2>

                    <span className="text-lg font-medium text-base-content/80">
                        {expense.category}
                    </span>
                </div>

                {/* Details Grid */}
                <div className="flex flex-col gap-5">

                    {/* Date */}
                    <div className="flex justify-between items-center">
                        <span className="text-base-content/60 text-[15px]">Date</span>
                        <span className="font-medium text-base-content">
                            {formatDateDynamic(expense.date, settings.dateFormat)}
                        </span>
                    </div>

                    {/* Type */}
                    <div className="flex justify-between items-center">
                        <span className="text-base-content/60 text-[15px]">Type</span>
                        <span className={`font-medium capitalize ${isIncome ? 'text-success' : 'text-base-content'}`}>
                            {expense.type}
                        </span>
                    </div>

                    {/* Description */}
                    {expense.description && (
                        <div className="flex flex-col gap-2">
                            <span className="text-base-content/60 text-[15px]">Description</span>
                            <div className="bg-base-200 p-3 rounded-xl text-[15px] text-base-content leading-relaxed">
                                {expense.description}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
