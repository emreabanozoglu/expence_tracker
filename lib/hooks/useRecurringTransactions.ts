import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { RecurrenceFrequency, TransactionType, Category } from '../types';

export interface RecurringTransaction {
    id: string;
    amount: number;
    category: Category;
    description: string;
    type: TransactionType;
    frequency: RecurrenceFrequency;
    start_date: string;
    next_run: string;
    last_processed: string | null;
    active: boolean;
}

export function useRecurringTransactions() {
    const { user } = useAuth();
    const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadTransactions = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        const { data } = await supabase
            .from('recurring_transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('next_run', { ascending: true });

        if (data) {
            setRecurringTransactions(data as any);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        void loadTransactions();
    }, [loadTransactions]);

    const deleteTransaction = async (id: string) => {
        await supabase.from('recurring_transactions').delete().eq('id', id);
        setRecurringTransactions(prev => prev.filter(t => t.id !== id));
    };

    const updateTransaction = async (id: string, updates: Partial<Omit<RecurringTransaction, 'id' | 'created_at' | 'updated_at'>>) => {
        const { error } = await supabase
            .from('recurring_transactions')
            .update(updates)
            .eq('id', id);

        if (error) throw error;

        setRecurringTransactions(prev =>
            prev.map(t => t.id === id ? { ...t, ...updates } : t)
        );
    };

    return { recurringTransactions, isLoading, deleteTransaction, updateTransaction, loadTransactions };
}
