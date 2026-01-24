// Category Manager Component

'use client';

import React, { useState } from 'react';
import { CustomCategory } from '@/lib/types';
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

    const handleReset = () => {
        if (confirmReset) {
            onResetCategories();
            setConfirmReset(false);
        } else {
            setConfirmReset(true);
            setTimeout(() => setConfirmReset(false), 3000);
        }
    };

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

            <div className={styles.grid} data-testid="category-list">
                {categories.map((category) => (
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
