import { useEffect, useState, useRef } from 'react';
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';
import { RecurringTransaction } from './useRecurringTransactions';
import { addDays, addMonths, addWeeks, addYears, startOfDay } from 'date-fns';

export function useProcessRecurringTransactions() {
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    const processedRef = useRef(false);

    useEffect(() => {
        if (!user || processedRef.current) return;
        processedRef.current = true;

        const processTransactions = async () => {
            setIsProcessing(true);
            try {
                // Fetch due transactions
                const today = new Date().toISOString().split('T')[0];

                const { data: dueTransactions, error } = await supabase
                    .from('recurring_transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('active', true)
                    .lte('next_run', today);

                if (error || !dueTransactions || dueTransactions.length === 0) {
                    setIsProcessing(false);
                    return;
                }

                for (const transaction of dueTransactions) {
                    const t = transaction as RecurringTransaction;
                    // Idempotency check: check if we already processed this today
                    // This is a safety check in case the ref fails or multiple tabs are open
                    if (t.last_processed === t.next_run) {
                        continue;
                    }

                    // Double check: check if an expense already exists for this date and description
                    // This prevents duplicates if the recurring transaction wasn't updated yet but expense was inserted
                    const { data: existingExpense } = await supabase
                        .from('expenses')
                        .select('id')
                        .eq('user_id', user.id)
                        .eq('description', t.description ? `${t.description} (Recurring)` : 'Recurring Transaction')
                        .eq('date', t.next_run)
                        .eq('amount', t.amount)
                        .single();

                    if (existingExpense) {
                        // Already exists, just update the recurring transaction next_run to skip forward
                        // This handles the "crashing halfway" scenario
                        console.log('Expense already exists, skipping insertion and updating next_run');
                    } else {
                        // Insert into expenses
                        const { error: insertError } = await supabase.from('expenses').insert({
                            user_id: user.id,
                            amount: t.amount,
                            category: t.category,
                            description: t.description ? `${t.description} (Recurring)` : 'Recurring Transaction',
                            type: t.type,
                            date: t.next_run,
                        });

                        if (insertError) {
                            console.error('Error processing recurring transaction', t.id, insertError);
                            continue;
                        }
                    }

                    // Calculate next run
                    let nextRun = new Date(t.next_run);
                    switch (t.frequency) {
                        case 'daily':
                            nextRun = addDays(nextRun, 1);
                            break;
                        case 'weekly':
                            nextRun = addWeeks(nextRun, 1);
                            break;
                        case 'monthly':
                            nextRun = addMonths(nextRun, 1);
                            break;
                        case 'yearly':
                            nextRun = addYears(nextRun, 1);
                            break;
                    }

                    const nextRunStr = nextRun.toISOString().split('T')[0];

                    // Update recurring transaction
                    await supabase
                        .from('recurring_transactions')
                        .update({
                            last_processed: t.next_run,
                            next_run: nextRunStr
                        })
                        .eq('id', t.id);
                }
            } catch (err) {
                console.error('Error in recurring transactions processing:', err);
            } finally {
                setIsProcessing(false);
            }
        };

        void processTransactions();
    }, [user]); // Run when user logs in/mounts

    return { isProcessing };
}
