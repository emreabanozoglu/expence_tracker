// Category Manager Component

'use client';

import React, { useState, useMemo } from 'react';
import { CustomCategory, TransactionType } from '@/lib/types';
import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';
import Button from '@/components/ui/Button';
import { Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import styles from './CategoryManager.module.css';

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

    // Filter categories based on active tab
    // For Income: Include settings categories AND default income categories if not present
    // For Expense: Include settings categories (defaults are already there usually)
    const displayedCategories = useMemo(() => {
        if (activeTab === 'expense') {
            return categories.filter(c => c.type === 'expense' || !c.type);
        } else {
            // Get custom income categories
            const customIncome = categories.filter(c => c.type === 'income');

            // If we have custom income categories (or migrated defaults), use them.
            // Otherwise, show the defaults + any customs. 
            // Since we don't save defaults to DB for income yet (unless new user), 
            // we might want to show defaults if we don't have a matching name/ID in custom list?
            // Simpler approach for now: Show everything in settings + Defaults that aren't in settings?
            // Actually, best UX: If settings has NO income categories, show defaults. 
            // If it has SOME, assume user is managing them?
            // But 'settings.categories' for separate types is tricky if they weren't seeded.

            // Hybrid approach: Custom categories from DB + Defaults that are "missing" from DB?
            // Or just display Defaults if the DB list for income is empty.
            if (customIncome.length === 0) {
                return DEFAULT_INCOME_CATEGORIES;
            }
            return customIncome;
        }
    }, [categories, activeTab]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Categories</h3>
                    <p className={styles.description}>
                        Manage your expense categories with custom colors and icons
                    </p>
                </div>
                <div className={styles.actions}>
                    <Button
                        variant="ghost"
                        onClick={handleReset}
                        className={confirmReset ? styles.confirmButton : ''}
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

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'expense' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('expense')}
                >
                    Expense
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'income' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('income')}
                >
                    Income
                </button>
            </div>

            <div className={styles.grid} data-testid="category-list">
                {displayedCategories.map((category) => (
                    <div key={category.id} className={styles.categoryCard} data-testid="category-card">
                        <div className={styles.categoryInfo}>
                            <div
                                className={styles.categoryIcon}
                                style={{ backgroundColor: category.color }}
                            >
                                {category.icon}
                            </div>
                            <div className={styles.categoryDetails}>
                                <div className={styles.categoryName}>{category.name}</div>
                                {category.isDefault && (
                                    <span className={styles.defaultBadge}>Default</span>
                                )}
                            </div>
                        </div>
                        <div className={styles.categoryActions}>
                            <button
                                className={styles.actionButton}
                                onClick={() => onEditCategory(category)}
                                aria-label="Edit category"
                                data-testid="edit-category-button"
                            >
                                <Edit2 size={16} />
                            </button>
                            {!category.isDefault && (
                                <button
                                    className={`${styles.actionButton} ${styles.deleteButton}`}
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
