// Settings Page

'use client';

import React, { useState } from 'react';
import { useSettings } from '@/lib/hooks/useSettings';
import { CustomCategory } from '@/lib/types';
import CurrencySelector from '@/components/settings/CurrencySelector';
import CategoryManager from '@/components/settings/CategoryManager';
import CategoryForm from '@/components/settings/CategoryForm';
import RecurringTransactionsList from '@/components/settings/RecurringTransactionsList';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function SettingsPage() {
    const {
        settings,
        isLoading,
        updateCurrency,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategories,
    } = useSettings();

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

    if (isLoading) {
        return (
            <div className={styles.loading} data-testid="settings-loading">
                <div className={styles.spinner}></div>
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <Link href="/" className={styles.backButton}>
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </Link>
                    <h1 className={styles.title}>Settings</h1>
                    <p className={styles.subtitle}>
                        Customize your expense tracker preferences
                    </p>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.section} data-testid="currency-section">
                        <CurrencySelector
                            selectedCurrency={settings.currency}
                            onCurrencyChange={updateCurrency}
                        />
                    </div>

                    <div className={styles.section} data-testid="category-section">
                        <CategoryManager
                            categories={settings.categories}
                            onAddCategory={handleAddCategory}
                            onEditCategory={handleEditCategory}
                            onDeleteCategory={deleteCategory}
                            onResetCategories={resetCategories}
                        />
                    </div>

                    <div className={styles.section} data-testid="recurring-section">
                        <h2 className={styles.categoryTitle} style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>Recurring Transactions</h2>
                        <RecurringTransactionsList />
                    </div>
                </div>
            </main>

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
