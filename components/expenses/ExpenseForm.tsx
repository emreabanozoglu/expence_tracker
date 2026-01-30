// ExpenseForm Component - Add/Edit Expense

'use client';

import React, { useState, useEffect } from 'react';
import { Expense, ExpenseFormData, Category, TransactionType, RecurrenceFrequency } from '@/lib/types';
import { parseAmount } from '@/lib/utils/formatting';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';
import Input from '../ui/Input';
import Button from '../ui/Button';
import styles from './ExpenseForm.module.css';
import { Info } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export interface ExpenseFormProps {
    expense?: Expense;
    initialRecurringState?: {
        isRecurring: boolean;
        frequency: RecurrenceFrequency;
    };
    showRecurringToggle?: boolean;
    onSubmit: (data: ExpenseFormData) => void;
    onCancel: () => void;
}

export default function ExpenseForm({ expense, initialRecurringState, showRecurringToggle = true, onSubmit, onCancel }: ExpenseFormProps) {
    const { settings } = useSettingsContext();

    // Determine initial type
    const initialType: TransactionType = expense?.type || 'expense';

    // Get available categories based on type
    // Get available categories based on type
    const getCategories = (type: TransactionType) => {
        if (type === 'income') {
            const customIncome = settings.categories.filter(c => c.type === 'income');
            // Filter out any default categories that might be in settings to avoid duplicates if we merge
            // But simpler: Combine defaults + custom. 
            // Note: settings.categories are 'CustomCategory' objects (id, name, color, icon...).
            // DEFAULT_INCOME_CATEGORIES are likely simple objects or similar.
            // Let's map defaults to CustomCategory shape if needed, or just return mix.
            // The Select below uses 'cat.name', 'cat.icon'.

            // Create a map by name to ensure uniqueness if a custom category overrides a default name
            const allIncome = [...DEFAULT_INCOME_CATEGORIES, ...customIncome];

            // Deduplicate by name
            const uniqueIncome = Array.from(new Map(allIncome.map(item => [item.name, item])).values());
            return uniqueIncome;
        }
        // Filter settings.categories to ensuring we only show expense categories if mixed, 
        // though currently they are likely all expense or untyped (legacy)
        return settings.categories.filter(c => c.type === 'expense' || !c.type);
    };

    const [formData, setFormData] = useState<ExpenseFormData>({
        type: initialType,
        amount: expense?.amount.toString() || '',
        category: expense?.category || (getCategories(initialType)[0]?.name as Category) || 'Food',
        description: expense?.description || '',
        date: expense?.date.split('T')[0] || new Date().toISOString().split('T')[0],
        isRecurring: initialRecurringState?.isRecurring ?? false,
        frequency: initialRecurringState?.frequency ?? 'monthly',
    });

    // ... existing code ...

    // Find the toggle rendering and wrap it
    // Logic: If showRecurringToggle is false, we don't render the toggle.
    // However, if we don't render the toggle, we should still render the frequency if it IS recurring.
    // The frequency block is below the toggle block.

    // ... inside return ...



    const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update category when type changes if current category is not valid for new type
    useEffect(() => {
        const categories = getCategories(formData.type);
        const currentCategoryValid = categories.some(c => c.name === formData.category);

        if (!currentCategoryValid && categories.length > 0) {
            setFormData(prev => ({
                ...prev,
                category: categories[0].name as Category
            }));
        }
    }, [formData.type, settings.categories]);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};

        // Validate amount
        const parsedAmount = parseAmount(formData.amount);
        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else if (parsedAmount === null) {
            newErrors.amount = 'Please enter a valid positive number';
        }

        // Validate category
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        // Validate date
        if (!formData.date) {
            newErrors.date = 'Date is required';
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            if (!formData.isRecurring && selectedDate > today) {
                newErrors.date = 'Date cannot be in the future';
            }
        }

        // Description is optional, but limit length
        if (formData.description.length > 200) {
            newErrors.description = 'Description must be 200 characters or less';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        // Format the data
        const submitData: ExpenseFormData = {
            ...formData,
            date: new Date(formData.date).toISOString(),
        };

        onSubmit(submitData);
        setIsSubmitting(false);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, amount: e.target.value });
        if (errors.amount) {
            setErrors({ ...errors, amount: undefined });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                <div className={styles.fullWidth} style={{ marginBottom: '1rem' }}>
                    <div className={styles.typeToggle}>
                        <button
                            type="button"
                            className={`${styles.typeButton} ${formData.type === 'expense' ? styles.activeExpense : ''}`}
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            data-testid="type-expense"
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`${styles.typeButton} ${formData.type === 'income' ? styles.activeIncome : ''}`}
                            onClick={() => setFormData({ ...formData, type: 'income' })}
                            data-testid="type-income"
                        >
                            Income
                        </button>
                    </div>
                </div>

                <Input
                    label="Amount *"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleAmountChange}
                    error={errors.amount}
                    fullWidth
                    autoFocus
                    data-testid="expense-amount"
                />

                <div className={styles.field}>
                    <label htmlFor="category" className={styles.label}>
                        Category *
                    </label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                        className={styles.select}
                        data-testid="expense-category"
                    >
                        {getCategories(formData.type).map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && <span className={styles.error}>{errors.category}</span>}
                </div>

                {(formData.isRecurring && formData.frequency === 'monthly') ? (
                    <div className={styles.field}>
                        <label htmlFor="dayOfMonth" className={styles.label}>
                            Day of Month *
                        </label>
                        <select
                            id="dayOfMonth"
                            value={parseInt(formData.date.split('-')[2])}
                            onChange={(e) => {
                                const day = parseInt(e.target.value);
                                const [yStr, mStr] = formData.date.split('-');
                                // Create specific date object to handle month overflow correctly (e.g. Feb 30 -> Mar 2)
                                const newDate = new Date(parseInt(yStr), parseInt(mStr) - 1, day);

                                const y = newDate.getFullYear();
                                const m = String(newDate.getMonth() + 1).padStart(2, '0');
                                const d = String(newDate.getDate()).padStart(2, '0');

                                setFormData({ ...formData, date: `${y}-${m}-${d}` });
                            }}
                            className={styles.select}
                            data-testid="expense-day-of-month"
                        >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <option key={day} value={day}>
                                    {day}{[1, 21, 31].includes(day) ? 'st' : [2, 22].includes(day) ? 'nd' : [3, 23].includes(day) ? 'rd' : 'th'}
                                </option>
                            ))}
                        </select>
                        <p className={styles.helperText} style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                            Transaction will repeat on this day every month.
                        </p>
                    </div>
                ) : (
                    <Input
                        label={formData.isRecurring ? "Start Date *" : "Date *"}
                        type="date"
                        value={formData.date}
                        onChange={(e) => {
                            setFormData({ ...formData, date: e.target.value });
                            if (errors.date) {
                                setErrors({ ...errors, date: undefined });
                            }
                        }}
                        error={errors.date}
                        fullWidth
                        data-testid="expense-date"
                    />
                )}

                <div className={styles.fullWidth}>
                    <label htmlFor="description" className={styles.label}>
                        Description
                    </label>
                    <textarea
                        id="description"
                        className={styles.textarea}
                        placeholder="Add a note about this expense..."
                        value={formData.description}
                        onChange={(e) => {
                            setFormData({ ...formData, description: e.target.value });
                            if (errors.description) {
                                setErrors({ ...errors, description: undefined });
                            }
                        }}
                        rows={3}
                        maxLength={200}
                        data-testid="expense-description"
                    />
                    {errors.description && <span className={styles.error}>{errors.description}</span>}
                    <span className={styles.charCount}>{formData.description.length}/200</span>
                </div>

                {showRecurringToggle && (
                    <div className={styles.fullWidth}>
                        <div
                            className={styles.toggleWrapper}
                            onClick={() => !expense && setFormData({ ...formData, isRecurring: !formData.isRecurring })}
                            data-testid="recurring-toggle-wrapper"
                        >
                            <div className={styles.toggleLabel}>
                                Recurring Transaction
                                <span className={styles.toggleSubLabel}>Repeat this transaction automatically</span>
                            </div>
                            <div className={styles.switchGroup}>
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className={styles.infoIcon}
                                >
                                    <Tooltip content="Automatically creates a new transaction based on the selected frequency (e.g., monthly subscription).">
                                        <Info size={16} />
                                    </Tooltip>
                                </div>
                                <label className={styles.switch} onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        id="isRecurring"
                                        checked={formData.isRecurring}
                                        onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                                        disabled={!!expense}
                                        data-testid="expense-is-recurring"
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {formData.isRecurring && (
                    <div className={styles.field}>
                        <label htmlFor="frequency" className={styles.label}>
                            Frequency *
                        </label>
                        <select
                            id="frequency"
                            value={formData.frequency}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurrenceFrequency })}
                            className={styles.select}
                            data-testid="expense-frequency"
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                )}
            </div>

            <div className={styles.actions}>
                <Button type="button" variant="ghost" onClick={onCancel} data-testid="cancel-button">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting} data-testid="submit-expense-button">
                    {expense ? 'Update Transaction' : 'Add Transaction'}
                </Button>
            </div>
        </form>
    );
}
