// Category Manager Component

'use client';

import React, { useState, useMemo } from 'react';
import { CustomCategory, TransactionType } from '@/lib/types';
import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';

export interface CategoryManagerProps {
    categories: CustomCategory[];
    onAddCategory: () => void;
    onEditCategory: (category: CustomCategory) => void;
    onDeleteCategory: (id: string) => void;
    onResetCategories: () => void;
}

export default function CategoryManager({
    categories,
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
    onResetCategories,
}: CategoryManagerProps) {
    const [confirmReset, setConfirmReset] = useState(false);
    const [activeTab, setActiveTab] = useState<TransactionType>('expense');

    const handleReset = () => {
        if (confirmReset) {
            onResetCategories();
            setConfirmReset(false);
        } else {
            setConfirmReset(true);
            setTimeout(() => setConfirmReset(false), 3000);
        }
    };

    const displayedCategories = useMemo(() => {
        if (activeTab === 'expense') {
            return categories.filter(c => c.type === 'expense' || !c.type);
        } else {
            const customIncome = categories.filter(c => c.type === 'income');
            if (customIncome.length === 0) {
                return DEFAULT_INCOME_CATEGORIES;
            }
            return customIncome;
        }
    }, [categories, activeTab]);

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h3 className="text-xl font-bold text-base-content mb-1">Categories</h3>
                    <p className="text-sm text-base-content/60 m-0">
                        Manage your expense categories with custom colors and icons
                    </p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className={confirmReset ? 'bg-warning text-warning-content hover:bg-warning-focus' : ''}
                        data-testid="reset-categories-button"
                    >
                        <RotateCcw size={18} />
                        {confirmReset ? 'Click again to confirm' : 'Reset to Defaults'}
                    </Button>
                    <Button variant="primary" onClick={onAddCategory} data-testid="add-category-button">
                        <Plus size={18} />
                        Add Category
                    </Button>
                </div>
            </div>

            <div className="flex gap-1 border-b border-base-200 mb-6">
                <button
                    className={`
                        px-4 py-2 text-sm font-medium border-b-2 transition-colors
                        ${activeTab === 'expense'
                            ? 'text-primary border-primary'
                            : 'text-base-content/60 border-transparent hover:text-base-content'
                        }
                    `}
                    onClick={() => setActiveTab('expense')}
                >
                    Expense
                </button>
                <button
                    className={`
                        px-4 py-2 text-sm font-medium border-b-2 transition-colors
                        ${activeTab === 'income'
                            ? 'text-primary border-primary'
                            : 'text-base-content/60 border-transparent hover:text-base-content'
                        }
                    `}
                    onClick={() => setActiveTab('income')}
                >
                    Income
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="category-list">
                {displayedCategories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 bg-base-100 border border-base-200 rounded-xl hover:border-primary/50 transition-all shadow-sm" data-testid="category-card">
                        <div className="flex items-center gap-3 overflow-hidden flex-1 min-w-0">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0 text-white shadow-sm"
                                style={{ backgroundColor: category.color }}
                            >
                                {category.icon}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <div className="font-bold text-base-content truncate">{category.name}</div>
                                {category.isDefault && (
                                    <span className="text-xs text-base-content/50 font-medium">Default</span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <button
                                className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-primary"
                                onClick={() => onEditCategory(category)}
                                aria-label="Edit category"
                                data-testid="edit-category-button"
                            >
                                <Edit2 size={16} />
                            </button>
                            {!category.isDefault && (
                                <button
                                    className="btn btn-ghost btn-sm btn-square text-base-content/60 hover:text-error hover:bg-error/10"
                                    onClick={() => onDeleteCategory(category.id)}
                                    aria-label="Delete category"
                                    data-testid="delete-category-button"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
