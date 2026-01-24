// Custom hook for managing expenses with Supabase

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseFormData } from '../types';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

export interface UseExpensesReturn {
    expenses: Expense[];
    addExpense: (data: ExpenseFormData) => Promise<Expense | null>;
    updateExpense: (id: string, data: ExpenseFormData) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    getExpenseById: (id: string) => Expense | undefined;
    isLoading: boolean;
    error: string | null;
}

export function useExpenses(): UseExpensesReturn {
    const { user } = useAuth();
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
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false });

            if (error) throw error;

            // Transform database format to app format
            const transformedExpenses: Expense[] = (data || []).map((expense) => ({
                id: expense.id,
                amount: parseFloat(expense.amount.toString()),
                category: expense.category as any,
                description: expense.description || '',
                date: expense.date,
                createdAt: expense.created_at,
                updatedAt: expense.updated_at,
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

            try {
                const { data: newExpense, error } = await supabase
                    .from('expenses')
                    .insert({
                        user_id: user.id,
                        amount: parseFloat(data.amount),
                        category: data.category,
                        description: data.description || null,
                        date: data.date,
                    })
                    .select()
                    .single();

                if (error) throw error;

                const expense: Expense = {
                    id: newExpense.id,
                    amount: parseFloat(newExpense.amount.toString()),
                    category: newExpense.category as any,
                    description: newExpense.description || '',
                    date: newExpense.date,
                    createdAt: newExpense.created_at,
                    updatedAt: newExpense.updated_at,
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
        [user]
    );

    const updateExpense = useCallback(
        async (id: string, data: ExpenseFormData) => {
            if (!user) {
                setError('User not authenticated');
                return;
            }

            try {
                const { error } = await supabase
                    .from('expenses')
                    .update({
                        amount: parseFloat(data.amount),
                        category: data.category,
                        description: data.description || null,
                        date: data.date,
                    })
                    .eq('id', id)
                    .eq('user_id', user.id);

                if (error) throw error;

                setExpenses((prev) =>
                    prev.map((expense) =>
                        expense.id === id
                            ? {
                                ...expense,
                                amount: parseFloat(data.amount),
                                category: data.category,
                                description: data.description,
                                date: data.date,
                                updatedAt: new Date().toISOString(),
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

    const deleteExpense = useCallback(
        async (id: string) => {
            if (!user) {
                setError('User not authenticated');
                return;
            }

            try {
                const { error } = await supabase
                    .from('expenses')
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
        updateExpense,
        deleteExpense,
        getExpenseById,
        isLoading,
        error,
    };
}
