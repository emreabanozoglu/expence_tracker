// Category Form Component - Add/Edit categories

'use client';

import React, { useState } from 'react';
import { CustomCategory, TransactionType } from '@/lib/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import styles from './CategoryForm.module.css';

const EMOJI_OPTIONS = ['🍔', '🚗', '🎬', '📄', '🛍️', '⚕️', '📚', '📦', '🏠', '✈️', '🎮', '💼', '🎨', '⚽', '🐾', '💰'];
const COLOR_OPTIONS = [
    'hsl(25, 85%, 55%)',   // Orange
    'hsl(200, 85%, 55%)',  // Blue
    'hsl(280, 85%, 60%)',  // Purple
    'hsl(0, 70%, 55%)',    // Red
    'hsl(340, 85%, 60%)',  // Pink
    'hsl(140, 70%, 50%)',  // Green
    'hsl(45, 85%, 55%)',   // Yellow
    'hsl(180, 70%, 50%)',  // Cyan
    'hsl(30, 85%, 55%)',   // Brown
    'hsl(260, 70%, 60%)',  // Indigo
];

export interface CategoryFormProps {
    category?: CustomCategory;
    onSubmit: (category: Omit<CustomCategory, 'id'>) => void;
    onCancel: () => void;
}

export default function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(category?.name || '');
    const [color, setColor] = useState(category?.color || COLOR_OPTIONS[0]);
    const [icon, setIcon] = useState(category?.icon || EMOJI_OPTIONS[0]);
    const [type, setType] = useState<TransactionType>(category?.type || 'expense');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Category name is required');
            return;
        }

        onSubmit({
            name: name.trim(),
            color,
            icon,
            isDefault: false,
            type,
        });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
                <div className={styles.typeToggle}>
                    <button
                        type="button"
                        className={`${styles.typeButton} ${type === 'expense' ? styles.activeExpense : ''}`}
                        onClick={() => setType('expense')}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        className={`${styles.typeButton} ${type === 'income' ? styles.activeIncome : ''}`}
                        onClick={() => setType('income')}
                    >
                        Income
                    </button>
                </div>
            </div>

            <div className={styles.field}>
                <label htmlFor="category-name" className={styles.label}>
                    Category Name
                </label>
                <Input
                    id="category-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setError('');
                    }}
                    placeholder="e.g., Pets, Gifts, Travel"
                    error={error}
                    data-testid="category-name-input"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Icon</label>
                <div className={styles.iconGrid}>
                    {EMOJI_OPTIONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            className={`${styles.iconOption} ${icon === emoji ? styles.selected : ''}`}
                            onClick={() => setIcon(emoji)}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Color</label>
                <div className={styles.colorGrid}>
                    {COLOR_OPTIONS.map((colorOption) => (
                        <button
                            key={colorOption}
                            type="button"
                            className={`${styles.colorOption} ${color === colorOption ? styles.selected : ''}`}
                            style={{ backgroundColor: colorOption }}
                            onClick={() => setColor(colorOption)}
                            aria-label={`Select color ${colorOption}`}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.preview}>
                <span className={styles.previewLabel}>Preview:</span>
                <div className={styles.previewBadge} style={{ backgroundColor: color }}>
                    <span className={styles.previewIcon}>{icon}</span>
                    <span className={styles.previewName}>{name || 'Category Name'}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <Button type="button" variant="ghost" onClick={onCancel} data-testid="cancel-category-button">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" data-testid="submit-category-button">
                    {category ? 'Update Category' : 'Add Category'}
                </Button>
            </div>
        </form>
    );
}
