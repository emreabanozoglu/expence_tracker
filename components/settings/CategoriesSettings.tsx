'use client';

import React, { useState } from 'react';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { CustomCategory } from '@/lib/types';
import CategoryManager from './CategoryManager';
import CategoryForm from './CategoryForm';
import Modal from '@/components/ui/Modal';

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
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-base-content mb-1">Categories</h2>
                <p className="text-sm text-base-content/60">Manage your income and expense categories.</p>
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
