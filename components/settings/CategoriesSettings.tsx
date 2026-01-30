'use client';

import React, { useState } from 'react';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CustomCategory } from '@/lib/types';
import CategoryManager from './CategoryManager';
import CategoryForm from './CategoryForm';
import Modal from '@/components/ui/Modal';
import styles from './CategoriesSettings.module.css';

export default function CategoriesSettings() {
    const {
        settings,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategories,
    } = useSettingsContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CustomCategory | undefined>();

    const handleAddCategory = () => {
        setEditingCategory(undefined);
        setIsModalOpen(true);
    };

    const handleEditCategory = (category: CustomCategory) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleSubmitCategory = (categoryData: Omit<CustomCategory, 'id'>) => {
        if (editingCategory) {
            updateCategory(editingCategory.id, categoryData);
        } else {
            addCategory(categoryData);
        }
        setIsModalOpen(false);
        setEditingCategory(undefined);
    };

    const handleCancelCategory = () => {
        setIsModalOpen(false);
        setEditingCategory(undefined);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Categories</h2>
                <p className={styles.subtitle}>Manage your income and expense categories.</p>
            </div>

            <CategoryManager
                categories={settings.categories}
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={deleteCategory}
                onResetCategories={resetCategories}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCancelCategory}
                title={editingCategory ? 'Edit Category' : 'Add New Category'}
                size="md"
            >
                <CategoryForm
                    category={editingCategory}
                    onSubmit={handleSubmitCategory}
                    onCancel={handleCancelCategory}
                />
            </Modal>
        </div>
    );
}
