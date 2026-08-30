// ExpenseForm Component - Add/Edit Expense

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Expense, ExpenseFormData, Category, TransactionType, RecurrenceFrequency, PaydayRule } from '@/lib/types';
import { parseAmount } from '@/lib/utils/formatting';
import {
    DEFAULT_PAYDAY_CONFIG,
    PAYDAY_RULE_LABELS,
    getPayday,
    paydayRuleRequiresDay,
} from '@/lib/utils/salaryCycle';
import { format } from 'date-fns';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { DEFAULT_INCOME_CATEGORIES } from '@/lib/constants/defaultCategories';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Info } from 'lucide-react';
import Tooltip from '../ui/Tooltip';

export interface ExpenseFormProps {
    expense?: Expense;
    initialRecurringState?: {
        isRecurring: boolean;
        frequency: RecurrenceFrequency;
    };
    initialPaydayState?: {
        isSalary: boolean;
        paydayRule?: PaydayRule;
        paydayDayOfMonth?: number;
    };
    showRecurringToggle?: boolean;
    onSubmit: (data: ExpenseFormData) => void;
    onCancel: () => void;
}

export default function ExpenseForm({ expense, initialRecurringState, initialPaydayState, showRecurringToggle = true, onSubmit, onCancel }: ExpenseFormProps) {
    const { settings } = useSettingsContext();

    // Determine initial type
    const initialType: TransactionType = expense?.type || 'expense';

    // Get available categories based on type
    const getCategories = (type: TransactionType) => {
        if (type === 'income') {
            const customIncome = settings.categories.filter(c => c.type === 'income');
            const allIncome = [...DEFAULT_INCOME_CATEGORIES, ...customIncome];
            // Deduplicate by name
            const uniqueIncome = Array.from(new Map(allIncome.map(item => [item.name, item])).values());
            return uniqueIncome;
        }
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
        isSalary: initialPaydayState?.isSalary ?? false,
        paydayRule: initialPaydayState?.paydayRule,
        paydayDayOfMonth: initialPaydayState?.paydayDayOfMonth,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // The payday rule only makes sense for a recurring monthly income.
    const isSalaryCandidate =
        formData.isRecurring &&
        formData.type === 'income' &&
        formData.frequency === 'monthly';

    // Clear salary flags when the transaction stops qualifying.
    useEffect(() => {
        if (!isSalaryCandidate && formData.isSalary) {
            setFormData(prev => ({
                ...prev,
                isSalary: false,
                paydayRule: undefined,
                paydayDayOfMonth: undefined,
            }));
        }
    }, [isSalaryCandidate, formData.isSalary]);

    const paydayPreview = useMemo(() => {
        if (!isSalaryCandidate || !formData.isSalary) return '';

        const rule = formData.paydayRule ?? DEFAULT_PAYDAY_CONFIG.rule;
        if (paydayRuleRequiresDay(rule) && !formData.paydayDayOfMonth) return '';

        const config = { rule, dayOfMonth: formData.paydayDayOfMonth };
        const today = new Date();

        return [0, 1, 2]
            .map(offset =>
                format(getPayday(today.getFullYear(), today.getMonth() + offset, config), 'd MMM')
            )
            .join(' · ');
    }, [isSalaryCandidate, formData.isSalary, formData.paydayRule, formData.paydayDayOfMonth]);

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

        // Payday day is required by the fixed-day rules
        if (formData.isSalary) {
            const rule = formData.paydayRule ?? DEFAULT_PAYDAY_CONFIG.rule;
            if (paydayRuleRequiresDay(rule)) {
                const day = formData.paydayDayOfMonth;
                if (day === undefined || Number.isNaN(day)) {
                    newErrors.paydayDayOfMonth = 'Day of month is required';
                } else if (!Number.isInteger(day) || day < 1 || day > 31) {
                    newErrors.paydayDayOfMonth = 'Enter a day between 1 and 31';
                }
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
        const rule = formData.paydayRule ?? DEFAULT_PAYDAY_CONFIG.rule;
        const submitData: ExpenseFormData = {
            ...formData,
            date: new Date(formData.date).toISOString(),
            isSalary: formData.isSalary ?? false,
            paydayRule: formData.isSalary ? rule : undefined,
            paydayDayOfMonth:
                formData.isSalary && paydayRuleRequiresDay(rule)
                    ? formData.paydayDayOfMonth
                    : undefined,
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full flex flex-col gap-2 mb-4">
                    <div className="flex p-1 bg-base-200 rounded-lg gap-1 border border-base-300">
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.type === 'expense'
                                ? 'bg-base-100 text-error shadow-sm font-semibold'
                                : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
                                }`}
                            onClick={() => setFormData({ ...formData, type: 'expense' })}
                            data-testid="type-expense"
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.type === 'income'
                                ? 'bg-base-100 text-success shadow-sm font-semibold'
                                : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
                                }`}
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

                <div className="form-control w-full">
                    <label htmlFor="category" className="label label-text font-semibold">
                        Category *
                    </label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                        className="select select-bordered w-full text-base transition-all focus:border-primary"
                        data-testid="expense-category"
                    >
                        {getCategories(formData.type).map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.icon} {cat.name}
                            </option>
                        ))}
                    </select>
                    {errors.category && <span className="text-error text-sm mt-1">{errors.category}</span>}
                </div>

                {formData.isRecurring ? (
                    <Input
                        label="Start Month *"
                        type="month"
                        value={formData.date.substring(0, 7)}
                        onChange={(e) => {
                            setFormData({ ...formData, date: `${e.target.value}-01` });
                            if (errors.date) {
                                setErrors({ ...errors, date: undefined });
                            }
                        }}
                        error={errors.date}
                        fullWidth
                        data-testid="expense-date"
                    />
                ) : (
                    <Input
                        label="Date *"
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

                <div className="col-span-full form-control w-full">
                    <label htmlFor="description" className="label label-text font-semibold">
                        Description
                    </label>
                    <textarea
                        id="description"
                        className={`
                            textarea textarea-bordered w-full text-base h-16 transition-all focus:border-primary
                            ${errors.description ? 'textarea-error' : ''}
                        `}
                        placeholder="Add a note about this expense..."
                        value={formData.description}
                        onChange={(e) => {
                            setFormData({ ...formData, description: e.target.value });
                            if (errors.description) {
                                setErrors({ ...errors, description: undefined });
                            }
                        }}
                        maxLength={200}
                        data-testid="expense-description"
                    />
                    {errors.description && <span className="text-error text-sm mt-1">{errors.description}</span>}
                    <span className="text-xs text-base-content/60 text-right mt-1">{formData.description.length}/200</span>
                </div>

                {isSalaryCandidate && (
                    <div className="col-span-full flex flex-col gap-2 p-4 rounded-xl bg-base-200/40 border border-base-300">
                        <div className="flex items-center gap-2">
                            <label className="label label-text font-semibold flex items-center gap-1.5 p-0">
                                Is this your salary?
                                <Tooltip content="Marks this as the salary that defines your pay cycle. The dashboard's salary cycle filter starts on each payday.">
                                    <Info size={14} className="text-base-content/50 hover:text-primary transition-colors cursor-help" />
                                </Tooltip>
                            </label>
                        </div>
                        <div className="flex p-1 bg-base-200 rounded-lg gap-1 border border-base-300">
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!formData.isSalary
                                    ? 'bg-base-100 text-base-content shadow-sm font-semibold'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
                                    }`}
                                onClick={() => setFormData({ ...formData, isSalary: false })}
                                data-testid="salary-no"
                            >
                                No
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.isSalary
                                    ? 'bg-base-100 text-primary shadow-sm font-semibold'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
                                    }`}
                                onClick={() => setFormData({
                                    ...formData,
                                    isSalary: true,
                                    paydayRule: formData.paydayRule ?? DEFAULT_PAYDAY_CONFIG.rule,
                                })}
                                data-testid="expense-is-salary"
                            >
                                Yes
                            </button>
                        </div>

                        {formData.isSalary && (
                            <div className="flex flex-col gap-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="form-control w-full">
                                    <label htmlFor="paydayRule" className="label label-text font-semibold">
                                        When do you get paid? *
                                    </label>
                                    <select
                                        id="paydayRule"
                                        value={formData.paydayRule ?? DEFAULT_PAYDAY_CONFIG.rule}
                                        onChange={(e) => {
                                            const rule = e.target.value as PaydayRule;
                                            setFormData({
                                                ...formData,
                                                paydayRule: rule,
                                                paydayDayOfMonth: paydayRuleRequiresDay(rule)
                                                    ? formData.paydayDayOfMonth ?? 15
                                                    : undefined,
                                            });
                                            setErrors({ ...errors, paydayDayOfMonth: undefined });
                                        }}
                                        className="select select-bordered w-full text-base transition-all focus:border-primary"
                                        data-testid="payday-rule"
                                    >
                                        {(Object.keys(PAYDAY_RULE_LABELS) as PaydayRule[]).map((rule) => (
                                            <option key={rule} value={rule}>
                                                {PAYDAY_RULE_LABELS[rule]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {paydayRuleRequiresDay(formData.paydayRule ?? DEFAULT_PAYDAY_CONFIG.rule) && (
                                    <Input
                                        label="Day of month *"
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={formData.paydayDayOfMonth?.toString() ?? ''}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            setFormData({
                                                ...formData,
                                                paydayDayOfMonth: raw === '' ? undefined : Number(raw),
                                            });
                                            if (errors.paydayDayOfMonth) {
                                                setErrors({ ...errors, paydayDayOfMonth: undefined });
                                            }
                                        }}
                                        error={errors.paydayDayOfMonth}
                                        fullWidth
                                        data-testid="payday-day-of-month"
                                    />
                                )}

                                {paydayPreview && (
                                    <p className="text-xs text-base-content/70 m-0">
                                        Next paydays: <span className="font-semibold text-base-content">{paydayPreview}</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {showRecurringToggle && (
                    <div className="col-span-full">
                        <div className="flex items-center gap-2">
                            <label className="label label-text font-semibold flex items-center gap-1.5">
                                Is this transaction recurring?
                                <Tooltip content="Automatically creates a new transaction based on the selected frequency (e.g., monthly subscription).">
                                    <Info size={14} className="text-base-content/50 hover:text-primary transition-colors cursor-help" />
                                </Tooltip>
                            </label>
                        </div>
                        <div className="flex p-1 bg-base-200 rounded-lg gap-1 border border-base-300 mt-2">
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!formData.isRecurring
                                    ? 'bg-base-100 text-base-content shadow-sm font-semibold'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
                                    }`}
                                onClick={() => !expense && setFormData({ ...formData, isRecurring: false })}
                                disabled={!!expense}
                                data-testid="recurring-no"
                            >
                                No
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${formData.isRecurring
                                    ? 'bg-base-100 text-primary shadow-sm font-semibold'
                                    : 'text-base-content/60 hover:text-base-content hover:bg-base-100/50'
                                    }`}
                                onClick={() => !expense && setFormData({ ...formData, isRecurring: true, frequency: 'monthly', date: `${formData.date.substring(0, 7)}-01` })}
                                disabled={!!expense}
                                data-testid="expense-is-recurring"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                )}


            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-base-200 flex-col-reverse md:flex-row">
                <Button type="button" variant="ghost" onClick={onCancel} data-testid="cancel-button" className="w-full md:w-auto">
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting} data-testid="submit-expense-button" className="w-full md:w-auto">
                    {expense ? 'Update Transaction' : 'Add Transaction'}
                </Button>
            </div>
        </form>
    );
}
