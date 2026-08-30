// Custom hook for managing expenses with Supabase

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseFormData } from '../types';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import type { Database } from '../supabase/types';
import { getNextPaydayAfter, toDateKey } from '../utils/salaryCycle';

export interface UseExpensesReturn {
    expenses: Expense[];
    addExpense: (data: ExpenseFormData) => Promise<Expense | null>;
    addRecurringTransaction: (data: ExpenseFormData) => Promise<void>;
    updateExpense: (id: string, data: ExpenseFormData) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    getExpenseById: (id: string) => Expense | undefined;
    isLoading: boolean;
    error: string | null;
}

export function useExpenses(): UseExpensesReturn {
    const { user } = useAuth();
    const { checkLimit, openPricingModal } = useSubscription();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load expenses from Supabase
    const loadExpenses = useCallback(async () => {
        if (!user) {
            setExpenses([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { data, error } = await (supabase
                .from('expenses') as any)
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) throw error;

            // Transform database format to app format
            const transformedExpenses: Expense[] = (data || []).map((expense: Database['public']['Tables']['expenses']['Row']) => ({
                id: expense.id,
                type: expense.type,
                amount: parseFloat(expense.amount.toString()),
                category: expense.category as any,
                description: expense.description || '',
                date: expense.date,
                createdAt: expense.created_at,
                updatedAt: expense.updated_at,
                isRecurring: /(?:^|\s)\(recurring\)|recurring transaction/i.test(expense.description || ''),
            }));

            setExpenses(transformedExpenses);
            setError(null);
        } catch (err) {
            setError('Failed to load expenses');
            console.error('Error loading expenses:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Load expenses on mount and when user changes
    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    // Subscribe to real-time changes
    useEffect(() => {
        if (!user) return;

        const channel = supabase
            .channel('expenses_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'expenses',
                    filter: `user_id=eq.${user.id}`,
                },
                () => {
                    // Reload expenses when changes occur
                    loadExpenses();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, loadExpenses]);

    const addExpense = useCallback(
        async (data: ExpenseFormData): Promise<Expense | null> => {
            if (!user) {
                setError('User not authenticated');
                return null;
            }

            console.log('Current expenses count:', expenses.length);
            if (!checkLimit(expenses.length)) {
                console.log('Limit reached, opening modal');
                openPricingModal();
                return null;
            }

            try {
                const { data: newExpenseData, error } = await (supabase
                    .from('expenses') as any)
                    .insert({
                        user_id: user.id,
                        type: data.type,
                        amount: parseFloat(data.amount),
                        category: data.category,
                        description: data.isRecurring
                            ? `${data.description || ''} (Recurring)`.trim()
                            : (data.description || null),
                        date: data.date,
                    } as any)
                    .select()
                    .single();

                const newExpense = newExpenseData as unknown as Database['public']['Tables']['expenses']['Row'];

                if (error) throw error;

                const expense: Expense = {
                    id: newExpense.id,
                    type: newExpense.type as any, // Cast to any to avoid strict enum check or TransactionType
                    amount: parseFloat(newExpense.amount.toString()),
                    category: newExpense.category as any,
                    description: newExpense.description || '',
                    date: newExpense.date,
                    createdAt: newExpense.created_at || new Date().toISOString(),
                    updatedAt: newExpense.updated_at || new Date().toISOString(),
                    isRecurring: /(?:^|\s)\(recurring\)|recurring transaction/i.test(newExpense.description || ''),
                };

                setExpenses((prev) => [expense, ...prev]);
                setError(null);
                return expense;
            } catch (err) {
                setError('Failed to add expense');
                console.error('Error adding expense:', err);
                return null;
            }
        },
        [user, expenses, checkLimit, openPricingModal]
    );

    const updateExpense = useCallback(
        async (id: string, data: ExpenseFormData) => {
            if (!user) {
                setError('User not authenticated');
                return;
            }

            try {
                const { error } = await (supabase
                    .from('expenses') as any)
                    .update({
                        type: data.type,
                        amount: parseFloat(data.amount),
                        category: data.category,
                        description: data.isRecurring
                            ? `${data.description || ''} (Recurring)`.trim()
                            : (data.description || null),
                        date: data.date,
                    } as any)
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (error) throw error;

                setExpenses((prev) =>
                    prev.map((expense) =>
                        expense.id === id
                            ? {
                                ...expense,
                                type: data.type,
                                amount: parseFloat(data.amount),
                                category: data.category,
                                description: data.isRecurring
                                    ? `${data.description || ''} (Recurring)`.trim()
                                    : data.description,
                                date: data.date,
                                updatedAt: new Date().toISOString(),
                                isRecurring: data.isRecurring,
                            }
                            : expense
                    )
                );
                setError(null);
            } catch (err) {
                setError('Failed to update expense');
                console.error('Error updating expense:', err);
            }
        },
        [user]
    );

    const addRecurringTransaction = useCallback(
        async (data: ExpenseFormData) => {
            if (!user) {
                setError('User not authenticated');
                return;
            }

            if (!checkLimit(expenses.length)) {
                openPricingModal();
                return;
            }

            if (!data.isRecurring || !data.frequency) {
                setError('Invalid recurrence data');
                return;
            }

            try {
                // Only one recurring row may carry the payday rule (enforced by a
                // partial unique index), so clear any previous salary first.
                if (data.isSalary) {
                    const { error: clearError } = await (supabase
                        .from('recurring_transactions') as any)
                        .update({ payday_rule: null, payday_day_of_month: null })
                        .eq('user_id', user.id)
                        .not('payday_rule', 'is', null);

                    if (clearError) throw clearError;
                }

                const { error } = await (supabase
                    .from('recurring_transactions') as any)
                    .insert({
                        user_id: user.id,
                        amount: parseFloat(data.amount),
                        category: data.category,
                        description: data.description
                            ? (data.description.toLowerCase().includes('(recurring)') ? data.description : `${data.description} (Recurring)`)
                            : '(Recurring)',
                        type: data.type,
                        frequency: data.frequency,
                        start_date: data.date,
                        next_run: data.isSalary && data.paydayRule
                            ? toDateKey(getNextPaydayAfter(new Date(), {
                                rule: data.paydayRule,
                                dayOfMonth: data.paydayDayOfMonth,
                            }))
                            : data.date,
                        active: true,
                        payday_rule: data.isSalary ? data.paydayRule ?? null : null,
                        payday_day_of_month: data.isSalary ? data.paydayDayOfMonth ?? null : null,
                    } as any);

                if (error) throw error;
                setError(null);
            } catch (err) {
                setError('Failed to add recurring transaction');
                console.error('Error adding recurring transaction:', err);
            }
        },
        [user, expenses, checkLimit, openPricingModal]
    );

    const deleteExpense = useCallback(
        async (id: string) => {
            if (!user) {
                setError('User not authenticated');
                return;
            }

            try {
                const { error } = await (supabase
                    .from('expenses') as any)
                    .delete()
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (error) throw error;

                setExpenses((prev) => prev.filter((expense) => expense.id !== id));
                setError(null);
            } catch (err) {
                setError('Failed to delete expense');
                console.error('Error deleting expense:', err);
            }
        },
        [user]
    );

    const getExpenseById = useCallback(
        (id: string) => {
            return expenses.find((expense) => expense.id === id);
        },
        [expenses]
    );

    return {
        expenses,
        addExpense,
        addRecurringTransaction,
        updateExpense,
        deleteExpense,
        getExpenseById,
        isLoading,
        error,
    };
}
